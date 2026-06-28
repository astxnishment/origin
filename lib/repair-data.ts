// Repair types available across all devices
export const REPAIR_TYPES = [
  "Screen replacement",
  "Battery replacement",
  "Charging port",
  "Back glass",
  "Camera replacement",
  "Speaker repair",
  "Microphone repair",
  "Water damage diagnostic",
  "Liquid damage repair",
  "Data recovery",
  "Motherboard repair",
  "No power repair",
  "Face ID / biometric repair",
  "Software repair",
  "Keyboard replacement",
  "Trackpad replacement",
  "SSD upgrade",
  "RAM upgrade",
  "HDMI port repair",
  "USB-C / charging port",
  "Board-level repair",
  "Overheating service",
  "Fan cleaning",
  "Thermal paste replacement",
  "Custom PC build",
  "GPU upgrade",
  "Cooling upgrade",
  "Cable management",
  "Windows install & setup",
] as const;

export type RepairType = (typeof REPAIR_TYPES)[number];

// Device categories
export const DEVICE_CATEGORIES = ["Phone", "Tablet", "Laptop", "Console"] as const;
export type DeviceCategory = (typeof DEVICE_CATEGORIES)[number];

// Repair pricing info per device
export interface RepairInfo {
  type: RepairType;
  minPrice: number;
  maxPrice: number;
  estimatedTime: string;
  warranty: string;
}

// Device interface
export interface Device {
  id: string;
  brand: string;
  category: DeviceCategory;
  model: string;
  displayName: string;
  repairs: RepairInfo[];
}

// Helper function to create repairs with consistent defaults
function createRepair(
  type: RepairType,
  minPrice: number,
  maxPrice: number,
  estimatedTime: string,
  warranty: string
): RepairInfo {
  return {
    type,
    minPrice,
    maxPrice,
    estimatedTime,
    warranty,
  };
}

// ============================================================================
// APPLE DEVICES
// ============================================================================

const applePhoneRepairs = {
  screen: createRepair("Screen replacement", 39, 224, "45-90 min", "12 months"),
  battery: createRepair("Battery replacement", 24, 79, "30-60 min", "12 months"),
  charging: createRepair("Charging port", 59, 109, "1-2 hrs", "6 months"),
  backGlass: createRepair("Back glass", 49, 149, "1-2 hrs", "6 months"),
  camera: createRepair("Camera replacement", 59, 169, "60 min", "6 months"),
  speaker: createRepair("Speaker repair", 49, 79, "45 min", "12 months"),
  microphone: createRepair("Microphone repair", 39, 69, "45 min", "12 months"),
  waterDamage: createRepair(
    "Water damage diagnostic",
    29,
    49,
    "Same day",
    "Diagnostic only"
  ),
  liquidRepair: createRepair("Liquid damage repair", 79, 249, "1-5 days", "3 months"),
  dataRecovery: createRepair("Data recovery", 79, 299, "2-7 days", "N/A"),
  motherboard: createRepair("Motherboard repair", 79, 249, "1-5 days", "3 months"),
  noPower: createRepair("No power repair", 79, 249, "1-5 days", "3 months"),
  faceId: createRepair("Face ID / biometric repair", 79, 199, "1-3 days", "3 months"),
  softwareRepair: createRepair("Software repair", 29, 79, "30-60 min", "1 month"),
};

const appleIpadRepairs = {
  screen: createRepair("Screen replacement", 79, 299, "1-2 days", "6 months"),
  battery: createRepair("Battery replacement", 69, 139, "1-2 days", "6 months"),
  charging: createRepair("Charging port", 59, 129, "1-2 days", "6 months"),
  backGlass: createRepair("Back glass", 69, 149, "1-2 days", "6 months"),
  camera: createRepair("Camera replacement", 59, 129, "60 min", "6 months"),
  speaker: createRepair("Speaker repair", 49, 79, "45 min", "12 months"),
  waterDamage: createRepair(
    "Water damage diagnostic",
    29,
    49,
    "Same day",
    "Diagnostic only"
  ),
  liquidRepair: createRepair("Liquid damage repair", 89, 279, "1-5 days", "3 months"),
  dataRecovery: createRepair("Data recovery", 99, 299, "2-7 days", "N/A"),
  motherboard: createRepair("Motherboard repair", 99, 299, "1-5 days", "3 months"),
  noPower: createRepair("No power repair", 99, 299, "1-5 days", "3 months"),
  softwareRepair: createRepair("Software repair", 39, 79, "30-60 min", "6 months"),
};

const appleMacbookRepairs = {
  screen: createRepair("Screen replacement", 199, 449, "1-3 days", "6 months"),
  battery: createRepair("Battery replacement", 99, 179, "1-2 days", "6 months"),
  keyboard: createRepair("Keyboard replacement", 129, 249, "1-3 days", "6 months"),
  trackpad: createRepair("Trackpad replacement", 99, 199, "1-2 days", "6 months"),
  ssdUpgrade: createRepair("SSD upgrade", 79, 249, "60 min", "12 months"),
  ramUpgrade: createRepair("RAM upgrade", 69, 129, "60 min", "12 months"),
  waterDamage: createRepair(
    "Water damage diagnostic",
    49,
    79,
    "Same day",
    "Diagnostic only"
  ),
  liquidRepair: createRepair("Liquid damage repair", 129, 399, "2-7 days", "3 months"),
  dataRecovery: createRepair("Data recovery", 99, 499, "3-10 days", "N/A"),
  motherboard: createRepair("Motherboard repair", 129, 399, "2-7 days", "3 months"),
  noPower: createRepair("No power repair", 129, 399, "2-7 days", "3 months"),
  softwareRepair: createRepair("Software repair", 49, 99, "60 min", "6 months"),
  fanCleaning: createRepair("Fan cleaning", 49, 79, "30 min", "3 months"),
  thermalPaste: createRepair(
    "Thermal paste replacement",
    39,
    79,
    "45 min",
    "6 months"
  ),
};

// Apple iPhone models
export const APPLE_IPHONES: Device[] = [
  // iPhone 16 Series
  {
    id: "apple-iphone-16",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 16",
    displayName: "iPhone 16",
    repairs: Object.values(applePhoneRepairs),
  },
  {
    id: "apple-iphone-16-plus",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 16 Plus",
    displayName: "iPhone 16 Plus",
    repairs: Object.values(applePhoneRepairs),
  },
  {
    id: "apple-iphone-16-pro",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 16 Pro",
    displayName: "iPhone 16 Pro",
    repairs: Object.values(applePhoneRepairs),
  },
  {
    id: "apple-iphone-16-pro-max",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 16 Pro Max",
    displayName: "iPhone 16 Pro Max",
    repairs: Object.values(applePhoneRepairs),
  },
  // iPhone 15 Series
  {
    id: "apple-iphone-15",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 15",
    displayName: "iPhone 15",
    repairs: Object.values(applePhoneRepairs),
  },
  {
    id: "apple-iphone-15-plus",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 15 Plus",
    displayName: "iPhone 15 Plus",
    repairs: Object.values(applePhoneRepairs),
  },
  {
    id: "apple-iphone-15-pro",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 15 Pro",
    displayName: "iPhone 15 Pro",
    repairs: Object.values(applePhoneRepairs),
  },
  {
    id: "apple-iphone-15-pro-max",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 15 Pro Max",
    displayName: "iPhone 15 Pro Max",
    repairs: Object.values(applePhoneRepairs),
  },
  // iPhone 14 Series
  {
    id: "apple-iphone-14",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 14",
    displayName: "iPhone 14",
    repairs: Object.values(applePhoneRepairs),
  },
  {
    id: "apple-iphone-14-plus",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 14 Plus",
    displayName: "iPhone 14 Plus",
    repairs: Object.values(applePhoneRepairs),
  },
  {
    id: "apple-iphone-14-pro",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 14 Pro",
    displayName: "iPhone 14 Pro",
    repairs: Object.values(applePhoneRepairs),
  },
  {
    id: "apple-iphone-14-pro-max",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 14 Pro Max",
    displayName: "iPhone 14 Pro Max",
    repairs: Object.values(applePhoneRepairs),
  },
  // iPhone 13 Series
  {
    id: "apple-iphone-13",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 13",
    displayName: "iPhone 13",
    repairs: Object.values(applePhoneRepairs),
  },
  {
    id: "apple-iphone-13-mini",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 13 Mini",
    displayName: "iPhone 13 Mini",
    repairs: Object.values(applePhoneRepairs),
  },
  {
    id: "apple-iphone-13-pro",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 13 Pro",
    displayName: "iPhone 13 Pro",
    repairs: Object.values(applePhoneRepairs),
  },
  {
    id: "apple-iphone-13-pro-max",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 13 Pro Max",
    displayName: "iPhone 13 Pro Max",
    repairs: Object.values(applePhoneRepairs),
  },
  // iPhone 12 Series
  {
    id: "apple-iphone-12",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 12",
    displayName: "iPhone 12",
    repairs: Object.values(applePhoneRepairs),
  },
  {
    id: "apple-iphone-12-mini",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 12 Mini",
    displayName: "iPhone 12 Mini",
    repairs: Object.values(applePhoneRepairs),
  },
  {
    id: "apple-iphone-12-pro",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 12 Pro",
    displayName: "iPhone 12 Pro",
    repairs: Object.values(applePhoneRepairs),
  },
  {
    id: "apple-iphone-12-pro-max",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 12 Pro Max",
    displayName: "iPhone 12 Pro Max",
    repairs: Object.values(applePhoneRepairs),
  },
  // iPhone 11 Series
  {
    id: "apple-iphone-11",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 11",
    displayName: "iPhone 11",
    repairs: Object.values(applePhoneRepairs),
  },
  {
    id: "apple-iphone-11-pro",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 11 Pro",
    displayName: "iPhone 11 Pro",
    repairs: Object.values(applePhoneRepairs),
  },
  {
    id: "apple-iphone-11-pro-max",
    brand: "Apple",
    category: "Phone",
    model: "iPhone 11 Pro Max",
    displayName: "iPhone 11 Pro Max",
    repairs: Object.values(applePhoneRepairs),
  },
  // iPhone SE
  {
    id: "apple-iphone-se-2020",
    brand: "Apple",
    category: "Phone",
    model: "iPhone SE 2020",
    displayName: "iPhone SE (2020)",
    repairs: Object.values(applePhoneRepairs),
  },
  {
    id: "apple-iphone-se-2022",
    brand: "Apple",
    category: "Phone",
    model: "iPhone SE 2022",
    displayName: "iPhone SE (2022)",
    repairs: Object.values(applePhoneRepairs),
  },
];

// Apple iPad models
export const APPLE_IPADS: Device[] = [
  {
    id: "apple-ipad-9th",
    brand: "Apple",
    category: "Tablet",
    model: "iPad 9th Gen",
    displayName: "iPad (9th Generation)",
    repairs: Object.values(appleIpadRepairs),
  },
  {
    id: "apple-ipad-10th",
    brand: "Apple",
    category: "Tablet",
    model: "iPad 10th Gen",
    displayName: "iPad (10th Generation)",
    repairs: Object.values(appleIpadRepairs),
  },
  {
    id: "apple-ipad-11th",
    brand: "Apple",
    category: "Tablet",
    model: "iPad 11th Gen",
    displayName: "iPad (11th Generation)",
    repairs: Object.values(appleIpadRepairs),
  },
  {
    id: "apple-ipad-air-4",
    brand: "Apple",
    category: "Tablet",
    model: "iPad Air 4",
    displayName: "iPad Air 4",
    repairs: Object.values(appleIpadRepairs),
  },
  {
    id: "apple-ipad-air-5",
    brand: "Apple",
    category: "Tablet",
    model: "iPad Air 5",
    displayName: "iPad Air 5",
    repairs: Object.values(appleIpadRepairs),
  },
  {
    id: "apple-ipad-air-6",
    brand: "Apple",
    category: "Tablet",
    model: "iPad Air 6",
    displayName: "iPad Air 6",
    repairs: Object.values(appleIpadRepairs),
  },
  {
    id: "apple-ipad-mini-6",
    brand: "Apple",
    category: "Tablet",
    model: "iPad Mini 6",
    displayName: "iPad Mini 6",
    repairs: Object.values(appleIpadRepairs),
  },
  {
    id: "apple-ipad-mini-7",
    brand: "Apple",
    category: "Tablet",
    model: "iPad Mini 7",
    displayName: "iPad Mini 7",
    repairs: Object.values(appleIpadRepairs),
  },
  {
    id: "apple-ipad-pro-11",
    brand: "Apple",
    category: "Tablet",
    model: "iPad Pro 11 inch",
    displayName: "iPad Pro 11″",
    repairs: Object.values(appleIpadRepairs),
  },
  {
    id: "apple-ipad-pro-12-9",
    brand: "Apple",
    category: "Tablet",
    model: "iPad Pro 12.9 inch",
    displayName: "iPad Pro 12.9″",
    repairs: Object.values(appleIpadRepairs),
  },
  {
    id: "apple-ipad-pro-13",
    brand: "Apple",
    category: "Tablet",
    model: "iPad Pro 13 inch",
    displayName: "iPad Pro 13″",
    repairs: Object.values(appleIpadRepairs),
  },
];

// Apple MacBook models
export const APPLE_MACBOOKS: Device[] = [
  // MacBook Air M1
  {
    id: "apple-macbook-air-m1-13",
    brand: "Apple",
    category: "Laptop",
    model: "MacBook Air M1 13 inch",
    displayName: "MacBook Air 13″ M1",
    repairs: Object.values(appleMacbookRepairs),
  },
  // MacBook Air M2
  {
    id: "apple-macbook-air-m2-13",
    brand: "Apple",
    category: "Laptop",
    model: "MacBook Air M2 13 inch",
    displayName: "MacBook Air 13″ M2",
    repairs: Object.values(appleMacbookRepairs),
  },
  {
    id: "apple-macbook-air-m2-15",
    brand: "Apple",
    category: "Laptop",
    model: "MacBook Air M2 15 inch",
    displayName: "MacBook Air 15″ M2",
    repairs: Object.values(appleMacbookRepairs),
  },
  // MacBook Air M3
  {
    id: "apple-macbook-air-m3-13",
    brand: "Apple",
    category: "Laptop",
    model: "MacBook Air M3 13 inch",
    displayName: "MacBook Air 13″ M3",
    repairs: Object.values(appleMacbookRepairs),
  },
  {
    id: "apple-macbook-air-m3-15",
    brand: "Apple",
    category: "Laptop",
    model: "MacBook Air M3 15 inch",
    displayName: "MacBook Air 15″ M3",
    repairs: Object.values(appleMacbookRepairs),
  },
  // MacBook Pro 13 inch
  {
    id: "apple-macbook-pro-13-m1",
    brand: "Apple",
    category: "Laptop",
    model: "MacBook Pro 13 M1",
    displayName: "MacBook Pro 13″ M1",
    repairs: Object.values(appleMacbookRepairs),
  },
  {
    id: "apple-macbook-pro-13-m2",
    brand: "Apple",
    category: "Laptop",
    model: "MacBook Pro 13 M2",
    displayName: "MacBook Pro 13″ M2",
    repairs: Object.values(appleMacbookRepairs),
  },
  {
    id: "apple-macbook-pro-13-m3",
    brand: "Apple",
    category: "Laptop",
    model: "MacBook Pro 13 M3",
    displayName: "MacBook Pro 13″ M3",
    repairs: Object.values(appleMacbookRepairs),
  },
  // MacBook Pro 14 inch
  {
    id: "apple-macbook-pro-14-m1",
    brand: "Apple",
    category: "Laptop",
    model: "MacBook Pro 14 M1",
    displayName: "MacBook Pro 14″ M1",
    repairs: Object.values(appleMacbookRepairs),
  },
  {
    id: "apple-macbook-pro-14-m2",
    brand: "Apple",
    category: "Laptop",
    model: "MacBook Pro 14 M2",
    displayName: "MacBook Pro 14″ M2",
    repairs: Object.values(appleMacbookRepairs),
  },
  {
    id: "apple-macbook-pro-14-m3",
    brand: "Apple",
    category: "Laptop",
    model: "MacBook Pro 14 M3",
    displayName: "MacBook Pro 14″ M3",
    repairs: Object.values(appleMacbookRepairs),
  },
  // MacBook Pro 16 inch
  {
    id: "apple-macbook-pro-16-m1",
    brand: "Apple",
    category: "Laptop",
    model: "MacBook Pro 16 M1",
    displayName: "MacBook Pro 16″ M1",
    repairs: Object.values(appleMacbookRepairs),
  },
  {
    id: "apple-macbook-pro-16-m2",
    brand: "Apple",
    category: "Laptop",
    model: "MacBook Pro 16 M2",
    displayName: "MacBook Pro 16″ M2",
    repairs: Object.values(appleMacbookRepairs),
  },
  {
    id: "apple-macbook-pro-16-m3",
    brand: "Apple",
    category: "Laptop",
    model: "MacBook Pro 16 M3",
    displayName: "MacBook Pro 16″ M3",
    repairs: Object.values(appleMacbookRepairs),
  },
];

// ============================================================================
// SAMSUNG DEVICES
// ============================================================================

const samsungPhoneRepairs = {
  screen: createRepair("Screen replacement", 44, 329, "1-3 hrs", "6-12 months"),
  battery: createRepair("Battery replacement", 39, 104, "45-90 min", "6 months"),
  charging: createRepair("Charging port", 54, 99, "1-2 hrs", "6 months"),
  backGlass: createRepair("Back glass", 44, 119, "1-2 hrs", "6 months"),
  camera: createRepair("Camera replacement", 59, 149, "60 min", "6 months"),
  speaker: createRepair("Speaker repair", 39, 69, "45 min", "12 months"),
  microphone: createRepair("Microphone repair", 35, 65, "45 min", "12 months"),
  waterDamage: createRepair(
    "Water damage diagnostic",
    29,
    49,
    "Same day",
    "Diagnostic only"
  ),
  liquidRepair: createRepair("Liquid damage repair", 79, 249, "1-5 days", "3 months"),
  dataRecovery: createRepair("Data recovery", 79, 299, "2-7 days", "N/A"),
  motherboard: createRepair("Motherboard repair", 79, 249, "1-5 days", "3 months"),
  noPower: createRepair("No power repair", 79, 249, "1-5 days", "3 months"),
  biometric: createRepair("Face ID / biometric repair", 59, 179, "1-3 days", "3 months"),
  softwareRepair: createRepair("Software repair", 29, 79, "30-60 min", "1 month"),
};

const samsungTabletRepairs = {
  screen: createRepair("Screen replacement", 89, 329, "1-2 days", "6 months"),
  battery: createRepair("Battery replacement", 59, 129, "1-2 days", "6 months"),
  charging: createRepair("Charging port", 59, 129, "1-2 days", "6 months"),
  backGlass: createRepair("Back glass", 49, 129, "1-2 days", "6 months"),
  camera: createRepair("Camera replacement", 49, 119, "60 min", "6 months"),
  speaker: createRepair("Speaker repair", 39, 69, "45 min", "12 months"),
  waterDamage: createRepair(
    "Water damage diagnostic",
    29,
    49,
    "Same day",
    "Diagnostic only"
  ),
  liquidRepair: createRepair("Liquid damage repair", 89, 279, "1-5 days", "3 months"),
  dataRecovery: createRepair("Data recovery", 99, 299, "2-7 days", "N/A"),
  motherboard: createRepair("Motherboard repair", 99, 299, "1-5 days", "3 months"),
  noPower: createRepair("No power repair", 99, 299, "1-5 days", "3 months"),
  softwareRepair: createRepair("Software repair", 39, 79, "30-60 min", "6 months"),
};

const consoleRepairs = {
  hdmi: createRepair("HDMI port repair", 59, 119, "1-3 days", "6 months"),
  usbC: createRepair("USB-C / charging port", 59, 119, "1-3 days", "6 months"),
  noPower: createRepair("No power repair", 79, 249, "1-5 days", "3 months"),
  board: createRepair("Board-level repair", 89, 299, "1-5 days", "3 months"),
  overheating: createRepair("Overheating service", 49, 89, "Same day", "3 months"),
  liquid: createRepair("Liquid damage repair", 79, 249, "1-5 days", "3 months"),
  storage: createRepair("SSD upgrade", 79, 199, "60 min", "12 months"),
  software: createRepair("Software repair", 39, 79, "60 min", "1 month"),
};

const customPcRepairs = {
  build: createRepair("Custom PC build", 99, 199, "1-3 days", "12 months labour"),
  gpu: createRepair("GPU upgrade", 39, 79, "Same day", "3 months labour"),
  ram: createRepair("RAM upgrade", 29, 59, "30 min", "3 months labour"),
  ssd: createRepair("SSD upgrade", 49, 129, "60 min", "3 months labour"),
  cooling: createRepair("Cooling upgrade", 49, 149, "1-2 hrs", "3 months labour"),
  cable: createRepair("Cable management", 49, 99, "1-2 hrs", "3 months labour"),
  windows: createRepair("Windows install & setup", 39, 79, "60 min", "1 month"),
  thermal: createRepair("Thermal paste replacement", 39, 79, "45 min", "3 months"),
  diagnostic: createRepair("Software repair", 39, 99, "60 min", "1 month"),
};

const GAME_CONSOLES: Device[] = [
  {
    id: "sony-playstation-5",
    brand: "Sony",
    category: "Console",
    model: "PlayStation 5",
    displayName: "PlayStation 5",
    repairs: Object.values(consoleRepairs),
  },
  {
    id: "sony-playstation-4",
    brand: "Sony",
    category: "Console",
    model: "PlayStation 4",
    displayName: "PlayStation 4",
    repairs: Object.values(consoleRepairs),
  },
  {
    id: "microsoft-xbox-series-x",
    brand: "Microsoft",
    category: "Console",
    model: "Xbox Series X",
    displayName: "Xbox Series X",
    repairs: Object.values(consoleRepairs),
  },
  {
    id: "microsoft-xbox-series-s",
    brand: "Microsoft",
    category: "Console",
    model: "Xbox Series S",
    displayName: "Xbox Series S",
    repairs: Object.values(consoleRepairs),
  },
  {
    id: "microsoft-xbox-one",
    brand: "Microsoft",
    category: "Console",
    model: "Xbox One",
    displayName: "Xbox One",
    repairs: Object.values(consoleRepairs),
  },
  {
    id: "nintendo-switch",
    brand: "Nintendo",
    category: "Console",
    model: "Nintendo Switch",
    displayName: "Nintendo Switch",
    repairs: Object.values(consoleRepairs),
  },
  {
    id: "nintendo-switch-oled",
    brand: "Nintendo",
    category: "Console",
    model: "Nintendo Switch OLED",
    displayName: "Nintendo Switch OLED",
    repairs: Object.values(consoleRepairs),
  },
  {
    id: "valve-steam-deck",
    brand: "Valve",
    category: "Console",
    model: "Steam Deck",
    displayName: "Steam Deck",
    repairs: Object.values(consoleRepairs),
  },
  {
    id: "custom-gaming-pc",
    brand: "Custom PC",
    category: "Console",
    model: "Gaming PC",
    displayName: "Gaming PC",
    repairs: Object.values(customPcRepairs),
  },
  {
    id: "custom-workstation-pc",
    brand: "Custom PC",
    category: "Console",
    model: "Workstation PC",
    displayName: "Workstation PC",
    repairs: Object.values(customPcRepairs),
  },
  {
    id: "custom-office-pc",
    brand: "Custom PC",
    category: "Console",
    model: "Office / Home PC",
    displayName: "Office / Home PC",
    repairs: Object.values(customPcRepairs),
  },
];

// Samsung Galaxy S series
export const SAMSUNG_GALAXY_S: Device[] = [
  // S25 Series
  {
    id: "samsung-s25",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy S25",
    displayName: "Galaxy S25",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-s25-plus",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy S25+",
    displayName: "Galaxy S25+",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-s25-ultra",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy S25 Ultra",
    displayName: "Galaxy S25 Ultra",
    repairs: Object.values(samsungPhoneRepairs),
  },
  // S24 Series
  {
    id: "samsung-s24",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy S24",
    displayName: "Galaxy S24",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-s24-plus",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy S24+",
    displayName: "Galaxy S24+",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-s24-ultra",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy S24 Ultra",
    displayName: "Galaxy S24 Ultra",
    repairs: Object.values(samsungPhoneRepairs),
  },
  // S23 Series
  {
    id: "samsung-s23",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy S23",
    displayName: "Galaxy S23",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-s23-plus",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy S23+",
    displayName: "Galaxy S23+",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-s23-ultra",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy S23 Ultra",
    displayName: "Galaxy S23 Ultra",
    repairs: Object.values(samsungPhoneRepairs),
  },
  // S22 Series
  {
    id: "samsung-s22",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy S22",
    displayName: "Galaxy S22",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-s22-plus",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy S22+",
    displayName: "Galaxy S22+",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-s22-ultra",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy S22 Ultra",
    displayName: "Galaxy S22 Ultra",
    repairs: Object.values(samsungPhoneRepairs),
  },
  // S21 Series
  {
    id: "samsung-s21",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy S21",
    displayName: "Galaxy S21",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-s21-plus",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy S21+",
    displayName: "Galaxy S21+",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-s21-ultra",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy S21 Ultra",
    displayName: "Galaxy S21 Ultra",
    repairs: Object.values(samsungPhoneRepairs),
  },
  // S20 Series
  {
    id: "samsung-s20",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy S20",
    displayName: "Galaxy S20",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-s20-plus",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy S20+",
    displayName: "Galaxy S20+",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-s20-ultra",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy S20 Ultra",
    displayName: "Galaxy S20 Ultra",
    repairs: Object.values(samsungPhoneRepairs),
  },
];

// Samsung Galaxy A series
export const SAMSUNG_GALAXY_A: Device[] = [
  {
    id: "samsung-a55",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy A55",
    displayName: "Galaxy A55",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-a54",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy A54",
    displayName: "Galaxy A54",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-a35",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy A35",
    displayName: "Galaxy A35",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-a34",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy A34",
    displayName: "Galaxy A34",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-a25",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy A25",
    displayName: "Galaxy A25",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-a15",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy A15",
    displayName: "Galaxy A15",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-a14",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy A14",
    displayName: "Galaxy A14",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-a13",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy A13",
    displayName: "Galaxy A13",
    repairs: Object.values(samsungPhoneRepairs),
  },
];

// Samsung Galaxy Z series (Foldables)
export const SAMSUNG_GALAXY_Z: Device[] = [
  // Z Flip
  {
    id: "samsung-z-flip-6",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy Z Flip 6",
    displayName: "Galaxy Z Flip 6",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-z-flip-5",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy Z Flip 5",
    displayName: "Galaxy Z Flip 5",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-z-flip-4",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy Z Flip 4",
    displayName: "Galaxy Z Flip 4",
    repairs: Object.values(samsungPhoneRepairs),
  },
  // Z Fold
  {
    id: "samsung-z-fold-6",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy Z Fold 6",
    displayName: "Galaxy Z Fold 6",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-z-fold-5",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy Z Fold 5",
    displayName: "Galaxy Z Fold 5",
    repairs: Object.values(samsungPhoneRepairs),
  },
  {
    id: "samsung-z-fold-4",
    brand: "Samsung",
    category: "Phone",
    model: "Galaxy Z Fold 4",
    displayName: "Galaxy Z Fold 4",
    repairs: Object.values(samsungPhoneRepairs),
  },
];

// Samsung Galaxy Tab series
export const SAMSUNG_GALAXY_TAB: Device[] = [
  // Tab S10
  {
    id: "samsung-tab-s10",
    brand: "Samsung",
    category: "Tablet",
    model: "Galaxy Tab S10",
    displayName: "Galaxy Tab S10",
    repairs: Object.values(samsungTabletRepairs),
  },
  {
    id: "samsung-tab-s10-plus",
    brand: "Samsung",
    category: "Tablet",
    model: "Galaxy Tab S10+",
    displayName: "Galaxy Tab S10+",
    repairs: Object.values(samsungTabletRepairs),
  },
  {
    id: "samsung-tab-s10-ultra",
    brand: "Samsung",
    category: "Tablet",
    model: "Galaxy Tab S10 Ultra",
    displayName: "Galaxy Tab S10 Ultra",
    repairs: Object.values(samsungTabletRepairs),
  },
  // Tab S9
  {
    id: "samsung-tab-s9",
    brand: "Samsung",
    category: "Tablet",
    model: "Galaxy Tab S9",
    displayName: "Galaxy Tab S9",
    repairs: Object.values(samsungTabletRepairs),
  },
  {
    id: "samsung-tab-s9-plus",
    brand: "Samsung",
    category: "Tablet",
    model: "Galaxy Tab S9+",
    displayName: "Galaxy Tab S9+",
    repairs: Object.values(samsungTabletRepairs),
  },
  {
    id: "samsung-tab-s9-ultra",
    brand: "Samsung",
    category: "Tablet",
    model: "Galaxy Tab S9 Ultra",
    displayName: "Galaxy Tab S9 Ultra",
    repairs: Object.values(samsungTabletRepairs),
  },
  // Tab S8
  {
    id: "samsung-tab-s8",
    brand: "Samsung",
    category: "Tablet",
    model: "Galaxy Tab S8",
    displayName: "Galaxy Tab S8",
    repairs: Object.values(samsungTabletRepairs),
  },
  {
    id: "samsung-tab-s8-plus",
    brand: "Samsung",
    category: "Tablet",
    model: "Galaxy Tab S8+",
    displayName: "Galaxy Tab S8+",
    repairs: Object.values(samsungTabletRepairs),
  },
  {
    id: "samsung-tab-s8-ultra",
    brand: "Samsung",
    category: "Tablet",
    model: "Galaxy Tab S8 Ultra",
    displayName: "Galaxy Tab S8 Ultra",
    repairs: Object.values(samsungTabletRepairs),
  },
];

// ============================================================================
// MASTER DEVICE DATABASE
// ============================================================================

export const ALL_DEVICES: Device[] = [
  // Apple
  ...APPLE_IPHONES,
  ...APPLE_IPADS,
  ...APPLE_MACBOOKS,
  // Samsung
  ...SAMSUNG_GALAXY_S,
  ...SAMSUNG_GALAXY_A,
  ...SAMSUNG_GALAXY_Z,
  ...SAMSUNG_GALAXY_TAB,
  ...GAME_CONSOLES,
];

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

/**
 * Get all unique brands for a given category
 */
export function getBrandsByCategory(category: DeviceCategory): string[] {
  const brands = new Set(
    ALL_DEVICES.filter((device) => device.category === category).map(
      (device) => device.brand
    )
  );
  return Array.from(brands).sort();
}

/**
 * Get all models for a given brand and category
 */
export function getModelsByBrand(
  brand: string,
  category: DeviceCategory
): Device[] {
  return ALL_DEVICES.filter(
    (device) => device.brand === brand && device.category === category
  ).sort((a, b) => a.displayName.localeCompare(b.displayName));
}

/**
 * Get repair types available for a specific device
 */
export function getRepairTypesByDevice(device: Device): RepairType[] {
  return Array.from(new Set(device.repairs.map((r) => r.type)));
}

/**
 * Get repair info for a specific device and repair type
 */
export function getRepairInfo(
  device: Device,
  repairType: RepairType
): RepairInfo | undefined {
  return device.repairs.find((r) => r.type === repairType);
}

/**
 * Search for a device by ID
 */
export function getDeviceById(id: string): Device | undefined {
  return ALL_DEVICES.find((device) => device.id === id);
}
