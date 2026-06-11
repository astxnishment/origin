/**
 * Apple Device Image Mapping
 *
 * Images served from https://img.appledb.dev — see https://github.com/littlebyteorg/apple-device-images
 *
 * URL pattern:
 *   https://img.appledb.dev/device@{res}/{deviceKey}/{color}{_dark?}.png
 *
 * res:   64  → small (dropdowns, search results)
 *        256 → large (cards, hero)
 *
 * The `dark` flag appends `_dark` before `.png` for devices that have a
 * dark-background render. Newer devices (2022+) only have light renders,
 * which still look great on dark cards because the device itself is dark.
 */

export interface AppleDeviceImage {
  /** appledb device key, e.g. "iPhone16,1" */
  deviceKey: string;
  /** Colour name as used by appledb, e.g. "Black Titanium" */
  color: string;
  /** Whether a _dark render exists for this device */
  hasDark: boolean;
}

/** Build the CDN URL for a given resolution (64 | 256) */
export function appleImageUrl(
  device: AppleDeviceImage,
  res: 64 | 256 = 256,
  preferDark = true
): string {
  const dark = preferDark && device.hasDark ? "_dark" : "";
  const color = encodeURIComponent(device.color);
  return `https://img.appledb.dev/device@${res}/${device.deviceKey}/${color}${dark}.png`;
}

// ─── iPhone mapping ──────────────────────────────────────────────────────────
// Keys must match model names in lib/deviceData.ts exactly

export const IPHONE_IMAGES: Record<string, AppleDeviceImage> = {
  // iPhone 17 line (2025)
  "iPhone 17 Pro Max": { deviceKey: "iPhone18,1",  color: "Deep Blue",          hasDark: false }, // 18,2 has no img yet → use 17 Pro
  "iPhone 17 Pro":     { deviceKey: "iPhone18,1",  color: "Deep Blue",          hasDark: false },
  "iPhone Air":        { deviceKey: "iPhone18,4",  color: "Sky Blue",           hasDark: false },
  "iPhone 17":         { deviceKey: "iPhone18,3",  color: "Lavender",           hasDark: false },
  "iPhone 17e":        { deviceKey: "iPhone17,5",  color: "Black",              hasDark: false }, // 18,5 has no img → use 16e

  // iPhone 16 line (2024)
  "iPhone 16 Pro Max": { deviceKey: "iPhone17,2",  color: "Black Titanium",     hasDark: false },
  "iPhone 16 Pro":     { deviceKey: "iPhone17,1",  color: "Black Titanium",     hasDark: false },
  "iPhone 16 Plus":    { deviceKey: "iPhone17,4",  color: "Black",              hasDark: false },
  "iPhone 16":         { deviceKey: "iPhone17,3",  color: "Black",              hasDark: false },
  "iPhone 16e":        { deviceKey: "iPhone17,5",  color: "Black",              hasDark: false },

  // iPhone 15 line (2023)
  "iPhone 15 Pro Max": { deviceKey: "iPhone16,2",  color: "Black Titanium",     hasDark: false },
  "iPhone 15 Pro":     { deviceKey: "iPhone16,1",  color: "Black Titanium",     hasDark: false },
  "iPhone 15 Plus":    { deviceKey: "iPhone15,5",  color: "Black",              hasDark: false },
  "iPhone 15":         { deviceKey: "iPhone15,4",  color: "Black",              hasDark: false },

  // iPhone 14 line (2022)
  "iPhone 14 Pro Max": { deviceKey: "iPhone15,3",  color: "Deep Purple",        hasDark: false },
  "iPhone 14 Pro":     { deviceKey: "iPhone15,2",  color: "Deep Purple",        hasDark: false },
  "iPhone 14 Plus":    { deviceKey: "iPhone14,8",  color: "Blue",               hasDark: false },
  "iPhone 14":         { deviceKey: "iPhone14,7",  color: "Blue",               hasDark: false },

  // iPhone 13 line (2021)
  "iPhone 13 Pro Max": { deviceKey: "iPhone14,3",  color: "Sierra Blue",        hasDark: true  },
  "iPhone 13 Pro":     { deviceKey: "iPhone14,2",  color: "Sierra Blue",        hasDark: true  },
  "iPhone 13":         { deviceKey: "iPhone14,5",  color: "Midnight",           hasDark: true  },
  "iPhone 13 Mini":    { deviceKey: "iPhone14,4",  color: "Midnight",           hasDark: true  },

  // iPhone 12 line (2020)
  "iPhone 12 Pro Max": { deviceKey: "iPhone13,4",  color: "Pacific Blue",       hasDark: true  },
  "iPhone 12 Pro":     { deviceKey: "iPhone13,3",  color: "Pacific Blue",       hasDark: true  },
  "iPhone 12":         { deviceKey: "iPhone13,2",  color: "Black",              hasDark: true  },
  "iPhone 12 Mini":    { deviceKey: "iPhone13,1",  color: "Black",              hasDark: true  },

  // iPhone 11 line (2019)
  "iPhone 11 Pro Max": { deviceKey: "iPhone12,5",  color: "Midnight Green",     hasDark: true  },
  "iPhone 11 Pro":     { deviceKey: "iPhone12,3",  color: "Midnight Green",     hasDark: true  },
  "iPhone 11":         { deviceKey: "iPhone12,1",  color: "Black",              hasDark: true  },

  // Older iPhones
  "iPhone XR":         { deviceKey: "iPhone11,8",  color: "Black",              hasDark: false },
  "iPhone XS Max":     { deviceKey: "iPhone11,4",  color: "Space Gray",         hasDark: false },
  "iPhone XS":         { deviceKey: "iPhone11,2",  color: "Space Gray",         hasDark: false },
  "iPhone X":          { deviceKey: "iPhone10,3",  color: "Space Gray",         hasDark: false },
  "iPhone SE 2022":    { deviceKey: "iPhone14,6",  color: "Midnight",           hasDark: true  },
  "iPhone SE 2020":    { deviceKey: "iPhone12,8",  color: "Black",              hasDark: true  },
  "iPhone 8 Plus":     { deviceKey: "iPhone10,2",  color: "Space Gray",         hasDark: false },
  "iPhone 8":          { deviceKey: "iPhone10,1",  color: "Silver",             hasDark: false },
};

// ─── iPad mapping ─────────────────────────────────────────────────────────────

export const IPAD_IMAGES: Record<string, AppleDeviceImage> = {
  'iPad Pro 13" M4':      { deviceKey: "iPad16,5",   color: "Silver",         hasDark: false },
  'iPad Pro 12.9" M2':    { deviceKey: "iPad14,5",   color: "Silver",         hasDark: false },
  'iPad Pro 11" M4':      { deviceKey: "iPad16,3",   color: "Silver",         hasDark: false },
  'iPad Pro 11" M2':      { deviceKey: "iPad14,3",   color: "Silver",         hasDark: false },
  'iPad Air 13" M2':      { deviceKey: "iPad14,10",  color: "Space Gray",     hasDark: false },
  'iPad Air 11" M2':      { deviceKey: "iPad14,8",   color: "Space Gray",     hasDark: false },
  "iPad Air 5":           { deviceKey: "iPad13,16",  color: "Blue",           hasDark: false },
  "iPad Air 4":           { deviceKey: "iPad13,1",   color: "Silver",         hasDark: true  },
  "iPad 10th Gen":        { deviceKey: "iPad13,18",  color: "Blue",           hasDark: false },
  "iPad 9th Gen":         { deviceKey: "iPad12,1",   color: "Silver",         hasDark: false },
  "iPad 8th Gen":         { deviceKey: "iPad12,1",   color: "Silver",         hasDark: false }, // fallback to 9th gen
  "iPad 7th Gen":         { deviceKey: "iPad12,1",   color: "Silver",         hasDark: false }, // fallback
  "iPad Mini 6":          { deviceKey: "iPad14,1",   color: "Space Gray",     hasDark: false },
  "iPad Mini 5":          { deviceKey: "iPad14,1",   color: "Space Gray",     hasDark: false }, // fallback
};

// ─── MacBook mapping ──────────────────────────────────────────────────────────

export const MACBOOK_IMAGES: Record<string, AppleDeviceImage> = {
  'MacBook Air 15" M3':    { deviceKey: "Mac14,15",      color: "Midnight",    hasDark: false }, // M3 15 has no img → use M2 15
  'MacBook Air 15" M2':    { deviceKey: "Mac14,15",      color: "Midnight",    hasDark: false },
  'MacBook Air 13" M3':    { deviceKey: "Mac15,12",      color: "Midnight",    hasDark: false },
  'MacBook Air 13" M2':    { deviceKey: "Mac14,2",       color: "Midnight",    hasDark: false },
  'MacBook Air 13" M1':    { deviceKey: "MacBookAir10,1",color: "Space Gray",  hasDark: false },
  'MacBook Pro 16" M3':    { deviceKey: "Mac15,7",       color: "Space Black", hasDark: false },
  'MacBook Pro 14" M3':    { deviceKey: "Mac15,3",       color: "Space Gray",  hasDark: false },
  'MacBook Pro 16" M2':    { deviceKey: "Mac14,6",       color: "Silver",      hasDark: false },
  'MacBook Pro 14" M2':    { deviceKey: "Mac14,5",       color: "Silver",      hasDark: false },
  'MacBook Pro 16" M1':    { deviceKey: "MacBookPro18,1",color: "Space Gray",  hasDark: true  },
  'MacBook Pro 14" M1':    { deviceKey: "MacBookPro18,3",color: "Space Gray",  hasDark: true  },
  'MacBook Pro 13" M1/M2': { deviceKey: "Mac14,7",       color: "Space Gray",  hasDark: false },
  'MacBook Pro 13" Intel': { deviceKey: "MacBookPro17,1",color: "Space Gray",  hasDark: false },
};

// ─── Combined lookup ──────────────────────────────────────────────────────────

const ALL_APPLE_IMAGES: Record<string, AppleDeviceImage> = {
  ...IPHONE_IMAGES,
  ...IPAD_IMAGES,
  ...MACBOOK_IMAGES,
};

/**
 * Look up the CDN image for a given Apple device model name.
 * Returns undefined if not found (caller should fall back to SVG).
 */
export function getAppleDeviceImage(modelName: string): AppleDeviceImage | undefined {
  return ALL_APPLE_IMAGES[modelName];
}

/**
 * Returns the CDN image URL for a model, or null if not found.
 */
export function getAppleDeviceImageUrl(
  modelName: string,
  res: 64 | 256 = 256,
  preferDark = true
): string | null {
  const device = getAppleDeviceImage(modelName);
  if (!device) return null;
  return appleImageUrl(device, res, preferDark);
}

export default ALL_APPLE_IMAGES;
