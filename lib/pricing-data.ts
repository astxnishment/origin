export interface RepairQuote {
  minPrice: number;
  maxPrice: number;
  estimatedTime: string;
  warranty: string;
}

// Device categories and their brands
export const deviceCategories = {
  phone: {
    label: "Phone",
    brands: ["Apple", "Samsung", "Google", "Huawei", "Xiaomi", "OnePlus"],
  },
  laptop: {
    label: "Laptop",
    brands: ["Apple", "Microsoft", "Dell", "HP", "Lenovo"],
  },
  tablet: {
    label: "Tablet",
    brands: ["Apple", "Samsung", "Google"],
  },
  console: {
    label: "Console",
    brands: ["Nintendo", "PlayStation", "Xbox"],
  },
};

// Models per brand
export const deviceModels: Record<string, Record<string, string[]>> = {
  Apple: {
    phone: ["iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15"],
    laptop: ["MacBook Air M1", "MacBook Air M2", "MacBook Pro 13", "MacBook Pro 16"],
    tablet: ["iPad (10th Gen)", "iPad Air", "iPad Pro 11", "iPad Pro 12.9", "iPad Mini"],
  },
  Samsung: {
    phone: ["Galaxy S21", "Galaxy S22", "Galaxy S23", "Galaxy S24"],
    tablet: ["Galaxy Tab S9", "Galaxy Tab S10"],
  },
  Google: {
    phone: ["Pixel 6", "Pixel 7", "Pixel 8"],
    tablet: ["Pixel Tablet"],
  },
  Huawei: {
    phone: ["P30", "P40", "P50"],
  },
  Xiaomi: {
    phone: ["Mi 11", "Mi 12", "Mi 13"],
  },
  OnePlus: {
    phone: ["OnePlus 11", "OnePlus 12"],
  },
  Microsoft: {
    laptop: ["Surface Laptop 5", "Surface Laptop 6"],
    tablet: ["Surface Pro 9", "Surface Pro 10"],
  },
  Nintendo: {
    console: ["Nintendo Switch", "Nintendo Switch OLED", "Nintendo Switch Lite"],
  },
  PlayStation: {
    console: ["PlayStation 5", "PlayStation 4"],
  },
  Xbox: {
    console: ["Xbox Series X", "Xbox Series S", "Xbox One X"],
  },
};

// Repair types
export const repairTypes = [
  "Screen replacement",
  "Battery replacement",
  "Charging port",
  "Back glass",
  "Camera replacement",
  "Water damage diagnostic",
  "Data recovery",
  "Software issue",
  "Keyboard replacement",
  "Trackpad replacement",
  "HDMI port",
  "Fan cleaning",
];

// Pricing matrix: device + repair type = price range and time
export const repairPricing: Record<string, RepairQuote> = {
  // Phone repairs
  "Apple-phone-Screen replacement": { minPrice: 79, maxPrice: 149, estimatedTime: "45 min", warranty: "12 months" },
  "Apple-phone-Battery replacement": { minPrice: 49, maxPrice: 69, estimatedTime: "30 min", warranty: "12 months" },
  "Apple-phone-Charging port": { minPrice: 59, maxPrice: 89, estimatedTime: "60 min", warranty: "12 months" },
  "Apple-phone-Back glass": { minPrice: 69, maxPrice: 129, estimatedTime: "45 min", warranty: "12 months" },
  "Apple-phone-Camera replacement": { minPrice: 69, maxPrice: 149, estimatedTime: "60 min", warranty: "12 months" },
  "Apple-phone-Water damage diagnostic": { minPrice: 49, maxPrice: 149, estimatedTime: "24-48 hrs", warranty: "12 months" },
  "Apple-phone-Data recovery": { minPrice: 79, maxPrice: 199, estimatedTime: "2-7 days", warranty: "N/A" },
  "Apple-phone-Software issue": { minPrice: 39, maxPrice: 79, estimatedTime: "30-60 min", warranty: "6 months" },

  "Samsung-phone-Screen replacement": { minPrice: 69, maxPrice: 139, estimatedTime: "60 min", warranty: "12 months" },
  "Samsung-phone-Battery replacement": { minPrice: 45, maxPrice: 65, estimatedTime: "45 min", warranty: "12 months" },
  "Samsung-phone-Charging port": { minPrice: 59, maxPrice: 89, estimatedTime: "60 min", warranty: "12 months" },
  "Samsung-phone-Back glass": { minPrice: 59, maxPrice: 119, estimatedTime: "45 min", warranty: "12 months" },
  "Samsung-phone-Camera replacement": { minPrice: 59, maxPrice: 129, estimatedTime: "60 min", warranty: "12 months" },
  "Samsung-phone-Water damage diagnostic": { minPrice: 49, maxPrice: 149, estimatedTime: "24-48 hrs", warranty: "12 months" },
  "Samsung-phone-Data recovery": { minPrice: 79, maxPrice: 199, estimatedTime: "2-7 days", warranty: "N/A" },
  "Samsung-phone-Software issue": { minPrice: 39, maxPrice: 79, estimatedTime: "30-60 min", warranty: "6 months" },

  "Google-phone-Screen replacement": { minPrice: 79, maxPrice: 149, estimatedTime: "45 min", warranty: "12 months" },
  "Google-phone-Battery replacement": { minPrice: 49, maxPrice: 69, estimatedTime: "30 min", warranty: "12 months" },
  "Google-phone-Charging port": { minPrice: 59, maxPrice: 89, estimatedTime: "60 min", warranty: "12 months" },
  "Google-phone-Water damage diagnostic": { minPrice: 49, maxPrice: 149, estimatedTime: "24-48 hrs", warranty: "12 months" },
  "Google-phone-Software issue": { minPrice: 39, maxPrice: 79, estimatedTime: "30-60 min", warranty: "6 months" },

  // Laptop repairs
  "Apple-laptop-Screen replacement": { minPrice: 149, maxPrice: 299, estimatedTime: "2-3 hrs", warranty: "12 months" },
  "Apple-laptop-Battery replacement": { minPrice: 99, maxPrice: 149, estimatedTime: "90 min", warranty: "12 months" },
  "Apple-laptop-Keyboard replacement": { minPrice: 129, maxPrice: 199, estimatedTime: "2 hrs", warranty: "12 months" },
  "Apple-laptop-Trackpad replacement": { minPrice: 99, maxPrice: 179, estimatedTime: "90 min", warranty: "12 months" },
  "Apple-laptop-Water damage diagnostic": { minPrice: 79, maxPrice: 199, estimatedTime: "24-48 hrs", warranty: "12 months" },
  "Apple-laptop-Data recovery": { minPrice: 99, maxPrice: 299, estimatedTime: "3-7 days", warranty: "N/A" },
  "Apple-laptop-Fan cleaning": { minPrice: 49, maxPrice: 79, estimatedTime: "30 min", warranty: "3 months" },

  "Microsoft-laptop-Screen replacement": { minPrice: 129, maxPrice: 249, estimatedTime: "2 hrs", warranty: "12 months" },
  "Microsoft-laptop-Battery replacement": { minPrice: 89, maxPrice: 129, estimatedTime: "60 min", warranty: "12 months" },
  "Microsoft-laptop-Keyboard replacement": { minPrice: 99, maxPrice: 179, estimatedTime: "90 min", warranty: "12 months" },
  "Microsoft-laptop-Water damage diagnostic": { minPrice: 79, maxPrice: 199, estimatedTime: "24-48 hrs", warranty: "12 months" },

  // Tablet repairs
  "Apple-tablet-Screen replacement": { minPrice: 79, maxPrice: 179, estimatedTime: "90 min", warranty: "12 months" },
  "Apple-tablet-Battery replacement": { minPrice: 69, maxPrice: 99, estimatedTime: "60 min", warranty: "12 months" },
  "Apple-tablet-Charging port": { minPrice: 59, maxPrice: 89, estimatedTime: "60 min", warranty: "12 months" },
  "Apple-tablet-Water damage diagnostic": { minPrice: 49, maxPrice: 149, estimatedTime: "24-48 hrs", warranty: "12 months" },
  "Apple-tablet-Data recovery": { minPrice: 79, maxPrice: 199, estimatedTime: "2-7 days", warranty: "N/A" },

  "Samsung-tablet-Screen replacement": { minPrice: 69, maxPrice: 159, estimatedTime: "90 min", warranty: "12 months" },
  "Samsung-tablet-Battery replacement": { minPrice: 59, maxPrice: 89, estimatedTime: "60 min", warranty: "12 months" },
  "Samsung-tablet-Charging port": { minPrice: 49, maxPrice: 79, estimatedTime: "60 min", warranty: "12 months" },

  // Console repairs
  "Nintendo-console-Fan cleaning": { minPrice: 39, maxPrice: 59, estimatedTime: "30 min", warranty: "3 months" },
  "Nintendo-console-Battery replacement": { minPrice: 49, maxPrice: 79, estimatedTime: "45 min", warranty: "12 months" },
  "Nintendo-console-HDMI port": { minPrice: 69, maxPrice: 99, estimatedTime: "60 min", warranty: "12 months" },
  "Nintendo-console-Software issue": { minPrice: 29, maxPrice: 59, estimatedTime: "30 min", warranty: "6 months" },

  "PlayStation-console-Fan cleaning": { minPrice: 49, maxPrice: 79, estimatedTime: "45 min", warranty: "3 months" },
  "PlayStation-console-HDMI port": { minPrice: 79, maxPrice: 129, estimatedTime: "90 min", warranty: "12 months" },
  "PlayStation-console-Software issue": { minPrice: 39, maxPrice: 79, estimatedTime: "60 min", warranty: "6 months" },

  "Xbox-console-Fan cleaning": { minPrice: 49, maxPrice: 79, estimatedTime: "45 min", warranty: "3 months" },
  "Xbox-console-HDMI port": { minPrice: 79, maxPrice: 129, estimatedTime: "90 min", warranty: "12 months" },
  "Xbox-console-Software issue": { minPrice: 39, maxPrice: 79, estimatedTime: "60 min", warranty: "6 months" },
};

export function getRepairQuote(
  brand: string,
  category: string,
  repairType: string
): RepairQuote | null {
  const key = `${brand}-${category}-${repairType}`;
  return repairPricing[key] || null;
}
