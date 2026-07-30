import { NextRequest, NextResponse } from "next/server";
import { SEO } from "@/lib/business-config";

const canonicalUrl = new URL(SEO.siteUrl);
const canonicalHostname = canonicalUrl.hostname;

function contentSecurityPolicy(nonce: string, production: boolean): string {
  const scriptSources = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    ...(production ? [] : ["'unsafe-eval'"]),
    "https://challenges.cloudflare.com",
  ];

  return [
    "default-src 'self'",
    `script-src ${scriptSources.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.google.com https://*.gstatic.com",
    "font-src 'self' data:",
    "connect-src 'self' https://challenges.cloudflare.com",
    "frame-src https://www.google.com https://maps.google.com https://challenges.cloudflare.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    ...(production ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const hostname =
    request.headers.get("x-forwarded-host")?.split(",")[0].trim().split(":")[0] ??
    request.nextUrl.hostname;
  const production = process.env.VERCEL_ENV === "production";

  if (production && hostname === `www.${canonicalHostname}`) {
    const destination = new URL(
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
      canonicalUrl
    );
    return NextResponse.redirect(destination, 308);
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const policy = contentSecurityPolicy(nonce, production);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", policy);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", policy);

  if (hostname !== canonicalHostname) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  if (production && hostname === canonicalHostname) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
