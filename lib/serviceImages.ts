export interface ServiceImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const serviceImages: Record<string, ServiceImage> = {
  iphone: {
    src: "/images/services/iphone.png",
    alt: "iPhone repair at Origin Repairs Leeds — screen, battery, charging port and more",
    width: 400,
    height: 400,
  },
  samsung: {
    src: "/images/services/samsung-phone.svg",
    alt: "Samsung Galaxy phone repair at Origin Repairs Leeds",
    width: 300,
    height: 600,
  },
  ipad: {
    src: "/images/services/ipad.png",
    alt: "iPad repair at Origin Repairs Leeds — screen and battery replacement",
    width: 800,
    height: 800,
  },
  macbook: {
    src: "/images/services/macbook.png",
    alt: "MacBook repair at Origin Repairs Leeds — screen, battery and keyboard",
    width: 1104,
    height: 700,
  },
  laptop: {
    src: "/images/services/laptop.svg",
    alt: "Laptop repair at Origin Repairs Leeds",
    width: 600,
    height: 420,
  },
  samsungTab: {
    src: "/images/services/samsung-tab.svg",
    alt: "Samsung Galaxy Tab repair at Origin Repairs Leeds",
    width: 400,
    height: 520,
  },
  dataRecovery: {
    src: "/images/services/data-recovery.webp",
    alt: "Data recovery service at Origin Repairs Leeds — phone, laptop, SSD and hard drive",
    width: 400,
    height: 400,
  },
};

export type ServiceImageKey = keyof typeof serviceImages;
