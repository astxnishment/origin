import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Cloudflare release serves our compressed WebP assets directly.
  // Vercel retains its existing image optimizer.
  images: { unoptimized: process.env.HOSTING_PROVIDER === "cloudflare" },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
