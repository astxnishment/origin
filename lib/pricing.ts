import { REPAIR_PRICING, type RepairRow } from "@/lib/repairPricing";

export type { RepairRow };

// ── Basic lookups ─────────────────────────────────────────────────

export function getAllBrands(): string[] {
  return [...new Set(REPAIR_PRICING.filter((r) => r.brand !== "Generic").map((r) => r.brand))];
}

export function getModelsByBrand(brand: string): string[] {
  return [...new Set(REPAIR_PRICING.filter((r) => r.brand === brand).map((r) => r.model))];
}

export function getRepairTypesByModel(brand: string, model: string): string[] {
  return [
    ...new Set(
      REPAIR_PRICING.filter((r) => r.brand === brand && r.model === model).map((r) => r.repairType)
    ),
  ];
}

/** All quality tiers for a given brand + model + repair type */
export function getRepairTiers(brand: string, model: string, repairType: string): RepairRow[] {
  return REPAIR_PRICING.filter(
    (r) => r.brand === brand && r.model === model && r.repairType === repairType
  );
}

/** Cheapest non-inspection tier — used for "from £X" display */
export function getRepairPrice(
  brand: string,
  model: string,
  repairType: string
): RepairRow | undefined {
  const rows = getRepairTiers(brand, model, repairType);
  const fixed = rows.filter((r) => r.minPrice !== null);
  if (fixed.length === 0) return rows[0];
  return fixed.sort((a, b) => (a.minPrice ?? 0) - (b.minPrice ?? 0))[0];
}

/** The recommended tier (Balanced → Best non-genuine → priced fallback) */
export function getRecommendedTier(
  brand: string,
  model: string,
  repairType: string
): RepairRow | undefined {
  const rows = getRepairTiers(brand, model, repairType);
  const order = ["Balanced", "Best non-genuine", "Budget", "Premium"];
  for (const tier of order) {
    const match = rows.find((r) => r.recommendedTier === tier && r.minPrice !== null);
    if (match) return match;
  }
  return rows.find((r) => r.minPrice !== null) ?? rows[0];
}

export function formatPriceRange(min: number | null, max: number | null): string {
  if (min === null || max === null) return "Inspection required";
  if (min === max) return `£${min}`;
  return `£${min}–£${max}`;
}

/** Whether a repair has multiple quality tiers */
export function hasMultipleTiers(brand: string, model: string, repairType: string): boolean {
  return getRepairTiers(brand, model, repairType).length > 1;
}

/**
 * Whether the model has OLED as its native display.
 * Used to decide when to show the LCD vs OLED quality warning.
 */
export function isOledModel(model: string): boolean {
  // Phones that shipped with LCD (not OLED)
  const lcdModels = [
    "iPhone 8",
    "iPhone 8 Plus",
    "iPhone XR",
    "iPhone 11",
    "iPhone SE",
  ];
  if (!model.startsWith("iPhone")) return false;
  if (lcdModels.some((m) => model === m || model.startsWith(m + " "))) return false;
  return true; // iPhone X and all later models are OLED
}

export function getPopularRepairs(): RepairRow[] {
  const targets = [
    { brand: "Apple", model: "iPhone 16 Pro", repairType: "Screen Replacement" },
    { brand: "Apple", model: "iPhone 16", repairType: "Screen Replacement" },
    { brand: "Apple", model: "iPhone 16", repairType: "Battery Replacement" },
    { brand: "Samsung", model: "Galaxy S25", repairType: "Screen Replacement" },
    { brand: "Samsung", model: "Galaxy S24", repairType: "Screen Replacement" },
  ];
  return targets
    .map(({ brand, model, repairType }) => getRepairPrice(brand, model, repairType))
    .filter((r): r is RepairRow => r !== undefined);
}

/** All models for a given category (e.g. "Phone") */
export function getModelsByCategory(category: string): string[] {
  return [
    ...new Set(
      REPAIR_PRICING.filter((r) => r.category === category).map((r) => r.model)
    ),
  ];
}
