import { appleCategoryImages, applePhoneImages } from "@/lib/deviceImages/appleDeviceImages";

export interface ServiceImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const serviceImages: Record<string, ServiceImage> = {
  // ── Homepage service card illustrations ───────────────────────────────────
  iphone: {
    ...applePhoneImages["iPhone 18 Pro"],
    alt: "iPhone 18 Pro in Burgundy, front and back",
  },
  phones: {
    src: "/images/services/iphone-samsung-phones.webp",
    alt: "Burgundy iPhone and silver Samsung Galaxy side by side — phone repairs at Origin Repairs Leeds",
    width: 1058,
    height: 1148,
  },
  samsung: {
    src: "/images/services/samsung-galaxy-s26-ultra.webp",
    alt: "Cobalt Violet Samsung Galaxy S26 Ultra, front and back with S Pen",
    width: 1093,
    height: 1093,
  },
  otherAndroidPhones: {
    src: "/images/services/other-android-phones.webp",
    alt: "OnePlus, Xiaomi, Sony and other Android phone repair at Origin Repairs Leeds",
    width: 956,
    height: 990,
  },
  ipad: {
    ...appleCategoryImages.ipad,
    alt: "iPad repair at Origin Repairs Leeds — screen and battery replacement",
  },
  tablets: {
    src: "/images/services/tablet-lineup.webp",
    alt: "iPad and Samsung Galaxy Tab repair at Origin Repairs Leeds",
    width: 1162,
    height: 701,
  },
  samsungGalaxyTab: {
    src: "/images/services/samsung-galaxy-tab.webp",
    alt: "Samsung Galaxy Tab repair at Origin Repairs Leeds",
    width: 760,
    height: 939,
  },
  androidLogo: {
    src: "/images/services/android-logo.svg",
    alt: "Android tablet repair at Origin Repairs Leeds",
    width: 96,
    height: 96,
  },
  macbook: {
    ...appleCategoryImages.macbook,
    alt: "Open Space Black MacBook Pro with a blue display and visible keyboard",
  },
  samsungGalaxyBook: {
    src: "/images/services/samsung-galaxy-book.webp",
    alt: "Samsung Galaxy Book laptop repair at Origin Repairs Leeds",
    width: 1200,
    height: 862,
  },
  windowsLogo: {
    src: "/images/services/windows-logo.webp",
    alt: "Windows laptop repair at Origin Repairs Leeds",
    width: 122,
    height: 122,
  },
  laptop: {
    ...appleCategoryImages.macbook,
    alt: "Space Black MacBook Pro — laptop repair at Origin Repairs Leeds",
  },
  dataRecovery: {
    src: "/images/services/data-recovery-v2.webp",
    alt: "Hard drive, NVMe SSD and external drive data recovery at Origin Repairs Leeds",
    width: 1126,
    height: 941,
  },
  liquidDamage: {
    src: "/images/services/liquid-damage-v4.webp",
    alt: "Water-spill damaged phone and laptop repair at Origin Repairs Leeds",
    width: 1223,
    height: 1104,
  },
  console: {
    src: "/images/services/console-lineup.webp",
    alt: "PlayStation 5, Xbox Series X and Nintendo Switch repair at Origin Repairs Leeds",
    width: 1200,
    height: 699,
  },
  playstation: {
    src: "/images/services/console-playstation.webp",
    alt: "PlayStation 5 repair at Origin Repairs Leeds",
    width: 300,
    height: 738,
  },
  xbox: {
    src: "/images/services/console-xbox.webp",
    alt: "Xbox Series X repair at Origin Repairs Leeds",
    width: 406,
    height: 652,
  },
  nintendoSwitch: {
    src: "/images/services/console-switch.webp",
    alt: "Nintendo Switch repair at Origin Repairs Leeds",
    width: 479,
    height: 320,
  },
  customPc: {
    src: "/images/services/custom-pc-modern.webp",
    alt: "White custom PC with a glass case, neatly routed cables and soft blue lighting",
    width: 1200,
    height: 1200,
  },
  // ── Aliases kept for any other pages that reference these keys ───────────
  samsungTab: {
    src: "/images/services/samsung-tab.svg",
    alt: "Samsung Galaxy Tab repair at Origin Repairs Leeds",
    width: 400,
    height: 520,
  },
};

export type ServiceImageKey = keyof typeof serviceImages;
