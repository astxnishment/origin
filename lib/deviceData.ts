// ─────────────────────────────────────────────────────────────────────────────
// lib/deviceData.ts
// Single source of truth for the calculator:
//   brands → device types → models → repair types → prices
//
// TO ADD A NEW MODEL: add an entry to the models array in the relevant section.
// TO EDIT A PRICE: update the `price` field in the repairTypes array for that model.
//   price: null               → shows "Quote required"
//   price: { from: 49 }       → shows "From £49"
//   price: { from: 49, to: 89 } → shows "£49–£89"
// ─────────────────────────────────────────────────────────────────────────────

export type Brand = "Apple" | "Samsung";

export type DeviceTypeName =
  // Apple
  | "iPhone"
  | "iPad"
  | "MacBook"
  // Samsung
  | "Galaxy S Series"
  | "Galaxy A Series"
  | "Galaxy Z Fold / Flip"
  | "Galaxy Tab"
  | "Galaxy Book / Laptop";

export type RepairCategory = "phone" | "tablet" | "laptop";

export interface PriceRange {
  from: number;
  to?: number;
}

export interface RepairOption {
  id: string;
  label: string;
  price: PriceRange | null; // null = quote required
  time: string;
  warranty: string;
  note?: string;
}

export interface DeviceModel {
  id: string;
  name: string;
  repairs: RepairOption[];
}

export interface DeviceType {
  id: string;
  name: DeviceTypeName;
  brand: Brand;
  repairCategory: RepairCategory;
  models: DeviceModel[];
}

// ── Repair type sets (shared templates) ─────────────────────────────────────

function phoneRepairs(overrides: Partial<Record<string, PriceRange | null>> = {}): RepairOption[] {
  const base: RepairOption[] = [
    { id: "screen",        label: "Screen replacement",       price: null,          time: "45–90 min",  warranty: "12 months" },
    { id: "battery",       label: "Battery replacement",      price: null,          time: "30–60 min",  warranty: "12 months" },
    { id: "charging-port", label: "Charging port repair",     price: null,          time: "60–90 min",  warranty: "6 months"  },
    { id: "back-glass",    label: "Back glass replacement",   price: null,          time: "60–120 min", warranty: "6 months"  },
    { id: "camera",        label: "Camera repair",            price: null,          time: "60 min",     warranty: "6 months"  },
    { id: "speaker",       label: "Speaker repair",           price: null,          time: "45 min",     warranty: "6 months"  },
    { id: "water",         label: "Water damage diagnostic",  price: { from: 29, to: 39 }, time: "Same day", warranty: "No fix no fee" },
    { id: "software",      label: "Software issue",           price: { from: 29 },  time: "30–60 min",  warranty: "1 month"   },
  ];
  return base.map((r) => (r.id in overrides ? { ...r, price: overrides[r.id]! } : r));
}

function tabletRepairs(overrides: Partial<Record<string, PriceRange | null>> = {}): RepairOption[] {
  const base: RepairOption[] = [
    { id: "screen",        label: "Screen replacement",       price: null,          time: "90–120 min", warranty: "12 months" },
    { id: "battery",       label: "Battery replacement",      price: null,          time: "60–90 min",  warranty: "12 months" },
    { id: "charging-port", label: "Charging port repair",     price: null,          time: "60–90 min",  warranty: "6 months"  },
    { id: "button",        label: "Button repair",            price: { from: 39 },  time: "45 min",     warranty: "6 months"  },
    { id: "camera",        label: "Camera repair",            price: null,          time: "60 min",     warranty: "6 months"  },
    { id: "software",      label: "Software issue",           price: { from: 39 },  time: "30–60 min",  warranty: "1 month"   },
    { id: "water",         label: "Water damage diagnostic",  price: { from: 29, to: 39 }, time: "Same day", warranty: "No fix no fee" },
  ];
  return base.map((r) => (r.id in overrides ? { ...r, price: overrides[r.id]! } : r));
}

function laptopRepairs(overrides: Partial<Record<string, PriceRange | null>> = {}): RepairOption[] {
  const base: RepairOption[] = [
    { id: "screen",        label: "Screen replacement",       price: null,          time: "90–180 min", warranty: "12 months" },
    { id: "battery",       label: "Battery replacement",      price: null,          time: "60–90 min",  warranty: "12 months" },
    { id: "keyboard",      label: "Keyboard replacement",     price: null,          time: "60–120 min", warranty: "6 months"  },
    { id: "trackpad",      label: "Trackpad repair",          price: null,          time: "60 min",     warranty: "6 months"  },
    { id: "charging-port", label: "Charging / USB-C port repair", price: null,      time: "60–90 min",  warranty: "6 months"  },
    { id: "liquid",        label: "Liquid damage diagnostic", price: { from: 49 },  time: "Same day",   warranty: "No fix no fee" },
    { id: "software",      label: "Software / OS issue",      price: { from: 39 },  time: "60 min",     warranty: "1 month"   },
    { id: "data-recovery", label: "Data recovery",            price: { from: 49, to: 149 }, time: "24–48 hrs", warranty: "N/A" },
  ];
  return base.map((r) => (r.id in overrides ? { ...r, price: overrides[r.id]! } : r));
}

// ── Helper ───────────────────────────────────────────────────────────────────

function m(name: string, repairs: RepairOption[]): DeviceModel {
  return {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/, ""),
    name,
    repairs,
  };
}

// ── Apple ────────────────────────────────────────────────────────────────────

const APPLE_IPHONES: DeviceType = {
  id: "iphone",
  name: "iPhone",
  brand: "Apple",
  repairCategory: "phone",
  models: [
    // ── iPhone 17 line (parts pending — show quote required for screen/battery)
    m("iPhone 17 Pro Max", phoneRepairs()),
    m("iPhone 17 Pro",     phoneRepairs()),
    m("iPhone Air",        phoneRepairs()),
    m("iPhone 17",         phoneRepairs()),
    m("iPhone 17e",        phoneRepairs()),
    // ── iPhone 16 line
    m("iPhone 16 Pro Max", phoneRepairs({ screen: { from: 224 }, battery: { from: 54, to: 79 }, "charging-port": { from: 69, to: 109 } })),
    m("iPhone 16 Pro",     phoneRepairs({ screen: { from: 204 }, battery: { from: 54, to: 79 }, "charging-port": { from: 69, to: 109 } })),
    m("iPhone 16 Plus",    phoneRepairs({ screen: { from: 119 }, battery: { from: 54, to: 79 } })),
    m("iPhone 16",         phoneRepairs({ screen: { from: 104 }, battery: { from: 54, to: 79 } })),
    m("iPhone 16e",        phoneRepairs({ screen: { from: 94  }, battery: { from: 49, to: 74 } })),
    // ── iPhone 15 line
    m("iPhone 15 Pro Max", phoneRepairs({ screen: { from: 189 }, battery: { from: 49, to: 74 } })),
    m("iPhone 15 Pro",     phoneRepairs({ screen: { from: 164 }, battery: { from: 49, to: 74 } })),
    m("iPhone 15 Plus",    phoneRepairs({ screen: { from: 89  }, battery: { from: 49, to: 74 } })),
    m("iPhone 15",         phoneRepairs({ screen: { from: 84  }, battery: { from: 49, to: 74 } })),
    // ── iPhone 14 line
    m("iPhone 14 Pro Max", phoneRepairs({ screen: { from: 159 }, battery: { from: 49, to: 74 } })),
    m("iPhone 14 Pro",     phoneRepairs({ screen: { from: 139 }, battery: { from: 49, to: 74 } })),
    m("iPhone 14 Plus",    phoneRepairs({ screen: { from: 79  }, battery: { from: 44, to: 69 } })),
    m("iPhone 14",         phoneRepairs({ screen: { from: 64  }, battery: { from: 44, to: 69 } })),
    // ── iPhone 13 line
    m("iPhone 13 Pro Max", phoneRepairs({ screen: { from: 129 }, battery: { from: 39, to: 64 } })),
    m("iPhone 13 Pro",     phoneRepairs({ screen: { from: 109 }, battery: { from: 39, to: 64 } })),
    m("iPhone 13",         phoneRepairs({ screen: { from: 64  }, battery: { from: 39, to: 64 } })),
    m("iPhone 13 Mini",    phoneRepairs({ screen: { from: 59  }, battery: { from: 39, to: 64 } })),
    // ── iPhone 12 line
    m("iPhone 12 Pro Max", phoneRepairs({ screen: { from: 74  }, battery: { from: 34, to: 59 } })),
    m("iPhone 12 Pro",     phoneRepairs({ screen: { from: 59  }, battery: { from: 34, to: 59 } })),
    m("iPhone 12",         phoneRepairs({ screen: { from: 59  }, battery: { from: 34, to: 59 } })),
    m("iPhone 12 Mini",    phoneRepairs({ screen: { from: 59  }, battery: { from: 34, to: 59 } })),
    // ── iPhone 11 line
    m("iPhone 11 Pro Max", phoneRepairs({ screen: { from: 69  }, battery: { from: 29, to: 49 } })),
    m("iPhone 11 Pro",     phoneRepairs({ screen: { from: 59  }, battery: { from: 29, to: 49 } })),
    m("iPhone 11",         phoneRepairs({ screen: { from: 44  }, battery: { from: 29, to: 49 } })),
    // ── Older iPhones
    m("iPhone XR",         phoneRepairs({ screen: { from: 44  }, battery: { from: 29, to: 44 } })),
    m("iPhone XS Max",     phoneRepairs({ screen: { from: 59  }, battery: { from: 29, to: 44 } })),
    m("iPhone XS",         phoneRepairs({ screen: { from: 54  }, battery: { from: 29, to: 44 } })),
    m("iPhone X",          phoneRepairs({ screen: { from: 49  }, battery: { from: 24, to: 39 } })),
    m("iPhone SE 2022",    phoneRepairs({ screen: { from: 39  }, battery: { from: 24, to: 39 } })),
    m("iPhone SE 2020",    phoneRepairs({ screen: { from: 39  }, battery: { from: 24, to: 39 } })),
    m("iPhone 8 Plus",     phoneRepairs({ screen: { from: 44  }, battery: { from: 24, to: 39 } })),
    m("iPhone 8",          phoneRepairs({ screen: { from: 39  }, battery: { from: 24, to: 39 } })),
  ],
};

const APPLE_IPADS: DeviceType = {
  id: "ipad",
  name: "iPad",
  brand: "Apple",
  repairCategory: "tablet",
  models: [
    m('iPad Pro 13" M4',      tabletRepairs({ screen: { from: 299 } })),
    m('iPad Pro 12.9" M2',    tabletRepairs({ screen: { from: 249 } })),
    m('iPad Pro 11" M4',      tabletRepairs({ screen: { from: 249 } })),
    m('iPad Pro 11" M2',      tabletRepairs({ screen: { from: 199 } })),
    m('iPad Air 13" M2',      tabletRepairs({ screen: { from: 229 } })),
    m('iPad Air 11" M2',      tabletRepairs({ screen: { from: 179 } })),
    m("iPad Air 5",           tabletRepairs({ screen: { from: 189 } })),
    m("iPad Air 4",           tabletRepairs({ screen: { from: 179 } })),
    m("iPad 10th Gen",        tabletRepairs({ screen: { from: 124 } })),
    m("iPad 9th Gen",         tabletRepairs({ screen: { from: 99  } })),
    m("iPad 8th Gen",         tabletRepairs({ screen: { from: 89  } })),
    m("iPad 7th Gen",         tabletRepairs({ screen: { from: 79  } })),
    m("iPad Mini 6",          tabletRepairs({ screen: { from: 149 } })),
    m("iPad Mini 5",          tabletRepairs({ screen: { from: 119 } })),
  ],
};

const APPLE_MACBOOKS: DeviceType = {
  id: "macbook",
  name: "MacBook",
  brand: "Apple",
  repairCategory: "laptop",
  models: [
    m('MacBook Air 15" M3',    laptopRepairs({ screen: { from: 279 }, battery: { from: 129 } })),
    m('MacBook Air 15" M2',    laptopRepairs({ screen: { from: 259 }, battery: { from: 119 } })),
    m('MacBook Air 13" M3',    laptopRepairs({ screen: { from: 249 }, battery: { from: 119 } })),
    m('MacBook Air 13" M2',    laptopRepairs({ screen: { from: 239 }, battery: { from: 119 } })),
    m('MacBook Air 13" M1',    laptopRepairs({ screen: { from: 199 }, battery: { from: 109 } })),
    m("MacBook Pro 16\" M3",   laptopRepairs({ screen: { from: 399 }, battery: { from: 149 } })),
    m("MacBook Pro 14\" M3",   laptopRepairs({ screen: { from: 349 }, battery: { from: 139 } })),
    m("MacBook Pro 16\" M2",   laptopRepairs({ screen: { from: 379 }, battery: { from: 149 } })),
    m("MacBook Pro 14\" M2",   laptopRepairs({ screen: { from: 329 }, battery: { from: 139 } })),
    m("MacBook Pro 16\" M1",   laptopRepairs({ screen: { from: 359 }, battery: { from: 149 } })),
    m("MacBook Pro 14\" M1",   laptopRepairs({ screen: { from: 319 }, battery: { from: 139 } })),
    m('MacBook Pro 13" M1/M2', laptopRepairs({ screen: { from: 249 }, battery: { from: 119 } })),
    m('MacBook Pro 13" Intel', laptopRepairs({ screen: { from: 199 }, battery: { from: 99  } })),
    m('MacBook Pro 15" Intel', laptopRepairs({ screen: { from: 229 }, battery: { from: 99  } })),
    m('MacBook Pro 16" Intel', laptopRepairs({ screen: { from: 249 }, battery: { from: 109 } })),
  ],
};

// ── Samsung ──────────────────────────────────────────────────────────────────

const SAMSUNG_S_SERIES: DeviceType = {
  id: "galaxy-s",
  name: "Galaxy S Series",
  brand: "Samsung",
  repairCategory: "phone",
  models: [
    m("Galaxy S26 Ultra",  phoneRepairs({ screen: { from: 249 } })),
    m("Galaxy S26",        phoneRepairs({ screen: { from: 174 } })),
    m("Galaxy S25 Ultra",  phoneRepairs({ screen: { from: 234 } })),
    m("Galaxy S25 Plus",   phoneRepairs({ screen: { from: 194 } })),
    m("Galaxy S25",        phoneRepairs({ screen: { from: 174 }, battery: { from: 59, to: 104 } })),
    m("Galaxy S24 Ultra",  phoneRepairs({ screen: { from: 224 } })),
    m("Galaxy S24 Plus",   phoneRepairs({ screen: { from: 184 } })),
    m("Galaxy S24",        phoneRepairs({ screen: { from: 164 }, battery: { from: 59, to: 104 } })),
    m("Galaxy S23 Ultra",  phoneRepairs({ screen: { from: 199 } })),
    m("Galaxy S23 Plus",   phoneRepairs({ screen: { from: 164 } })),
    m("Galaxy S23",        phoneRepairs({ screen: { from: 149 }, battery: { from: 54, to: 99  } })),
    m("Galaxy S22 Ultra",  phoneRepairs({ screen: { from: 184 } })),
    m("Galaxy S22 Plus",   phoneRepairs({ screen: { from: 154 } })),
    m("Galaxy S22",        phoneRepairs({ screen: { from: 134 }, battery: { from: 54, to: 99  } })),
    m("Galaxy S21 Ultra",  phoneRepairs({ screen: { from: 174 } })),
    m("Galaxy S21 Plus",   phoneRepairs({ screen: { from: 144 } })),
    m("Galaxy S21",        phoneRepairs({ screen: { from: 114 }, battery: { from: 54, to: 99  } })),
    m("Galaxy S20 Ultra",  phoneRepairs({ screen: { from: 139 } })),
    m("Galaxy S20 Plus",   phoneRepairs({ screen: { from: 124 } })),
    m("Galaxy S20",        phoneRepairs({ screen: { from: 114 }, battery: { from: 59, to: 104 } })),
  ],
};

const SAMSUNG_A_SERIES: DeviceType = {
  id: "galaxy-a",
  name: "Galaxy A Series",
  brand: "Samsung",
  repairCategory: "phone",
  models: [
    m("Galaxy A55",  phoneRepairs({ screen: { from: 89  }, battery: { from: 49 } })),
    m("Galaxy A54",  phoneRepairs({ screen: { from: 79  }, battery: { from: 49 } })),
    m("Galaxy A53",  phoneRepairs({ screen: { from: 69  }, battery: { from: 44 } })),
    m("Galaxy A52",  phoneRepairs({ screen: { from: 64  }, battery: { from: 44 } })),
    m("Galaxy A35",  phoneRepairs({ screen: { from: 79  }, battery: { from: 49 } })),
    m("Galaxy A34",  phoneRepairs({ screen: { from: 69  }, battery: { from: 44 } })),
    m("Galaxy A33",  phoneRepairs({ screen: { from: 64  }, battery: { from: 44 } })),
    m("Galaxy A25",  phoneRepairs({ screen: { from: 59  }, battery: { from: 39 } })),
    m("Galaxy A15",  phoneRepairs({ screen: { from: 54  }, battery: { from: 39 } })),
    m("Galaxy A14",  phoneRepairs({ screen: { from: 49  }, battery: { from: 39 } })),
    m("Galaxy A13",  phoneRepairs({ screen: { from: 49  }, battery: { from: 34 } })),
    m("Galaxy A12",  phoneRepairs({ screen: { from: 44  }, battery: { from: 34 } })),
    m("Galaxy A32",  phoneRepairs({ screen: { from: 64  }, battery: { from: 44 } })),
  ],
};

const SAMSUNG_Z_SERIES: DeviceType = {
  id: "galaxy-z",
  name: "Galaxy Z Fold / Flip",
  brand: "Samsung",
  repairCategory: "phone",
  models: [
    m("Galaxy Z Fold 6",  phoneRepairs({ screen: { from: 399 } })),
    m("Galaxy Z Fold 5",  phoneRepairs({ screen: { from: 349 } })),
    m("Galaxy Z Fold 4",  phoneRepairs({ screen: { from: 299 } })),
    m("Galaxy Z Fold 3",  phoneRepairs({ screen: { from: 249 } })),
    m("Galaxy Z Flip 6",  phoneRepairs({ screen: { from: 199 } })),
    m("Galaxy Z Flip 5",  phoneRepairs({ screen: { from: 179 } })),
    m("Galaxy Z Flip 4",  phoneRepairs({ screen: { from: 159 } })),
    m("Galaxy Z Flip 3",  phoneRepairs({ screen: { from: 139 } })),
  ],
};

const SAMSUNG_TAB: DeviceType = {
  id: "galaxy-tab",
  name: "Galaxy Tab",
  brand: "Samsung",
  repairCategory: "tablet",
  models: [
    m("Galaxy Tab S9 Ultra", tabletRepairs({ screen: { from: 299 } })),
    m("Galaxy Tab S9 Plus",  tabletRepairs({ screen: { from: 249 } })),
    m("Galaxy Tab S9",       tabletRepairs({ screen: { from: 219 } })),
    m("Galaxy Tab S8 Ultra", tabletRepairs({ screen: { from: 279 } })),
    m("Galaxy Tab S8 Plus",  tabletRepairs({ screen: { from: 229 } })),
    m("Galaxy Tab S8",       tabletRepairs({ screen: { from: 199 } })),
    m("Galaxy Tab A9",       tabletRepairs({ screen: { from: 99  } })),
    m("Galaxy Tab A8",       tabletRepairs({ screen: { from: 89  } })),
  ],
};

const SAMSUNG_BOOK: DeviceType = {
  id: "galaxy-book",
  name: "Galaxy Book / Laptop",
  brand: "Samsung",
  repairCategory: "laptop",
  models: [
    m("Galaxy Book 4 Pro",    laptopRepairs({ screen: { from: 299 } })),
    m("Galaxy Book 4",        laptopRepairs({ screen: { from: 249 } })),
    m("Galaxy Book 3 Pro",    laptopRepairs({ screen: { from: 279 } })),
    m("Galaxy Book 3",        laptopRepairs({ screen: { from: 229 } })),
    m("Galaxy Book 2 Pro",    laptopRepairs({ screen: { from: 259 } })),
    m("Galaxy Book 2",        laptopRepairs({ screen: { from: 209 } })),
    m("Galaxy Book Pro 360",  laptopRepairs({ screen: { from: 269 } })),
    m("Galaxy Book Pro",      laptopRepairs({ screen: { from: 239 } })),
  ],
};

// ── Master device tree ───────────────────────────────────────────────────────

export const DEVICE_TYPES: DeviceType[] = [
  APPLE_IPHONES,
  APPLE_IPADS,
  APPLE_MACBOOKS,
  SAMSUNG_S_SERIES,
  SAMSUNG_A_SERIES,
  SAMSUNG_Z_SERIES,
  SAMSUNG_TAB,
  SAMSUNG_BOOK,
];

export const APPLE_DEVICE_TYPES = DEVICE_TYPES.filter((d) => d.brand === "Apple");
export const SAMSUNG_DEVICE_TYPES = DEVICE_TYPES.filter((d) => d.brand === "Samsung");

// ── Lookup helpers ───────────────────────────────────────────────────────────

export function getDeviceTypesByBrand(brand: Brand): DeviceType[] {
  return DEVICE_TYPES.filter((d) => d.brand === brand);
}

export function getDeviceTypeById(id: string): DeviceType | undefined {
  return DEVICE_TYPES.find((d) => d.id === id);
}

export function getModelById(deviceTypeId: string, modelId: string): DeviceModel | undefined {
  return getDeviceTypeById(deviceTypeId)?.models.find((m) => m.id === modelId);
}

export function formatPrice(price: PriceRange | null): string {
  if (!price) return "Quote required";
  if (price.to) return `£${price.from}–£${price.to}`;
  return `From £${price.from}`;
}

export function buildBookingUrl(
  brand: string,
  deviceTypeId: string,
  modelId: string,
  repairId: string
): string {
  const params = new URLSearchParams({ brand, type: deviceTypeId, model: modelId, repair: repairId });
  return `/book?${params.toString()}`;
}

export function buildWhatsAppUrl(
  deviceName: string,
  repairLabel: string,
  priceStr: string
): string {
  const msg = encodeURIComponent(
    `Hi Origin Repairs, I'd like a quote for: ${repairLabel} on my ${deviceName}. Estimated: ${priceStr}`
  );
  return `https://wa.me/447123456789?text=${msg}`;
}
