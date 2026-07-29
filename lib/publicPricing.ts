import { REPAIR_PRICING } from "@/lib/repairPricing";

export interface PublicPriceRow {
  id: string;
  category: string;
  brand: string;
  model: string;
  repair: string;
  part: string;
  minPrice: number | null;
  maxPrice: number | null;
  priceLabel: string;
  time: string;
  warranty: string;
  tier: string;
  note: string;
  quoteOnly: boolean;
}

function formatPrice(minPrice: number | null, maxPrice: number | null): string {
  if (minPrice === null || maxPrice === null) return "Quote required";
  if (minPrice === maxPrice) return `£${minPrice}`;
  return `£${minPrice}–£${maxPrice}`;
}

function specialist(
  id: string,
  category: string,
  model: string,
  repair: string,
  minPrice: number,
  maxPrice: number,
  time: string,
  warranty: string,
  note = "Final price depends on the fault, condition and parts required."
): PublicPriceRow {
  return {
    id,
    category,
    brand: "All brands",
    model,
    repair,
    part: "Parts and labour",
    minPrice,
    maxPrice,
    priceLabel: formatPrice(minPrice, maxPrice),
    time,
    warranty,
    tier: "Specialist",
    note,
    quoteOnly: true,
  };
}

const MODEL_PRICES: PublicPriceRow[] = REPAIR_PRICING.map((row) => ({
  id: row.slug,
  category: row.category,
  brand: row.brand === "Generic" ? "All brands" : row.brand,
  model: row.model,
  repair: row.repairType,
  part: row.partQuality,
  minPrice: row.minPrice,
  maxPrice: row.maxPrice,
  priceLabel: formatPrice(row.minPrice, row.maxPrice),
  time: row.timeEstimate,
  warranty: row.warrantyLabel,
  tier: row.recommendedTier,
  note: row.customerNote,
  quoteOnly: row.minPrice === null || row.websiteVisibility === "Show as quote only",
}));

const SPECIALIST_PRICES: PublicPriceRow[] = [
  specialist("phone-board", "Phone", "Any phone", "Motherboard / board-level repair", 79, 249, "1–5 days", "3 months"),
  specialist("phone-liquid", "Phone", "Any phone", "Liquid damage repair", 79, 249, "1–5 days", "3 months"),
  specialist("phone-no-power", "Phone", "Any phone", "No power repair", 79, 249, "1–5 days", "3 months"),
  specialist("phone-biometric", "Phone", "Any phone", "Face ID / biometric repair", 59, 199, "1–3 days", "3 months"),
  specialist("phone-data", "Phone", "Any phone", "Data recovery", 79, 299, "2–7 days", "N/A"),

  specialist("tablet-board", "Tablet", "Any tablet", "Motherboard / board-level repair", 99, 299, "1–5 days", "3 months"),
  specialist("tablet-liquid", "Tablet", "Any tablet", "Liquid damage repair", 89, 279, "1–5 days", "3 months"),
  specialist("tablet-no-power", "Tablet", "Any tablet", "No power repair", 99, 299, "1–5 days", "3 months"),
  specialist("tablet-data", "Tablet", "Any tablet", "Data recovery", 99, 299, "2–7 days", "N/A"),

  specialist("laptop-board", "Laptop", "Any laptop", "Motherboard / logic board repair", 129, 399, "2–7 days", "3 months"),
  specialist("laptop-liquid", "Laptop", "Any laptop", "Liquid damage repair", 129, 399, "2–7 days", "3 months"),
  specialist("laptop-no-power", "Laptop", "Any laptop", "No power repair", 129, 399, "2–7 days", "3 months"),
  specialist("laptop-keyboard", "Laptop", "Any laptop", "Keyboard / trackpad repair", 99, 249, "1–3 days", "6 months"),
  specialist("laptop-upgrade", "Laptop", "Any laptop", "SSD / RAM upgrade", 69, 249, "Same day", "12 months on supplied parts"),
  specialist("laptop-overheating", "Laptop", "Any laptop", "Overheating / fan service", 49, 89, "Same day", "3 months"),
  specialist("laptop-data", "Laptop", "Any laptop", "Data recovery", 99, 499, "3–10 days", "N/A"),

  specialist("console-hdmi", "Game Console", "PlayStation / Xbox", "HDMI port repair", 59, 119, "1–3 days", "6 months"),
  specialist("console-usbc", "Game Console", "Switch / handheld", "USB-C / charging port", 59, 119, "1–3 days", "6 months"),
  specialist("console-no-power", "Game Console", "Any console", "No power repair", 79, 249, "1–5 days", "3 months"),
  specialist("console-board", "Game Console", "Any console", "Board-level repair", 89, 299, "1–5 days", "3 months"),
  specialist("console-overheating", "Game Console", "Any console", "Overheating service", 49, 89, "Same day", "3 months"),
  specialist("console-liquid", "Game Console", "Any console", "Liquid damage repair", 79, 249, "1–5 days", "3 months"),
  specialist("console-storage", "Game Console", "PlayStation / Xbox", "SSD upgrade", 79, 199, "Same day", "12 months on supplied parts"),
  specialist("console-software", "Game Console", "Any console", "Software repair", 39, 79, "Same day", "1 month"),

  specialist("pc-build", "Custom PC", "Custom PC", "Complete PC build labour", 99, 199, "1–3 days", "12 months labour"),
  specialist("pc-gpu", "Custom PC", "Custom PC", "GPU upgrade", 39, 79, "Same day", "3 months labour"),
  specialist("pc-ram", "Custom PC", "Custom PC", "RAM upgrade", 29, 59, "30 minutes", "3 months labour"),
  specialist("pc-ssd", "Custom PC", "Custom PC", "SSD upgrade", 49, 129, "1 hour", "3 months labour"),
  specialist("pc-cooling", "Custom PC", "Custom PC", "Cooling upgrade", 49, 149, "1–2 hours", "3 months labour"),
  specialist("pc-cables", "Custom PC", "Custom PC", "Cable management", 49, 99, "1–2 hours", "3 months labour"),
  specialist("pc-windows", "Custom PC", "Custom PC", "Windows installation and setup", 39, 79, "1 hour", "1 month"),
  specialist("pc-thermal", "Custom PC", "Custom PC", "Thermal paste replacement", 39, 79, "45 minutes", "3 months"),
  specialist("pc-diagnostic", "Custom PC", "Custom PC", "Hardware diagnostics", 39, 99, "Same day", "Diagnostic only"),

  specialist(
    "data-complex",
    "Data Recovery",
    "Phone / SSD / hard drive",
    "Complex data recovery",
    79,
    499,
    "2–10 days",
    "N/A",
    "Recovery price depends on media condition and the work required. Assessment is quoted first."
  ),
];

export const ALL_PUBLIC_PRICES: PublicPriceRow[] = [
  ...MODEL_PRICES,
  ...SPECIALIST_PRICES,
];

