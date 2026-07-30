import type { MetadataRoute } from "next";
import { INDEXING_ENABLED } from "@/lib/deployment";
import { SEO } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  if (!INDEXING_ENABLED) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/track"],
      },
    ],
    sitemap: `${SEO.siteUrl}/sitemap.xml`,
    host: SEO.siteUrl,
  };
}
