import {
  getDeviceById,
  getRepairQuote,
  getRepairTiers,
  repairTypeToSlug,
  type RepairType,
} from "@/lib/calculatorData";
import {
  getSpecialistEntry,
  type CatalogueCategory,
  type RepairCatalogueEntry,
} from "@/lib/repairCatalogue";
import type { BookingRequestInput } from "@/lib/forms/schemas";

export type ResolvedBooking = {
  deviceLabel: string;
  repairLabel: string;
  entry: RepairCatalogueEntry;
  priceLabel: string;
};

function priceLabel(entry: RepairCatalogueEntry): string {
  if (entry.minPrice === null || entry.maxPrice === null) {
    return "Assessment required";
  }
  if (entry.minPrice === entry.maxPrice) return `£${entry.minPrice}`;
  return `£${entry.minPrice}–£${entry.maxPrice}`;
}

function categoryForFreeText(
  deviceType: BookingRequestInput["deviceType"]
): CatalogueCategory | null {
  if (deviceType === "console") return "console";
  if (deviceType === "desktop") return "desktop";
  return null;
}

export function resolveBookingSelection(
  input: BookingRequestInput
): ResolvedBooking | null {
  if (["phone", "tablet", "laptop"].includes(input.deviceType)) {
    if (!input.brand || !input.modelId) return null;
    const device = getDeviceById(input.modelId, input.brand);
    if (!device || device.category !== input.deviceType) return null;

    const tiers = getRepairTiers(device, input.repair as RepairType);
    let entry: RepairCatalogueEntry | undefined;

    if (tiers.length > 1) {
      if (!input.partTierId) return null;
      entry = tiers.find((tier) => tier.partTierId === input.partTierId);
    } else if (tiers.length === 1) {
      entry = tiers[0];
    } else {
      const quote = getRepairQuote(device, input.repair as RepairType);
      if (quote.catalogueId) {
        entry = getSpecialistEntry(
          device.category,
          repairTypeToSlug(input.repair)
        );
      }
    }

    if (!entry) return null;
    if (input.catalogueId && input.catalogueId !== entry.id) return null;

    return {
      deviceLabel: `${device.brand} ${device.name}`,
      repairLabel: entry.repairType,
      entry,
      priceLabel: priceLabel(entry),
    };
  }

  const category = categoryForFreeText(input.deviceType);
  if (!category) return null;
  const entry = getSpecialistEntry(
    category,
    repairTypeToSlug(input.repair)
  );
  if (!entry) return null;
  if (input.catalogueId && input.catalogueId !== entry.id) return null;

  return {
    deviceLabel: input.model,
    repairLabel: entry.repairType,
    entry,
    priceLabel: priceLabel(entry),
  };
}
