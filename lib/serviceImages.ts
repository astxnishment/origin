export interface ServiceImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const serviceImages: Record<string, ServiceImage> = {
  // ── Homepage service card illustrations ───────────────────────────────────
  iphone: {
    src: "/images/services/iphone.webp",
    alt: "iPhone repair at Origin Repairs Leeds — screen, battery, charging port and more",
    width: 969,
    height: 1200,
  },
  phones: {
    src: "/images/services/phone-lineup.webp",
    alt: "iPhone, Samsung Galaxy and Google Pixel phone repair at Origin Repairs Leeds",
    width: 1092,
    height: 970,
  },
  samsung: {
    src: "/images/services/samsung.avif",
    alt: "Samsung Galaxy phone repair at Origin Repairs Leeds",
    width: 1200,
    height: 900,
  },
  ipad: {
    src: "/images/services/ipad.webp",
    alt: "iPad repair at Origin Repairs Leeds — screen and battery replacement",
    width: 698,
    height: 800,
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
    src: "/images/services/macbook.webp",
    alt: "MacBook repair at Origin Repairs Leeds — screen, battery and keyboard",
    width: 1076,
    height: 658,
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
    src: "/images/services/macbook.webp",
    alt: "Laptop repair at Origin Repairs Leeds",
    width: 1076,
    height: 658,
  },
  dataRecovery: {
    src: "/images/services/data-recovery.webp",
    alt: "Data recovery service at Origin Repairs Leeds — phone, laptop, SSD and hard drive",
    width: 350,
    height: 350,
  },
  dataRecoveryLiquidDamage: {
    src: "/images/services/data-recovery-liquid-damage.webp",
    alt: "Data recovery and liquid damage repair at Origin Repairs Leeds",
    width: 893,
    height: 1094,
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
    src: "/images/services/custom-pc-build.webp",
    alt: "Custom gaming PC build and upgrade service at Origin Repairs Leeds",
    width: 696,
    height: 815,
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
