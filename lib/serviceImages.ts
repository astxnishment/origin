export interface ServiceImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const serviceImages: Record<string, ServiceImage> = {
  iphone: {
    src: "/images/services/iphone.png",
    alt: "iPhone repair service at Origin Repairs Leeds",
    width: 400,
    height: 500,
  },
  samsung: {
    src: "/images/services/samsung.avif",
    alt: "Samsung Galaxy repair service at Origin Repairs Leeds",
    width: 400,
    height: 500,
  },
  ipad: {
    src: "/images/services/ipad.png",
    alt: "iPad repair service at Origin Repairs Leeds",
    width: 400,
    height: 500,
  },
  macbook: {
    src: "/images/services/macbook.png",
    alt: "MacBook and laptop repair service at Origin Repairs Leeds",
    width: 600,
    height: 400,
  },
  dataRecovery: {
    src: "/images/services/data-recovery.webp",
    alt: "Data recovery service at Origin Repairs Leeds",
    width: 400,
    height: 400,
  },
};

export type ServiceImageKey = keyof typeof serviceImages;
