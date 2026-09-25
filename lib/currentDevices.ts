// Model names checked against official UK manufacturer pages on 22 September 2026.
// Sources and the limits of this review are recorded in docs/DEVICE-CATALOGUE-REVIEW.md.
// Listing a model enables an enquiry; it does not confirm a repair method or price.
export interface CurrentDevice {
  model: string;
  brand: "Apple" | "Samsung" | "Google Pixel";
  category: "phone" | "tablet" | "laptop";
  series: string;
}

function models(
  brand: CurrentDevice["brand"],
  category: CurrentDevice["category"],
  series: string,
  names: string[]
): CurrentDevice[] {
  return names.map((model) => ({ model, brand, category, series }));
}

export const CURRENT_DEVICE_ADDITIONS: readonly CurrentDevice[] = [
  ...models("Google Pixel", "phone", "Pixel Phone", [
    "Pixel 11 Pro Fold", "Pixel 11 Pro XL", "Pixel 11 Pro", "Pixel 11",
    "Pixel 10a", "Pixel 10 Pro Fold", "Pixel 10 Pro XL", "Pixel 10 Pro", "Pixel 10",
  ]),
  ...models("Samsung", "phone", "Galaxy S", ["Galaxy S26 Plus", "Galaxy S26 FE"]),
  ...models("Samsung", "phone", "Galaxy Z", ["Galaxy Z Fold8 Ultra", "Galaxy Z Fold8", "Galaxy Z Flip8"]),
  ...models("Samsung", "phone", "Galaxy A", ["Galaxy A57 5G", "Galaxy A37 5G"]),
  ...models("Apple", "tablet", "iPad Pro", ["iPad Pro 13-inch M5", "iPad Pro 11-inch M5"]),
  ...models("Apple", "tablet", "iPad Air", ["iPad Air 13-inch M4", "iPad Air 11-inch M4"]),
  ...models("Apple", "tablet", "iPad", ["iPad A16"]),
  ...models("Apple", "tablet", "iPad mini", ["iPad mini A17 Pro"]),
  ...models("Apple", "laptop", "MacBook Pro", [
    "MacBook Pro 16-inch M5 Max", "MacBook Pro 16-inch M5 Pro",
    "MacBook Pro 14-inch M5 Max", "MacBook Pro 14-inch M5 Pro", "MacBook Pro 14-inch M5",
  ]),
  ...models("Apple", "laptop", "MacBook Air", ["MacBook Air 15-inch M5", "MacBook Air 13-inch M5"]),
  ...models("Apple", "laptop", "MacBook Neo", ["MacBook Neo A18 Pro"]),
  ...models("Samsung", "tablet", "Galaxy Tab", ["Galaxy Tab S11 Ultra", "Galaxy Tab S11", "Galaxy Tab A11 Plus", "Galaxy Tab A11"]),
  ...models("Samsung", "laptop", "Galaxy Book", ["Galaxy Book6 Ultra", "Galaxy Book6 Pro", "Galaxy Book6"]),
];

const currentModelNames = new Set(CURRENT_DEVICE_ADDITIONS.map((device) => device.model));

export function isCurrentDeviceModel(model: string): boolean {
  return currentModelNames.has(model);
}

// This imported workbook label is a repair service rather than a device model.
export function isSelectableDeviceModel(model: string): boolean {
  return model !== "MacBook Battery Replacement";
}

export function getCurrentDeviceEnquiries(category: CurrentDevice["category"]): string[] {
  const common = [
    "Screen replacement", "Battery replacement", "Charging port repair",
    "Camera repair", "Speaker repair", "Water damage diagnostic",
    "Liquid damage repair", "Motherboard / logic board repair", "No power repair",
    "Data recovery", "Software issue", "Other repair",
  ];
  if (category === "phone") return [...common, "Back glass", "Face ID / biometric repair"];
  if (category === "laptop") return [...common, "Keyboard / trackpad repair"];
  return common;
}
