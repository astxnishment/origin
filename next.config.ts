import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow real Apple device images from appledb.dev CDN
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.appledb.dev",
        pathname: "/device@**",
      },
    ],
  },
};

export default nextConfig;
