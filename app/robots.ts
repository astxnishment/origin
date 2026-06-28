import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://originrepairs.co.uk/sitemap.xml",
    host: "https://originrepairs.co.uk",
  };
}
