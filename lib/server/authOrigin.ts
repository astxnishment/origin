import type { NextRequest } from "next/server";
import { SEO } from "@/lib/constants";

export function publicAuthOrigin(request: NextRequest): string {
  const configured = process.env.AUTH_BASE_URL?.trim();
  if (configured) {
    try {
      const url = new URL(configured);
      if (url.protocol === "https:") return url.origin;
    } catch {
      // Fall through to an allow-listed request origin.
    }
  }

  const hostname = request.nextUrl.hostname;
  const canonicalHostname = new URL(SEO.siteUrl).hostname;
  const trustedRequestHost =
    hostname === canonicalHostname ||
    hostname === `www.${canonicalHostname}` ||
    hostname === "origin-peach.vercel.app" ||
    (process.env.NODE_ENV === "development" &&
      (hostname === "localhost" || hostname === "127.0.0.1"));

  return trustedRequestHost ? request.nextUrl.origin : SEO.siteUrl;
}

