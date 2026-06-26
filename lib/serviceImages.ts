export interface ServiceImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const serviceImages: Record<string, ServiceImage> = {
  // ── Homepage service card illustrations ───────────────────────────────────
  iphone: {
    src: "/images/services/iphone-device.svg",
    alt: "iPhone repair at Origin Repairs Leeds — screen, battery, charging port and more",
    width: 240,
    height: 480,
  },
  samsung: {
    src: "/images/services/samsung-phone.svg",
    alt: "Samsung Galaxy phone repair at Origin Repairs Leeds",
    width: 240,
    height: 480,
  },
  ipad: {
    src: "/images/services/ipad-device.svg",
    alt: "iPad repair at Origin Repairs Leeds — screen and battery replacement",
    width: 400,
    height: 530,
  },
  macbook: {
    src: "/images/services/macbook-device.svg",
    alt: "MacBook repair at Origin Repairs Leeds — screen, battery and keyboard",
    width: 560,
    height: 400,
  },
  laptop: {
    src: "/images/services/macbook-device.svg",
    alt: "Laptop repair at Origin Repairs Leeds",
    width: 560,
    height: 400,
  },
  dataRecovery: {
    src: "/images/services/data-recovery-device.png",
    alt: "Data recovery service at Origin Repairs Leeds — phone, laptop, SSD and hard drive",
    width: 600,
    height: 450,
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
