// Released models verified against Apple UK on 22 September 2026.
// iPhone Duo is not included: pre-orders do not open until 16 October.
export const NEW_IPHONE_MODELS = ["iPhone 18 Pro Max", "iPhone 18 Pro"] as const;

// Shared category illustrations keep repair pages and device pickers in sync.
export const appleCategoryImages = {
  ipad: { src: "/images/services/ipad.webp", width: 698, height: 800 },
  macbook: { src: "/images/services/macbook-pro-open.webp", width: 1200, height: 775 },
} as const;

export const applePhoneImages: Record<string, { src: string; width: number; height: number }> = {
  "iPhone 18 Pro": { src: "/images/iphones/iphone-18-pro-device.webp", width: 378, height: 456 },
  "iPhone 18 Pro Max": { src: "/images/iphones/iphone-18-pro-max-device.webp", width: 406, height: 498 },
  "iPhone 17": { src: "/images/iphones/iphone-17.webp", width: 996, height: 650 },
  "iPhone 17e": { src: "/images/iphones/iphone-17e.webp", width: 690, height: 656 },
  "iPhone Air": { src: "/images/iphones/iphone-air.webp", width: 904, height: 660 },
  "iPhone 17 Pro": { src: "/images/iphones/iphone-17-pro.webp", width: 939, height: 659 },
  "iPhone 17 Pro Max": { src: "/images/iphones/iphone-17-pro-max.webp", width: 950, height: 700 },
};
