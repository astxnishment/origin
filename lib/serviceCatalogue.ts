import {
  PUBLIC_REPAIR_CATALOGUE,
  getSpecialistEntry,
  type CatalogueCategory,
  type RepairCatalogueEntry,
} from "@/lib/repairCatalogue";

type HomepageRepair = {
  label: string;
  repairTypeIds: string[];
  time: string;
};

const HOMEPAGE_REPAIRS: HomepageRepair[] = [
  {
    label: "Screen repair",
    repairTypeIds: ["screen-replacement", "screen-digitizer-replacement"],
    time: "Model and part dependent",
  },
  {
    label: "Battery replacement",
    repairTypeIds: ["battery-replacement"],
    time: "Model dependent",
  },
  {
    label: "Charging port",
    repairTypeIds: [
      "charging-port-replacement",
      "charging-port-repair",
      "charging-usb-c-port-repair",
    ],
    time: "Fault dependent",
  },
  {
    label: "Liquid assessment",
    repairTypeIds: [
      "water-damage-diagnostic",
      "liquid-damage-diagnostic",
    ],
    time: "Assessment required",
  },
];

type ServiceFilter = {
  brand?: string;
  category?: CatalogueCategory;
  model?: string;
  repairTypeIds: string[];
};

function matchingEntries(filter: ServiceFilter): RepairCatalogueEntry[] {
  return PUBLIC_REPAIR_CATALOGUE.filter(
    (entry) =>
      entry.source !== "specialist" &&
      (!filter.brand || entry.brand === filter.brand) &&
      (!filter.category || entry.category === filter.category) &&
      (!filter.model || entry.model === filter.model) &&
      filter.repairTypeIds.includes(entry.repairTypeId)
  );
}

export function getStartingPriceLabel(filter: ServiceFilter): string {
  const prices = matchingEntries(filter)
    .flatMap((entry) =>
      entry.minPrice === null ? [] : [entry.minPrice]
    )
    .sort((a, b) => a - b);

  return prices.length > 0 ? `from £${prices[0]}` : "Assessment required";
}

export function getVisibleModels(
  brand: string,
  category: CatalogueCategory
): string[] {
  return [
    ...new Set(
      PUBLIC_REPAIR_CATALOGUE.filter(
        (entry) =>
          entry.source !== "specialist" &&
          entry.brand === brand &&
          entry.category === category
      ).map((entry) => entry.model)
    ),
  ];
}

export function getSpecialistPriceLabel(
  category: CatalogueCategory,
  repairTypeId: string
): string {
  const entry = getSpecialistEntry(category, repairTypeId);
  if (!entry || entry.minPrice === null || entry.maxPrice === null) {
    return "Assessment required";
  }

  return entry.minPrice === entry.maxPrice
    ? `£${entry.minPrice}`
    : `£${entry.minPrice}–£${entry.maxPrice}`;
}

export function getHomepageRepairs(): Array<{
  label: string;
  price: string;
  time: string;
}> {
  return HOMEPAGE_REPAIRS.map((repair) => ({
    label: repair.label,
    price: getStartingPriceLabel({
      repairTypeIds: repair.repairTypeIds,
    }),
    time: repair.time,
  }));
}
