export interface ServiceImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const serviceImages: Record<string, ServiceImage> = {
  // ── Homepage service card illustrations ───────────────────────────────────
  iphone: {
    src: "/images/services/iphone.png",
    alt: "iPhone repair at Origin Repairs Leeds — screen, battery, charging port and more",
    width: 2000,
    height: 2000,
  },
  phones: {
    src: "/images/services/phone-lineup.png",
    alt: "iPhone, Samsung Galaxy and Google Pixel phone repair at Origin Repairs Leeds",
    width: 1093,
    height: 970,
  },
  samsung: {
    src: "/images/services/samsung.avif",
    alt: "Samsung Galaxy phone repair at Origin Repairs Leeds",
    width: 1200,
    height: 900,
  },
  ipad: {
    src: "/images/services/ipad.png",
    alt: "iPad repair at Origin Repairs Leeds — screen and battery replacement",
    width: 800,
    height: 800,
  },
  tablets: {
    src: "/images/services/tablet-lineup.png",
    alt: "iPad and Samsung Galaxy Tab repair at Origin Repairs Leeds",
    width: 1162,
    height: 701,
  },
  samsungGalaxyTab: {
    src: "/images/services/samsung-galaxy-tab.png",
    alt: "Samsung Galaxy Tab repair at Origin Repairs Leeds",
    width: 1536,
    height: 1024,
  },
  androidLogo: {
    src: "/images/services/android-logo.svg",
    alt: "Android tablet repair at Origin Repairs Leeds",
    width: 96,
    height: 96,
  },
  macbook: {
    src: "/images/services/macbook.png",
    alt: "MacBook repair at Origin Repairs Leeds — screen, battery and keyboard",
    width: 1104,
    height: 700,
  },
  samsungGalaxyBook: {
    src: "/images/services/samsung-galaxy-book.png",
    alt: "Samsung Galaxy Book laptop repair at Origin Repairs Leeds",
    width: 1536,
    height: 1024,
  },
  windowsLogo: {
    src: "/images/services/windows-logo.png",
    alt: "Windows laptop repair at Origin Repairs Leeds",
    width: 192,
    height: 192,
  },
  laptop: {
    src: "/images/services/macbook.png",
    alt: "Laptop repair at Origin Repairs Leeds",
    width: 1104,
    height: 700,
  },
  dataRecovery: {
    src: "/images/services/data-recovery.webp",
    alt: "Data recovery service at Origin Repairs Leeds — phone, laptop, SSD and hard drive",
    width: 350,
    height: 350,
  },
  dataRecoveryLiquidDamage: {
    src: "/images/services/data-recovery-liquid-damage.png",
    alt: "Data recovery and liquid damage repair at Origin Repairs Leeds",
    width: 1254,
    height: 1254,
  },
  console: {
    src: "/images/services/console-lineup.png",
    alt: "PlayStation 5, Xbox Series X and Nintendo Switch repair at Origin Repairs Leeds",
    width: 1312,
    height: 764,
  },
  playstation: {
    src: "/images/services/console-playstation.png",
    alt: "PlayStation 5 repair at Origin Repairs Leeds",
    width: 300,
    height: 738,
  },
  xbox: {
    src: "/images/services/console-xbox.png",
    alt: "Xbox Series X repair at Origin Repairs Leeds",
    width: 406,
    height: 652,
  },
  nintendoSwitch: {
    src: "/images/services/console-switch.png",
    alt: "Nintendo Switch repair at Origin Repairs Leeds",
    width: 479,
    height: 320,
  },
  customPc: {
    src: "/images/services/custom-pc-build.png",
    alt: "Custom gaming PC build and upgrade service at Origin Repairs Leeds",
    width: 1536,
    height: 1024,
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
