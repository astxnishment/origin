import { PUBLIC_REPAIR_CATALOGUE } from "@/lib/repairCatalogue";
import {
  buildBookingHref,
  buildRepairSlug,
  getDeviceById,
  slugToRepairType,
} from "@/lib/calculatorData";

export interface PublicPriceRow {
  id: string;
  category: string;
  brand: string;
  model: string;
  repair: string;
  part: string;
  partOrigin: string;
  minPrice: number | null;
  maxPrice: number | null;
  priceLabel: string;
  time: string;
  warranty: string;
  tier: string;
  note: string;
  quoteOnly: boolean;
  href: string;
}

function formatPrice(
  minPrice: number | null,
  maxPrice: number | null
): string {
  if (minPrice === null || maxPrice === null) return "Assessment required";
  if (minPrice === maxPrice) return `£${minPrice}`;
  return `£${minPrice}–£${maxPrice}`;
}

function categoryLabel(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const ALL_PUBLIC_PRICES: PublicPriceRow[] =
  PUBLIC_REPAIR_CATALOGUE.map((entry) => {
    const device = getDeviceById(entry.modelId);
    const repairType = slugToRepairType(entry.repairTypeId);
    const href =
      entry.source !== "specialist" && device && repairType && entry.seoEligible
        ? `/repairs/${buildRepairSlug(device, repairType)}?tier=${encodeURIComponent(entry.partTierId)}`
        : device && repairType
          ? buildBookingHref(device, repairType, entry.partTierId)
          : `/quote?category=${encodeURIComponent(entry.category)}&repair=${encodeURIComponent(entry.repairTypeId)}`;

    return {
      id: entry.id,
      category: categoryLabel(entry.category),
      brand: entry.brand,
      model: entry.model,
      repair: entry.repairType,
      part: entry.partTier,
      partOrigin: entry.partOrigin,
      minPrice: entry.minPrice,
      maxPrice: entry.maxPrice,
      priceLabel: formatPrice(entry.minPrice, entry.maxPrice),
      time: entry.estimatedTime,
      warranty: entry.warranty,
      tier: entry.recommendedTier,
      note: entry.customerNote,
      quoteOnly: entry.inspectionRequired,
      href,
    };
  });
