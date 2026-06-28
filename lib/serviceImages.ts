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
  macbook: {
    src: "/images/services/macbook.png",
    alt: "MacBook repair at Origin Repairs Leeds — screen, battery and keyboard",
    width: 1104,
    height: 700,
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
