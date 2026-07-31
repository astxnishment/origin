import type { MetadataRoute } from "next";
import {
  ALL_DEVICES,
  buildRepairSlug,
  getRepairTiers,
  getSupportedRepairTypes,
} from "@/lib/calculatorData";
import { FEATURES, SEO } from "@/lib/constants";
import { INDEXING_ENABLED } from "@/lib/deployment";

const BASE_URL = SEO.siteUrl;
const CONTENT_LAST_MODIFIED = new Date(
  process.env.SITE_CONTENT_LAST_MODIFIED ?? "2026-07-29"
);

export default function sitemap(): MetadataRoute.Sitemap {
  if (!INDEXING_ENABLED) return [];

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/quote`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.9 },
    ...(FEATURES.bookingEnabled
      ? [{ url: `${BASE_URL}/book`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.9 }]
      : []),
    ...(FEATURES.mailInEnabled
      ? [{ url: `${BASE_URL}/mail-in`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.8 }]
      : []),
    { url: `${BASE_URL}/repairs`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/repairs/phones`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/repairs/iphone`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/repairs/samsung`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/repairs/ipad`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/repairs/google-pixel`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/repairs/laptops`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/repairs/consoles`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/repairs/custom-pc`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/repairs/data-recovery`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/repairs/liquid-damage`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/pricing`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/warranty`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: CONTENT_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.3 },
  ];

  const repairPages: MetadataRoute.Sitemap = ALL_DEVICES.flatMap((device) =>
    getSupportedRepairTypes(device)
      .filter((repairType) =>
        getRepairTiers(device, repairType).some((entry) => entry.seoEligible)
      )
      .map((repairType) => ({
        url: `${BASE_URL}/repairs/${buildRepairSlug(device, repairType)}`,
        lastModified: CONTENT_LAST_MODIFIED,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
  );

  return [...staticPages, ...repairPages];
}
