export const BRANDS = [
  "Apple",
  "Samsung",
  "Google Pixel",
  "iPad",
  "MacBook",
  "Laptop",
  "Console",
] as const;

export type Brand = (typeof BRANDS)[number];

export const REPAIR_TYPES = [
  "Screen replacement",
  "Battery replacement",
  "Back glass",
  "Charging port",
  "Camera repair",
  "Speaker / microphone",
  "Water damage diagnostics",
  "Data recovery",
  "Full diagnostic",
] as const;

export type RepairType = (typeof REPAIR_TYPES)[number];

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
}

export interface RepairData {
  [deviceId: string]: {
    [repairType: string]: RepairPrice;
  };
}

// Apple iPhone models
export const APPLE_IPHONES: DeviceModel[] = [
  // iPhone 17 (new)
  { id: "iphone-17-pro-max", name: "iPhone 17 Pro Max", brand: "Apple", tier: "flagship" },
  { id: "iphone-17-pro", name: "iPhone 17 Pro", brand: "Apple", tier: "flagship" },
  { id: "iphone-17-air", name: "iPhone 17 Air", brand: "Apple", tier: "mid" },
  { id: "iphone-17", name: "iPhone 17", brand: "Apple", tier: "mid" },
  { id: "iphone-17e", name: "iPhone 17e", brand: "Apple", tier: "budget" },
  // iPhone 16
  { id: "iphone-16-pro-max", name: "iPhone 16 Pro Max", brand: "Apple", tier: "flagship" },
  { id: "iphone-16-pro", name: "iPhone 16 Pro", brand: "Apple", tier: "flagship" },
  { id: "iphone-16-plus", name: "iPhone 16 Plus", brand: "Apple", tier: "mid" },
  { id: "iphone-16", name: "iPhone 16", brand: "Apple", tier: "mid" },
  // iPhone 15
  { id: "iphone-15-pro-max", name: "iPhone 15 Pro Max", brand: "Apple", tier: "flagship" },
  { id: "iphone-15-pro", name: "iPhone 15 Pro", brand: "Apple", tier: "flagship" },
  { id: "iphone-15-plus", name: "iPhone 15 Plus", brand: "Apple", tier: "mid" },
  { id: "iphone-15", name: "iPhone 15", brand: "Apple", tier: "mid" },
  // iPhone 14
  { id: "iphone-14-pro-max", name: "iPhone 14 Pro Max", brand: "Apple", tier: "flagship" },
  { id: "iphone-14-pro", name: "iPhone 14 Pro", brand: "Apple", tier: "flagship" },
  { id: "iphone-14-plus", name: "iPhone 14 Plus", brand: "Apple", tier: "mid" },
  { id: "iphone-14", name: "iPhone 14", brand: "Apple", tier: "mid" },
  // iPhone 13
  { id: "iphone-13-pro-max", name: "iPhone 13 Pro Max", brand: "Apple", tier: "older" },
  { id: "iphone-13-pro", name: "iPhone 13 Pro", brand: "Apple", tier: "older" },
  { id: "iphone-13", name: "iPhone 13", brand: "Apple", tier: "older" },
  { id: "iphone-13-mini", name: "iPhone 13 mini", brand: "Apple", tier: "older" },
  // iPhone 12
  { id: "iphone-12-pro-max", name: "iPhone 12 Pro Max", brand: "Apple", tier: "older" },
  { id: "iphone-12-pro", name: "iPhone 12 Pro", brand: "Apple", tier: "older" },
  { id: "iphone-12", name: "iPhone 12", brand: "Apple", tier: "older" },
  // iPhone 11
  { id: "iphone-11-pro-max", name: "iPhone 11 Pro Max", brand: "Apple", tier: "older" },
  { id: "iphone-11-pro", name: "iPhone 11 Pro", brand: "Apple", tier: "older" },
  { id: "iphone-11", name: "iPhone 11", brand: "Apple", tier: "older" },
  // iPhone SE
  { id: "iphone-se", name: "iPhone SE", brand: "Apple", tier: "budget" },
];

// Samsung models
export const SAMSUNG_PHONES: DeviceModel[] = [
  { id: "galaxy-s24-ultra", name: "Galaxy S24 Ultra", brand: "Samsung", tier: "flagship" },
  { id: "galaxy-s24", name: "Galaxy S24", brand: "Samsung", tier: "flagship" },
  { id: "galaxy-s23-ultra", name: "Galaxy S23 Ultra", brand: "Samsung", tier: "flagship" },
  { id: "galaxy-s23", name: "Galaxy S23", brand: "Samsung", tier: "flagship" },
  { id: "galaxy-a54", name: "Galaxy A54", brand: "Samsung", tier: "mid" },
  { id: "galaxy-a34", name: "Galaxy A34", brand: "Samsung", tier: "budget" },
  { id: "galaxy-z-flip6", name: "Galaxy Z Flip 6", brand: "Samsung", tier: "flagship" },
  { id: "galaxy-z-fold6", name: "Galaxy Z Fold 6", brand: "Samsung", tier: "flagship" },
];

// Google Pixel models
export const GOOGLE_PIXELS: DeviceModel[] = [
  { id: "pixel-9-pro-xl", name: "Pixel 9 Pro XL", brand: "Google Pixel", tier: "flagship" },
  { id: "pixel-9-pro", name: "Pixel 9 Pro", brand: "Google Pixel", tier: "flagship" },
  { id: "pixel-9", name: "Pixel 9", brand: "Google Pixel", tier: "mid" },
  { id: "pixel-8-pro", name: "Pixel 8 Pro", brand: "Google Pixel", tier: "flagship" },
  { id: "pixel-8", name: "Pixel 8", brand: "Google Pixel", tier: "mid" },
];

// iPad models
export const IPADS: DeviceModel[] = [
  { id: "ipad-pro-13", name: "iPad Pro 13\"", brand: "iPad", tier: "flagship" },
  { id: "ipad-pro-11", name: "iPad Pro 11\"", brand: "iPad", tier: "flagship" },
  { id: "ipad-air", name: "iPad Air", brand: "iPad", tier: "mid" },
  { id: "ipad-11", name: "iPad (11th gen)", brand: "iPad", tier: "mid" },
  { id: "ipad-mini", name: "iPad mini", brand: "iPad", tier: "mid" },
];

// MacBook models
export const MACBOOKS: DeviceModel[] = [
  { id: "macbook-pro-16-m4", name: "MacBook Pro 16\" M4", brand: "MacBook", tier: "flagship" },
  { id: "macbook-pro-14-m4", name: "MacBook Pro 14\" M4", brand: "MacBook", tier: "flagship" },
  { id: "macbook-air-15-m3", name: "MacBook Air 15\" M3", brand: "MacBook", tier: "mid" },
  { id: "macbook-air-13-m3", name: "MacBook Air 13\" M3", brand: "MacBook", tier: "mid" },
  { id: "macbook-pro-16-m3", name: "MacBook Pro 16\" M3", brand: "MacBook", tier: "flagship" },
];

// Generic Laptop (Dell, HP, Lenovo, etc.)
export const LAPTOPS: DeviceModel[] = [
  { id: "laptop-premium", name: "Premium Laptop (XPS, ThinkPad)", brand: "Laptop", tier: "flagship" },
  { id: "laptop-mid", name: "Mid-range Laptop (HP, Dell)", brand: "Laptop", tier: "mid" },
  { id: "laptop-budget", name: "Budget Laptop", brand: "Laptop", tier: "budget" },
];

// Console
export const CONSOLES: DeviceModel[] = [
  { id: "ps5", name: "PlayStation 5", brand: "Console", tier: "flagship" },
  { id: "xbox-series-x", name: "Xbox Series X", brand: "Console", tier: "flagship" },
  { id: "nintendo-switch", name: "Nintendo Switch", brand: "Console", tier: "mid" },
];

// All devices combined
export const ALL_DEVICES: DeviceModel[] = [
  ...APPLE_IPHONES,
  ...SAMSUNG_PHONES,
  ...GOOGLE_PIXELS,
  ...IPADS,
  ...MACBOOKS,
  ...LAPTOPS,
  ...CONSOLES,
];

// Get models by brand
export function getModelsByBrand(brand: Brand): DeviceModel[] {
  return ALL_DEVICES.filter((device) => device.brand === brand);
}

// Pricing logic based on device tier and repair type
function getPricing(device: DeviceModel, repairType: RepairType): RepairPrice {
  const tierMultiplier = {
    flagship: 1.0,
    mid: 0.75,
    budget: 0.5,
    older: 0.6,
  };

  const basePricing: Record<RepairType, { min: number; max: number; time: string }> = {
    "Screen replacement": { min: 150, max: 250, time: "45 minutes" },
    "Battery replacement": { min: 80, max: 120, time: "30 minutes" },
    "Back glass": { min: 100, max: 180, time: "60 minutes" },
    "Charging port": { min: 70, max: 120, time: "60 minutes" },
    "Camera repair": { min: 80, max: 150, time: "45 minutes" },
    "Speaker / microphone": { min: 60, max: 100, time: "45 minutes" },
    "Water damage diagnostics": { min: 50, max: 120, time: "2 hours" },
    "Data recovery": { min: 150, max: 599, time: "24-48 hours" },
    "Full diagnostic": { min: 30, max: 60, time: "30 minutes" },
  };

  const base = basePricing[repairType];
  const multiplier = tierMultiplier[device.tier];

  return {
    minPrice: Math.round(base.min * multiplier),
    maxPrice: Math.round(base.max * multiplier),
    estimatedTime: base.time,
    warranty: "12 months",
  };
}

// Main calculator function
export function getRepairQuote(device: DeviceModel, repairType: RepairType): RepairPrice {
  return getPricing(device, repairType);
}

// Slug helpers for SEO pages
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
