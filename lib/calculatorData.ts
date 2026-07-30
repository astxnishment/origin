import {
  CATALOGUE_BRANDS,
  PUBLIC_REPAIR_CATALOGUE,
  getModelEntries,
  getSpecialistEntry,
  isRepairSupported as catalogueSupportsRepair,
  selectRecommendedTier,
  slugify,
  type CatalogueBrand,
  type CatalogueCategory,
  type RepairCatalogueEntry,
} from "@/lib/repairCatalogue";

export const BRANDS = CATALOGUE_BRANDS;
export type Brand = CatalogueBrand;

export const REPAIR_TYPES = [
  "Screen replacement",
  "Battery replacement",
  "Back glass",
  "Charging port",
  "Camera repair",
  "Speaker / microphone",
  "Water damage diagnostics",
  "Liquid damage repair",
  "Data recovery",
  "Motherboard / logic board",
  "No power repair",
  "Face ID / biometric repair",
  "Keyboard / trackpad repair",
  "SSD / RAM upgrade",
  "HDMI port repair",
  "Overheating / fan service",
  "Software / OS issue",
  "Custom PC build",
  "GPU / cooling upgrade",
  "Hardware diagnostics",
  "Other repair",
] as const;

export type RepairType = (typeof REPAIR_TYPES)[number];
export type DeviceCategory = "phone" | "tablet" | "laptop";

const SOURCE_REPAIR_IDS: Record<RepairType, string[]> = {
  "Screen replacement": ["screen-replacement"],
  "Battery replacement": ["battery-replacement"],
  "Back glass": ["back-glass-replacement", "back-glass"],
  "Charging port": [
    "charging-port-replacement",
    "charging-port-repair",
    "charging-usb-c-port-repair",
  ],
  "Camera repair": ["camera-lens-replacement", "camera-repair"],
  "Speaker / microphone": [
    "speaker-earpiece-replacement",
    "speaker-repair",
  ],
  "Water damage diagnostics": [
    "water-damage-diagnostic",
    "liquid-damage-diagnostic",
  ],
  "Liquid damage repair": ["liquid-damage-repair"],
  "Data recovery": ["data-recovery", "data-recovery-assessment"],
  "Motherboard / logic board": [
    "motherboard-repair",
    "logic-board-repair",
    "motherboard-board-level-repair",
    "motherboard-logic-board-repair",
  ],
  "No power repair": ["no-power-repair"],
  "Face ID / biometric repair": [
    "face-id-biometric-repair",
    "face-id-biometric-repair",
  ],
  "Keyboard / trackpad repair": [
    "keyboard-replacement",
    "trackpad-repair",
    "keyboard-trackpad-repair",
  ],
  "SSD / RAM upgrade": ["ssd-ram-upgrade"],
  "HDMI port repair": ["hdmi-port-repair"],
  "Overheating / fan service": ["overheating-fan-service"],
  "Software / OS issue": ["software-issue", "software-os-issue"],
  "Custom PC build": ["custom-pc-build"],
  "GPU / cooling upgrade": ["gpu-cooling-upgrade"],
  "Hardware diagnostics": ["hardware-diagnostics"],
  "Other repair": ["other-repair"],
};

export interface DeviceModel {
  id: string;
  name: string;
  brand: Brand;
  category: DeviceCategory;
  tier: "flagship" | "mid" | "budget" | "older";
}

export interface RepairPrice {
  minPrice: number;
  maxPrice: number;
  estimatedTime: string;
  warranty: string;
  inspectionRequired?: boolean;
  catalogueId?: string;
  partTierId?: string;
  partTier?: string;
  partOrigin?: string;
  supported?: boolean;
}

function modelTier(name: string): DeviceModel["tier"] {
  if (/pro|max|ultra|fold|air/i.test(name)) return "flagship";
  if (/se|mini| a\d/i.test(name)) return "budget";
  return "mid";
}

const deviceMap = new Map<string, DeviceModel>();
for (const entry of PUBLIC_REPAIR_CATALOGUE) {
  if (
    entry.source === "specialist" ||
    !CATALOGUE_BRANDS.includes(entry.brand as Brand) ||
    !["phone", "tablet", "laptop"].includes(entry.category)
  ) {
    continue;
  }

  deviceMap.set(`${entry.brand}:${entry.modelId}`, {
    id: entry.modelId,
    name: entry.model,
    brand: entry.brand as Brand,
    category: entry.category as DeviceCategory,
    tier: modelTier(entry.model),
  });
}

export const ALL_DEVICES = [...deviceMap.values()];
export const APPLE_DEVICES = ALL_DEVICES.filter((d) => d.brand === "Apple");
export const SAMSUNG_DEVICES = ALL_DEVICES.filter((d) => d.brand === "Samsung");
export const PIXEL_DEVICES = ALL_DEVICES.filter(
  (d) => d.brand === "Google Pixel"
);

export function getModelsByBrand(brand: Brand): DeviceModel[] {
  return ALL_DEVICES.filter((device) => device.brand === brand);
}

export function deviceCategory(device: DeviceModel): DeviceCategory {
  return device.category;
}

export function repairTypeToSlug(repairType: RepairType): string {
  return slugify(repairType);
}

function repairIds(repairType: RepairType): string[] {
  return SOURCE_REPAIR_IDS[repairType];
}

export function getRepairTiers(
  device: DeviceModel,
  repairType: RepairType
): RepairCatalogueEntry[] {
  const ids = repairIds(repairType);
  return getModelEntries(device.id).filter(
    (entry) => entry.brand === device.brand && ids.includes(entry.repairTypeId)
  );
}

export function isRepairSupported(
  deviceId: string,
  repairTypeId: string
): boolean {
  const device = getDeviceById(deviceId);
  if (!device) return false;

  const repairType = REPAIR_TYPES.find(
    (candidate) => repairTypeToSlug(candidate) === repairTypeId
  );
  if (!repairType) return false;

  if (
    repairIds(repairType).some((id) =>
      catalogueSupportsRepair(deviceId, id)
    )
  ) {
    return true;
  }

  return Boolean(
    getSpecialistEntry(
      device.category as CatalogueCategory,
      repairTypeToSlug(repairType)
    )
  );
}

export function getSupportedRepairTypes(
  device: DeviceModel
): RepairType[] {
  return REPAIR_TYPES.filter((repairType) => {
    const direct = getRepairTiers(device, repairType).length > 0;
    const specialist = getSpecialistEntry(
      device.category,
      repairTypeToSlug(repairType)
    );
    return direct || Boolean(specialist);
  });
}

export function getRepairQuote(
  device: DeviceModel,
  repairType: RepairType,
  partTierId?: string
): RepairPrice {
  const tiers = getRepairTiers(device, repairType);
  const selected = partTierId
    ? tiers.find((entry) => entry.partTierId === partTierId)
    : selectRecommendedTier(tiers);
  const entry =
    selected ??
    getSpecialistEntry(device.category, repairTypeToSlug(repairType));

  if (!entry) {
    return {
      minPrice: 0,
      maxPrice: 0,
      estimatedTime: "Confirmed after assessment",
      warranty: "Confirmed after inspection",
      inspectionRequired: true,
      supported: false,
    };
  }

  return {
    minPrice: entry.minPrice ?? 0,
    maxPrice: entry.maxPrice ?? 0,
    estimatedTime: entry.estimatedTime,
    warranty: entry.warranty,
    inspectionRequired: entry.inspectionRequired,
    catalogueId: entry.id,
    partTierId: entry.partTierId,
    partTier: entry.partTier,
    partOrigin: entry.partOrigin,
    supported: true,
  };
}

export function slugToRepairType(
  slug: string
): RepairType | undefined {
  return REPAIR_TYPES.find((repairType) => repairTypeToSlug(repairType) === slug);
}

export function buildRepairSlug(
  device: DeviceModel,
  repairType: RepairType
): string {
  return `${device.id}-${repairTypeToSlug(repairType)}-leeds`;
}

export function parseRepairSlug(
  slug: string
): { device: DeviceModel; repairType: RepairType } | null {
  for (const repairType of REPAIR_TYPES) {
    const suffix = `-${repairTypeToSlug(repairType)}-leeds`;
    if (!slug.endsWith(suffix)) continue;

    const deviceId = slug.slice(0, slug.length - suffix.length);
    const device = getDeviceById(deviceId);
    if (
      device &&
      isRepairSupported(device.id, repairTypeToSlug(repairType))
    ) {
      return { device, repairType };
    }
  }

  return null;
}

export function brandToSlug(brand: Brand): string {
  return slugify(brand);
}

export function slugToBrand(slug: string): Brand | undefined {
  return BRANDS.find((brand) => brandToSlug(brand) === slug);
}

export function getDeviceById(
  id: string,
  brand?: Brand
): DeviceModel | undefined {
  return ALL_DEVICES.find(
    (device) => device.id === id && (!brand || device.brand === brand)
  );
}

export function buildBookingHref(
  device: DeviceModel,
  repairType: RepairType,
  partTierId?: string
): string {
  const params = new URLSearchParams({
    brand: brandToSlug(device.brand),
    model: device.id,
    repair: repairTypeToSlug(repairType),
  });
  if (partTierId) params.set("tier", partTierId);
  return `/book?${params.toString()}`;
}
