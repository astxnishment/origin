import { REPAIR_PRICING } from "@/lib/repairPricing";
import { GOOGLE_PIXEL_DEVICE_TYPES } from "@/lib/deviceData";

// ── Brands ────────────────────────────────────────────────────────
export const BRANDS = [
  "Apple",
  "Samsung",
  "Google Pixel",
] as const;

export type Brand = (typeof BRANDS)[number];

// ── Repair types (display names used in UI) ───────────────────────
export const REPAIR_TYPES = [
  "Screen replacement",
  "Battery replacement",
  "Back glass",
  "Charging port",
  "Camera repair",
  "Speaker / microphone",
  "Water damage diagnostics",
  "Data recovery",
] as const;

export type RepairType = (typeof REPAIR_TYPES)[number];

// Map UI repair type → Excel repair_type value (v3 workbook names)
const REPAIR_TYPE_MAP: Record<RepairType, string> = {
  "Screen replacement": "Screen Replacement",
  "Battery replacement": "Battery Replacement",
  "Back glass": "Back Glass Replacement",
  "Charging port": "Charging Port Replacement",
  "Camera repair": "Camera Lens Replacement",
  "Speaker / microphone": "Speaker / Earpiece Replacement",
  "Water damage diagnostics": "Water Damage Diagnostic",
  "Data recovery": "Data Recovery Assessment",
};

export interface DeviceModel {
  id: string;
  name: string;
  brand: Brand;
  tier: "flagship" | "mid" | "budget" | "older";
}

export interface RepairPrice {
  minPrice: number;
  maxPrice: number;
  estimatedTime: string;
  warranty: string;
  inspectionRequired?: boolean;
}

// ── Build model lists from pricing data ───────────────────────────
function modelId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function modelsFromPricing(brandName: Brand): DeviceModel[] {
  const seen = new Set<string>();
  const result: DeviceModel[] = [];
  for (const row of REPAIR_PRICING) {
    if (row.brand !== brandName || seen.has(row.model)) continue;
    seen.add(row.model);
    const name = row.model;
    const tier: DeviceModel["tier"] =
      name.includes("Pro") || name.includes("Ultra") || name.includes("Air")
        ? "flagship"
        : name.includes("SE") || name.includes(" A ")
        ? "budget"
        : "mid";
    result.push({ id: modelId(name), name, brand: brandName, tier });
  }
  return result;
}

export const APPLE_DEVICES: DeviceModel[] = modelsFromPricing("Apple");
export const SAMSUNG_DEVICES: DeviceModel[] = modelsFromPricing("Samsung");

// Build Pixel models from deviceData (not repairPricing — Pixel not in spreadsheet)
export const PIXEL_DEVICES: DeviceModel[] = GOOGLE_PIXEL_DEVICE_TYPES.flatMap((dt) =>
  dt.models.map((m) => ({
    id: modelId(m.name),
    name: m.name,
    brand: "Google Pixel" as Brand,
    tier: (m.name.includes("Pro") || m.name.includes("Fold")
      ? "flagship"
      : m.name.includes("a")
      ? "mid"
      : "mid") as DeviceModel["tier"],
  }))
);

export const ALL_DEVICES: DeviceModel[] = [...APPLE_DEVICES, ...SAMSUNG_DEVICES, ...PIXEL_DEVICES];

export function getModelsByBrand(brand: Brand): DeviceModel[] {
  return ALL_DEVICES.filter((d) => d.brand === brand);
}

// Map UI repair type → deviceData repair ID (for Pixel / Samsung lookup via deviceData)
const REPAIR_ID_MAP: Record<RepairType, string> = {
  "Screen replacement":      "screen",
  "Battery replacement":     "battery",
  "Back glass":              "back-glass",
  "Charging port":           "charging-port",
  "Camera repair":           "camera",
  "Speaker / microphone":    "speaker",
  "Water damage diagnostics":"water",
  "Data recovery":           "data-recovery",
};

// ── Price lookup ──────────────────────────────────────────────────
export function getRepairQuote(device: DeviceModel, repairType: RepairType): RepairPrice {
  const excelType = REPAIR_TYPE_MAP[repairType];

  // Google Pixel: use pricing from deviceData.ts (not repairPricing spreadsheet)
  if (device.brand === "Google Pixel") {
    const repairId = REPAIR_ID_MAP[repairType];
    const pixelModel = GOOGLE_PIXEL_DEVICE_TYPES
      .flatMap((dt) => dt.models)
      .find((m) => m.id === device.id || m.name === device.name);
    const repair = pixelModel?.repairs.find((r) => r.id === repairId);
    if (repair?.price) {
      return {
        minPrice: repair.price.from,
        maxPrice: repair.price.to ?? repair.price.from,
        estimatedTime: repair.time,
        warranty: repair.warranty,
      };
    }
    return { minPrice: 0, maxPrice: 0, estimatedTime: "Contact us", warranty: "12 months", inspectionRequired: true };
  }

  // Find the cheapest non-inspection row for this model + repair type
  const rows = REPAIR_PRICING.filter(
    (r) => r.model === device.name && r.repairType === excelType
  );

  const fixed = rows.filter((r) => r.minPrice !== null);
  if (fixed.length > 0) {
    const row = fixed.sort((a, b) => (a.minPrice ?? 0) - (b.minPrice ?? 0))[0];
    return {
      minPrice: row.minPrice!,
      maxPrice: row.maxPrice!,
      estimatedTime: row.timeEstimate,
      warranty: row.warrantyMonths > 0 ? `${row.warrantyMonths} months` : "After inspection",
    };
  }

  const inspRow = rows.find((r) => r.minPrice === null);
  if (inspRow) {
    return {
      minPrice: 0,
      maxPrice: 0,
      estimatedTime: inspRow.timeEstimate,
      warranty: "After inspection",
      inspectionRequired: true,
    };
  }

  // No data: generic placeholder
  return {
    minPrice: 0,
    maxPrice: 0,
    estimatedTime: "Contact us",
    warranty: "12 months",
    inspectionRequired: true,
  };
}

// ── Slug helpers ──────────────────────────────────────────────────
export function repairTypeToSlug(repairType: RepairType): string {
  return repairType
    .toLowerCase()
    .replace(/\s*\/\s*/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-");
}

export function slugToRepairType(slug: string): RepairType | undefined {
  return REPAIR_TYPES.find((r) => repairTypeToSlug(r) === slug);
}

export function buildRepairSlug(device: DeviceModel, repairType: RepairType): string {
  return `${device.id}-${repairTypeToSlug(repairType)}-leeds`;
}

export function parseRepairSlug(slug: string): { device: DeviceModel; repairType: RepairType } | null {
  for (const repairType of REPAIR_TYPES) {
    const repairSlug = repairTypeToSlug(repairType);
    const suffix = `-${repairSlug}-leeds`;
    if (slug.endsWith(suffix)) {
      const deviceId = slug.slice(0, slug.length - suffix.length);
      const device = ALL_DEVICES.find((d) => d.id === deviceId);
      if (device) return { device, repairType };
    }
  }
  return null;
}

export function brandToSlug(brand: Brand): string {
  return brand.toLowerCase().replace(/\s+/g, "-");
}

export function slugToBrand(slug: string): Brand | undefined {
  return BRANDS.find((b) => brandToSlug(b) === slug);
}

export function getDeviceById(id: string): DeviceModel | undefined {
  return ALL_DEVICES.find((d) => d.id === id);
}

export function buildBookingHref(device: DeviceModel, repairType: RepairType): string {
  const params = new URLSearchParams({
    brand: brandToSlug(device.brand),
    model: device.id,
    repair: repairTypeToSlug(repairType),
  });
  return `/book?${params.toString()}`;
}
