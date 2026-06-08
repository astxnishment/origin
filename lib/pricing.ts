import { REPAIR_PRICING, type RepairRow } from "@/lib/repairPricing";

export type { RepairRow };

export function getAllBrands(): string[] {
  return [...new Set(REPAIR_PRICING.map((r) => r.brand))];
}

export function getModelsByBrand(brand: string): string[] {
  return [
    ...new Set(
      REPAIR_PRICING.filter((r) => r.brand === brand).map((r) => r.model)
    ),
  ];
}

export function getRepairTypesByModel(brand: string, model: string): string[] {
  return [
    ...new Set(
      REPAIR_PRICING.filter((r) => r.brand === brand && r.model === model).map(
        (r) => r.repairType
      )
    ),
  ];
}

export function getRepairOptions(
  brand: string,
  model: string,
  repairType: string
): RepairRow[] {
  return REPAIR_PRICING.filter(
    (r) => r.brand === brand && r.model === model && r.repairType === repairType
  );
}

export function getRepairPrice(
  brand: string,
  model: string,
  repairType: string
): RepairRow | undefined {
  // Prefer cheapest non-inspection row as the lead price
  const rows = getRepairOptions(brand, model, repairType);
  const fixed = rows.filter((r) => !r.inspectionRequired);
  if (fixed.length === 0) return rows[0];
  return fixed.sort((a, b) => (a.minPrice ?? 0) - (b.minPrice ?? 0))[0];
}

export function formatPriceRange(min: number | null, max: number | null): string {
  if (min === null || max === null) return "Inspection required";
  if (min === max) return `£${min}`;
  return `£${min}–£${max}`;
}

export function getPopularRepairs(): RepairRow[] {
  const targets = [
    { brand: "Apple", model: "iPhone 16", repairType: "Screen Replacement" },
    { brand: "Apple", model: "iPhone 16 Pro", repairType: "Screen Replacement" },
    { brand: "Apple", model: "iPhone 16", repairType: "Battery Replacement" },
    { brand: "Samsung", model: "Galaxy S25", repairType: "Screen Replacement" },
    { brand: "Samsung", model: "Galaxy S24", repairType: "Screen Replacement" },
    { brand: "Apple", model: "iPad Air 11-inch M2/M3", repairType: "Screen Replacement" },
  ];
  return targets
    .map(({ brand, model, repairType }) => getRepairPrice(brand, model, repairType))
    .filter((r): r is RepairRow => r !== undefined);
}

export function getRepairsByFamily(family: string): RepairRow[] {
  return REPAIR_PRICING.filter((r) => r.family === family);
}

export function getFamiliesByBrand(brand: string): string[] {
  return [
    ...new Set(
      REPAIR_PRICING.filter((r) => r.brand === brand).map((r) => r.family)
    ),
  ];
}
