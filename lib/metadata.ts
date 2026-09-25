import type { Metadata } from "next";
import { SEO } from "@/lib/business-config";

export function pageMetadata(path: string, metadata: Metadata): Metadata {
  const title = typeof metadata.title === "string" ? metadata.title : SEO.siteName;
  const description = metadata.description ?? SEO.description;
  const images = [{ url: "/logos/origin-logo-light.png", width: 1438, height: 798, alt: "Origin Repairs" }];
  return {
    ...metadata,
    alternates: { ...metadata.alternates, canonical: path },
    openGraph: {
      type: "website", locale: "en_GB", siteName: SEO.siteName,
      images, ...metadata.openGraph, title, description, url: path,
    },
    twitter: {
      card: "summary_large_image", images: images.map((image) => image.url),
      ...metadata.twitter, title, description,
    },
  };
}
