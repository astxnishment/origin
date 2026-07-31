export type VerifiedReview = {
  author: string;
  source: "Google" | "Trustpilot";
  sourceUrl: string;
  content: string;
  rating: number;
  publishedAt?: string;
};

export type TrustProfile = {
  googleBusinessUrl?: string;
  googleReviewUrl?: string;
  trustpilotUrl?: string;
  rating?: number;
  reviewCount?: number;
  verifiedReviews?: VerifiedReview[];
};

export type FeatureFlags = {
  walkInsEnabled: boolean;
  bookingEnabled: boolean;
  mailInEnabled: boolean;
  trackingEnabled: boolean;
  customerAccountsEnabled: boolean;
};

function optionalUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function publicFlag(value: string | undefined, fallback: boolean): boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function siteUrl(): string {
  return optionalUrl(process.env.NEXT_PUBLIC_SITE_URL)?.replace(/\/$/, "") ??
    "https://originrepairs.co.uk";
}

/**
 * Production checklist: every address, opening time, service method and feature
 * flag below must be confirmed by the owner before launch.
 */
export const BUSINESS = {
  name: "Origin Repairs",
  email: "tech@originrepairs.co.uk",
  phone: "+447768426754",
  phoneDisplay: "+44 7768 426754",
  phoneHref: "tel:+447768426754",
  address: "76 Cookridge Street, Leeds, LS2 8GL",
  addressLines: ["76 Cookridge Street", "Leeds, LS2 8GL"],
  coordinates: {
    lat: 53.8017,
    lng: -1.5543,
  },
  hours: {
    monday: "9:00am - 6:00pm",
    tuesday: "9:00am - 6:00pm",
    wednesday: "9:00am - 6:00pm",
    thursday: "9:00am - 6:00pm",
    friday: "9:00am - 6:00pm",
    saturday: "10:00am - 4:00pm",
    sunday: "Closed",
  },
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Origin%20Repairs%2C%2076%20Cookridge%20Street%2C%20Leeds%20LS2%208GL",
  googleDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Origin%20Repairs%2C%2076%20Cookridge%20Street%2C%20Leeds%20LS2%208GL",
  googleMapsEmbedUrl:
    "https://www.google.com/maps?q=Origin%20Repairs%2C%2076%20Cookridge%20Street%2C%20Leeds%20LS2%208GL&output=embed",
  location: "Leeds, UK",
  postcode: "LS2 8GL",
} as const;

export const FEATURES: FeatureFlags = {
  bookingEnabled: publicFlag(
    process.env.NEXT_PUBLIC_BOOKING_ENABLED,
    true
  ),
  walkInsEnabled: publicFlag(
    process.env.NEXT_PUBLIC_WALK_INS_ENABLED,
    false
  ),
  mailInEnabled: publicFlag(
    process.env.NEXT_PUBLIC_MAIL_IN_ENABLED,
    false
  ),
  trackingEnabled: publicFlag(
    process.env.NEXT_PUBLIC_TRACKING_ENABLED,
    false
  ),
  customerAccountsEnabled: publicFlag(
    process.env.NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED,
    true
  ),
};

export const TRUST: TrustProfile = {
  googleBusinessUrl: optionalUrl(
    process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL
  ),
  googleReviewUrl: optionalUrl(process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL),
  trustpilotUrl: optionalUrl(process.env.NEXT_PUBLIC_TRUSTPILOT_URL),
  verifiedReviews: [],
};

export const SEO = {
  siteName: BUSINESS.name,
  siteUrl: siteUrl(),
  description:
    "Device repair in Leeds for phones, tablets, laptops, consoles and custom PCs, with the price agreed before work begins.",
  keywords:
    "device repair Leeds, iPhone repair Leeds, Samsung repair Leeds, laptop repair Leeds, console repair Leeds, custom PC builds Leeds, PC upgrades Leeds, liquid damage repair Leeds",
} as const;

export const SERVICES = [
  {
    name: "Phone Repairs",
    href: "/repairs/phones",
    description: "iPhone, Samsung Galaxy, Google Pixel and other phone repairs",
  },
  {
    name: "Laptop Repairs",
    href: "/repairs/laptops",
    description: "MacBook, Windows, gaming and business laptop repairs",
  },
  {
    name: "Console Repairs",
    href: "/repairs/consoles",
    description: "PlayStation, Xbox and Nintendo Switch repairs",
  },
  {
    name: "Custom PC Builds & Upgrades",
    href: "/repairs/custom-pc",
    description: "Custom PC assembly, component upgrades and diagnostics",
  },
  {
    name: "Data Recovery",
    href: "/repairs/data-recovery",
    description: "Assessment-led recovery for devices, SSDs and hard drives",
  },
  {
    name: "Liquid Damage Repair",
    href: "/repairs/liquid-damage",
    description: "Liquid-damage assessment, cleaning and board-level repair",
  },
] as const;
