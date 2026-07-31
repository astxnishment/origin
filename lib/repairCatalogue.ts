import { REPAIR_PRICING, type RepairRow } from "@/lib/repairPricing";
import { normaliseWarranty, warrantyForRepair } from "@/lib/warranty";

export const CATALOGUE_BRANDS = ["Apple", "Samsung", "Google Pixel"] as const;
export type CatalogueBrand = (typeof CATALOGUE_BRANDS)[number];

export type CatalogueCategory =
  | "phone"
  | "tablet"
  | "laptop"
  | "console"
  | "desktop"
  | "data-recovery";

export type PartOrigin =
  | "compatible-aftermarket"
  | "refurbished-original"
  | "pulled-original"
  | "genuine-service-part"
  | "diagnostic"
  | "not-specified";

export type CatalogueVisibility = "public" | "quote-only";

export interface RepairCatalogueEntry {
  id: string;
  category: CatalogueCategory;
  brand: string;
  series: string;
  model: string;
  modelId: string;
  repairType: string;
  repairTypeId: string;
  partTier: string;
  partTierId: string;
  partOrigin: PartOrigin;
  genuineStatus: string;
  minPrice: number | null;
  maxPrice: number | null;
  estimatedTime: string;
  warranty: string;
  inspectionRequired: boolean;
  customerNote: string;
  visibility: CatalogueVisibility;
  stockStatus: "check-availability";
  seoEligible: boolean;
  source: "pricing-workbook" | "pixel-catalogue" | "specialist";
  recommendedTier: string;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function categoryFromRow(row: RepairRow): CatalogueCategory {
  if (row.category === "Tablet") return "tablet";
  if (row.category === "Laptop") return "laptop";
  if (row.category === "Data Recovery") return "data-recovery";
  return "phone";
}

function partOrigin(row: RepairRow): PartOrigin {
  const combined = `${row.partQuality} ${row.genuineStatus}`.toLowerCase();
  if (combined.includes("diagnostic")) return "diagnostic";
  if (combined.includes("refurbished original")) return "refurbished-original";
  if (combined.includes("pulled original")) return "pulled-original";
  if (
    combined.includes("genuine apple") ||
    combined.includes("genuine samsung") ||
    combined.includes("service pack")
  ) {
    return "genuine-service-part";
  }
  if (combined.includes("compatible") || combined.includes("aftermarket")) {
    return "compatible-aftermarket";
  }
  return "not-specified";
}

function isVisible(row: RepairRow): boolean {
  return (
    row.websiteVisibility === "Show" ||
    row.websiteVisibility === "Show as quote only"
  );
}

function publicCustomerNote(row: RepairRow): string {
  if (/no recovery,\s*no fee/i.test(row.customerNote)) {
    return "Assessment determines the recovery options, price and likely timescale. No recovery outcome is guaranteed.";
  }
  return row.customerNote;
}

const WORKBOOK_ENTRIES: RepairCatalogueEntry[] = REPAIR_PRICING.filter(
  isVisible
).map((row) => {
  const warranty = warrantyForRepair(row);
  const visibility: CatalogueVisibility =
    row.websiteVisibility === "Show" ? "public" : "quote-only";

  return {
    id: row.slug,
    category: categoryFromRow(row),
    brand: row.brand,
    series: row.series,
    model: row.model,
    modelId: slugify(row.model),
    repairType: row.repairType,
    repairTypeId: slugify(row.repairType),
    partTier: row.partQuality,
    partTierId: slugify(row.partQuality),
    partOrigin: partOrigin(row),
    genuineStatus: row.genuineStatus,
    minPrice: row.minPrice,
    maxPrice: row.maxPrice,
    estimatedTime: row.timeEstimate,
    warranty: warranty.label,
    inspectionRequired: row.minPrice === null || row.maxPrice === null,
    customerNote: publicCustomerNote(row),
    visibility,
    stockStatus: "check-availability",
    seoEligible:
      visibility === "public" &&
      (row.minPrice !== null || row.partQuality === "Diagnostic Only"),
    source: "pricing-workbook",
    recommendedTier: row.recommendedTier,
  };
});

type PixelPrice = {
  screen: number;
  battery: number;
  backGlass: number;
};

const PIXEL_MODELS: ReadonlyArray<{ model: string; prices: PixelPrice }> = [
  { model: "Pixel 9 Pro Fold", prices: { screen: 249, battery: 89, backGlass: 99 } },
  { model: "Pixel 9 Pro XL", prices: { screen: 219, battery: 89, backGlass: 79 } },
  { model: "Pixel 9 Pro", prices: { screen: 199, battery: 89, backGlass: 79 } },
  { model: "Pixel 9", prices: { screen: 179, battery: 79, backGlass: 69 } },
  { model: "Pixel 9a", prices: { screen: 169, battery: 79, backGlass: 69 } },
  { model: "Pixel 8 Pro", prices: { screen: 189, battery: 79, backGlass: 69 } },
  { model: "Pixel 8", prices: { screen: 159, battery: 69, backGlass: 59 } },
  { model: "Pixel 8a", prices: { screen: 149, battery: 69, backGlass: 59 } },
  { model: "Pixel 7 Pro", prices: { screen: 159, battery: 69, backGlass: 59 } },
  { model: "Pixel 7", prices: { screen: 139, battery: 69, backGlass: 54 } },
  { model: "Pixel 7a", prices: { screen: 129, battery: 69, backGlass: 54 } },
  { model: "Pixel 6 Pro", prices: { screen: 139, battery: 69, backGlass: 54 } },
  { model: "Pixel 6", prices: { screen: 129, battery: 69, backGlass: 49 } },
  { model: "Pixel 6a", prices: { screen: 119, battery: 69, backGlass: 49 } },
  { model: "Pixel 5", prices: { screen: 99, battery: 59, backGlass: 44 } },
  { model: "Pixel 4a", prices: { screen: 79, battery: 49, backGlass: 39 } },
];

type PixelRepair = {
  id: string;
  label: string;
  price: (prices: PixelPrice) => number | [number, number] | null;
  time: string;
  warranty: string;
  diagnostic?: boolean;
  note?: string;
};

const PIXEL_REPAIRS: ReadonlyArray<PixelRepair> = [
  { id: "screen", label: "Screen replacement", price: ({ screen }) => screen, time: "45–90 mins estimate", warranty: "12 months" },
  { id: "battery", label: "Battery replacement", price: ({ battery }) => battery, time: "30–60 mins estimate", warranty: "6 months", note: "Battery status or calibration messaging may depend on the model and part selected." },
  { id: "charging-port", label: "Charging port repair", price: () => null, time: "Confirmed after assessment", warranty: "6 months" },
  { id: "back-glass", label: "Back glass replacement", price: ({ backGlass }) => backGlass, time: "1–2 hours estimate", warranty: "6 months" },
  { id: "camera", label: "Camera repair", price: () => null, time: "Confirmed after assessment", warranty: "6 months" },
  { id: "speaker", label: "Speaker repair", price: () => null, time: "Confirmed after assessment", warranty: "6 months" },
  { id: "water", label: "Water damage diagnostic", price: () => [29, 39], time: "Assessment time confirmed on receipt", warranty: "Diagnostic only", diagnostic: true, note: "Inspection only. Any cleaning, board work or parts are quoted separately." },
  { id: "liquid-repair", label: "Liquid damage repair", price: () => [79, 249], time: "1–5 days estimate", warranty: "3 months", note: "Price and any warranty depend on the damage found and the work approved." },
  { id: "motherboard", label: "Motherboard repair", price: () => [79, 249], time: "1–5 days estimate", warranty: "3 months" },
  { id: "no-power", label: "No power repair", price: () => [79, 249], time: "1–5 days estimate", warranty: "3 months" },
  { id: "data-recovery", label: "Data recovery", price: () => [79, 299], time: "2–7 days estimate", warranty: "Not applicable", note: "Recovery depends on device condition and no outcome is guaranteed." },
  { id: "software", label: "Software issue", price: () => 29, time: "30–60 mins estimate", warranty: "1 month" },
];

const PIXEL_ENTRIES: RepairCatalogueEntry[] = PIXEL_MODELS.flatMap(
  ({ model, prices }) =>
    PIXEL_REPAIRS.map((repair) => {
      const price = repair.price(prices);
      const minPrice = Array.isArray(price) ? price[0] : price;
      const maxPrice = Array.isArray(price) ? price[1] : price;
      const modelId = slugify(model);

      return {
        id: `google-pixel-${modelId}-${repair.id}`,
        category: "phone",
        brand: "Google Pixel",
        series: "Pixel Phone",
        model,
        modelId,
        repairType: repair.label,
        repairTypeId: slugify(repair.label),
        partTier: repair.diagnostic
          ? "Diagnostic only"
          : "Part option confirmed before repair",
        partTierId: repair.diagnostic
          ? "diagnostic-only"
          : "confirmed-before-repair",
        partOrigin: repair.diagnostic ? "diagnostic" : "not-specified",
        genuineStatus: repair.diagnostic ? "" : "Not specified",
        minPrice,
        maxPrice,
        estimatedTime: repair.time,
        warranty: normaliseWarranty(repair.warranty).label,
        inspectionRequired: price === null,
        customerNote:
          repair.note ??
          "Part type and availability are confirmed before repair.",
        visibility: "public",
        stockStatus: "check-availability",
        seoEligible: price !== null,
        source: "pixel-catalogue",
        recommendedTier: "Confirmed before repair",
      };
    })
);

type SpecialistInput = {
  id: string;
  category: CatalogueCategory;
  model: string;
  repairType: string;
  minPrice: number;
  maxPrice: number;
  estimatedTime: string;
  warranty: string;
  note?: string;
};

function specialist(input: SpecialistInput): RepairCatalogueEntry {
  return {
    id: input.id,
    category: input.category,
    brand: "All brands",
    series: "Specialist repairs",
    model: input.model,
    modelId: slugify(input.model),
    repairType: input.repairType,
    repairTypeId: slugify(input.repairType),
    partTier: "Parts and labour confirmed after assessment",
    partTierId: "assessment",
    partOrigin: "not-specified",
    genuineStatus: "Not specified",
    minPrice: input.minPrice,
    maxPrice: input.maxPrice,
    estimatedTime: input.estimatedTime,
    warranty: normaliseWarranty(input.warranty).label,
    inspectionRequired: true,
    customerNote:
      input.note ??
      "Final price depends on the fault, condition and parts required.",
    visibility: "public",
    stockStatus: "check-availability",
    seoEligible: false,
    source: "specialist",
    recommendedTier: "Assessment",
  };
}

const SPECIALIST_ENTRIES: RepairCatalogueEntry[] = [
  specialist({ id: "phone-board", category: "phone", model: "Any phone", repairType: "Motherboard / logic board", minPrice: 79, maxPrice: 249, estimatedTime: "1–5 days", warranty: "3 months" }),
  specialist({ id: "phone-liquid", category: "phone", model: "Any phone", repairType: "Liquid damage repair", minPrice: 79, maxPrice: 249, estimatedTime: "1–5 days", warranty: "3 months" }),
  specialist({ id: "phone-no-power", category: "phone", model: "Any phone", repairType: "No power repair", minPrice: 79, maxPrice: 249, estimatedTime: "1–5 days", warranty: "3 months" }),
  specialist({ id: "phone-biometric", category: "phone", model: "Any phone", repairType: "Face ID / biometric repair", minPrice: 59, maxPrice: 199, estimatedTime: "1–3 days", warranty: "3 months" }),
  specialist({ id: "phone-data", category: "phone", model: "Any phone", repairType: "Data recovery", minPrice: 79, maxPrice: 299, estimatedTime: "2–7 days", warranty: "Not applicable" }),
  specialist({ id: "tablet-board", category: "tablet", model: "Any tablet", repairType: "Motherboard / logic board", minPrice: 99, maxPrice: 299, estimatedTime: "1–5 days", warranty: "3 months" }),
  specialist({ id: "tablet-liquid", category: "tablet", model: "Any tablet", repairType: "Liquid damage repair", minPrice: 89, maxPrice: 279, estimatedTime: "1–5 days", warranty: "3 months" }),
  specialist({ id: "tablet-no-power", category: "tablet", model: "Any tablet", repairType: "No power repair", minPrice: 99, maxPrice: 299, estimatedTime: "1–5 days", warranty: "3 months" }),
  specialist({ id: "tablet-data", category: "tablet", model: "Any tablet", repairType: "Data recovery", minPrice: 99, maxPrice: 299, estimatedTime: "2–7 days", warranty: "Not applicable" }),
  specialist({ id: "laptop-board", category: "laptop", model: "Any laptop", repairType: "Motherboard / logic board", minPrice: 129, maxPrice: 399, estimatedTime: "2–7 days", warranty: "3 months" }),
  specialist({ id: "laptop-liquid", category: "laptop", model: "Any laptop", repairType: "Liquid damage repair", minPrice: 129, maxPrice: 399, estimatedTime: "2–7 days", warranty: "3 months" }),
  specialist({ id: "laptop-no-power", category: "laptop", model: "Any laptop", repairType: "No power repair", minPrice: 129, maxPrice: 399, estimatedTime: "2–7 days", warranty: "3 months" }),
  specialist({ id: "laptop-keyboard", category: "laptop", model: "Any laptop", repairType: "Keyboard / trackpad repair", minPrice: 99, maxPrice: 249, estimatedTime: "1–3 days", warranty: "6 months" }),
  specialist({ id: "laptop-upgrade", category: "laptop", model: "Any laptop", repairType: "SSD / RAM upgrade", minPrice: 69, maxPrice: 249, estimatedTime: "Same day estimate", warranty: "12 months on supplied parts" }),
  specialist({ id: "laptop-overheating", category: "laptop", model: "Any laptop", repairType: "Overheating / fan service", minPrice: 49, maxPrice: 89, estimatedTime: "Same day estimate", warranty: "3 months" }),
  specialist({ id: "laptop-data", category: "laptop", model: "Any laptop", repairType: "Data recovery", minPrice: 99, maxPrice: 499, estimatedTime: "3–10 days", warranty: "Not applicable" }),
  specialist({ id: "console-hdmi", category: "console", model: "PlayStation / Xbox", repairType: "HDMI port repair", minPrice: 59, maxPrice: 119, estimatedTime: "1–3 days", warranty: "6 months" }),
  specialist({ id: "console-usbc", category: "console", model: "Switch / handheld", repairType: "Charging port", minPrice: 59, maxPrice: 119, estimatedTime: "1–3 days", warranty: "6 months" }),
  specialist({ id: "console-no-power", category: "console", model: "Any console", repairType: "No power repair", minPrice: 79, maxPrice: 249, estimatedTime: "1–5 days", warranty: "3 months" }),
  specialist({ id: "console-board", category: "console", model: "Any console", repairType: "Motherboard / logic board", minPrice: 89, maxPrice: 299, estimatedTime: "1–5 days", warranty: "3 months" }),
  specialist({ id: "console-overheating", category: "console", model: "Any console", repairType: "Overheating / fan service", minPrice: 49, maxPrice: 89, estimatedTime: "Same day estimate", warranty: "3 months" }),
  specialist({ id: "console-liquid", category: "console", model: "Any console", repairType: "Liquid damage repair", minPrice: 79, maxPrice: 249, estimatedTime: "1–5 days", warranty: "3 months" }),
  specialist({ id: "console-software", category: "console", model: "Any console", repairType: "Software / OS issue", minPrice: 39, maxPrice: 79, estimatedTime: "Same day estimate", warranty: "1 month" }),
  specialist({ id: "pc-build", category: "desktop", model: "Custom PC", repairType: "Custom PC build", minPrice: 99, maxPrice: 199, estimatedTime: "1–3 days", warranty: "12 months labour" }),
  specialist({ id: "pc-gpu", category: "desktop", model: "Custom PC", repairType: "GPU / cooling upgrade", minPrice: 39, maxPrice: 149, estimatedTime: "1–2 hours", warranty: "3 months labour" }),
  specialist({ id: "pc-upgrade", category: "desktop", model: "Custom PC", repairType: "SSD / RAM upgrade", minPrice: 29, maxPrice: 129, estimatedTime: "30–90 minutes", warranty: "12 months on supplied parts" }),
  specialist({ id: "pc-no-power", category: "desktop", model: "Custom PC", repairType: "No power repair", minPrice: 59, maxPrice: 249, estimatedTime: "1–3 days", warranty: "3 months" }),
  specialist({ id: "pc-board", category: "desktop", model: "Custom PC", repairType: "Motherboard / logic board", minPrice: 79, maxPrice: 299, estimatedTime: "1–5 days", warranty: "3 months" }),
  specialist({ id: "pc-liquid", category: "desktop", model: "Desktop / custom PC", repairType: "Liquid damage repair", minPrice: 99, maxPrice: 399, estimatedTime: "2–7 days", warranty: "3 months" }),
  specialist({ id: "pc-overheating", category: "desktop", model: "Custom PC", repairType: "Overheating / fan service", minPrice: 39, maxPrice: 99, estimatedTime: "Same day estimate", warranty: "3 months" }),
  specialist({ id: "pc-software", category: "desktop", model: "Custom PC", repairType: "Software / OS issue", minPrice: 39, maxPrice: 79, estimatedTime: "1 hour estimate", warranty: "1 month" }),
  specialist({ id: "pc-data", category: "desktop", model: "Custom PC", repairType: "Data recovery", minPrice: 99, maxPrice: 499, estimatedTime: "3–10 days", warranty: "Not applicable" }),
  specialist({ id: "pc-diagnostic", category: "desktop", model: "Custom PC", repairType: "Hardware diagnostics", minPrice: 39, maxPrice: 99, estimatedTime: "Same day assessment", warranty: "Diagnostic only" }),
  specialist({ id: "data-complex", category: "data-recovery", model: "Phone / SSD / hard drive", repairType: "Data recovery", minPrice: 79, maxPrice: 499, estimatedTime: "2–10 days", warranty: "Not applicable", note: "Recovery price depends on media condition and the work required. Assessment is quoted first; no outcome is guaranteed." }),
];

export const REPAIR_CATALOGUE: readonly RepairCatalogueEntry[] = [
  ...WORKBOOK_ENTRIES,
  ...PIXEL_ENTRIES,
  ...SPECIALIST_ENTRIES,
];

export const PUBLIC_REPAIR_CATALOGUE = REPAIR_CATALOGUE.filter(
  (entry) =>
    entry.visibility === "public" || entry.visibility === "quote-only"
);

export function getCatalogueEntry(
  id: string
): RepairCatalogueEntry | undefined {
  return PUBLIC_REPAIR_CATALOGUE.find((entry) => entry.id === id);
}

export function getModelEntries(
  modelId: string
): RepairCatalogueEntry[] {
  return PUBLIC_REPAIR_CATALOGUE.filter(
    (entry) =>
      entry.source !== "specialist" && entry.modelId === modelId
  );
}

export function getRepairTiers(
  modelId: string,
  repairTypeId: string
): RepairCatalogueEntry[] {
  return getModelEntries(modelId).filter(
    (entry) => entry.repairTypeId === repairTypeId
  );
}

export function isRepairSupported(
  modelId: string,
  repairTypeId: string
): boolean {
  return getRepairTiers(modelId, repairTypeId).length > 0;
}

export function selectRecommendedTier(
  entries: RepairCatalogueEntry[]
): RepairCatalogueEntry | undefined {
  if (entries.length === 1) return entries[0];

  const order = ["Balanced", "Best non-genuine", "Premium", "Budget"];
  for (const tier of order) {
    const match = entries.find((entry) => entry.recommendedTier === tier);
    if (match) return match;
  }

  return entries[0];
}

export function getSpecialistEntry(
  category: CatalogueCategory,
  repairTypeId: string
): RepairCatalogueEntry | undefined {
  return SPECIALIST_ENTRIES.find(
    (entry) =>
      entry.category === category && entry.repairTypeId === repairTypeId
  );
}

export function getSeoEligibleEntries(): RepairCatalogueEntry[] {
  const unique = new Map<string, RepairCatalogueEntry>();

  for (const entry of PUBLIC_REPAIR_CATALOGUE) {
    if (!entry.seoEligible || entry.source === "specialist") continue;
    const key = `${entry.modelId}:${entry.repairTypeId}`;
    const current = unique.get(key);
    if (!current || entry.recommendedTier === "Balanced") {
      unique.set(key, entry);
    }
  }

  return [...unique.values()];
}
