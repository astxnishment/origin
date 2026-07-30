import type { Metadata } from "next";
import { headers } from "next/headers";
import localFont from "next/font/local";
import "./globals.css";
import MobileCTABar from "@/components/MobileCTABar";
import { BUSINESS, FEATURES, SEO, SERVICES, TRUST } from "@/lib/constants";
import { INDEXING_ENABLED } from "@/lib/deployment";

const geistSans = localFont({
  src: "../public/fonts/geist-latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "../public/fonts/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Origin Repairs — Device Repair in Leeds",
    template: "%s | Origin Repairs",
  },
  description:
    "Repair for phones, tablets, laptops, consoles, custom PCs and liquid-damaged devices in Leeds.",
  metadataBase: new URL(SEO.siteUrl),
  keywords: [
    "device repair Leeds",
    "iPhone repair Leeds",
    "Samsung repair Leeds",
    "MacBook repair Leeds",
    "iPad repair Leeds",
    "data recovery Leeds",
    "console repair Leeds",
    "custom PC builds Leeds",
    "PC upgrades Leeds",
    "liquid damage repair Leeds",
  ],
  category: "Device repair",
  alternates: {
    canonical: SEO.siteUrl,
  },
  robots: {
    index: INDEXING_ENABLED,
    follow: INDEXING_ENABLED,
    googleBot: {
      index: INDEXING_ENABLED,
      follow: INDEXING_ENABLED,
    },
  },
  icons: {
    icon: [
      { url: "/logos/origin-icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/logos/origin-icon.png"],
  },
  openGraph: {
    title: "Origin Repairs — Device Repair in Leeds",
    description:
      "Device repair in Leeds with clear estimates and repair-specific warranty terms.",
    url: SEO.siteUrl,
    siteName: "Origin Repairs",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/logos/origin-logo-light.png",
        width: 1438,
        height: 798,
        alt: "Origin Repairs logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Origin Repairs — Device Repair in Leeds",
    description:
      "Device repair in Leeds with clear estimates and repair-specific warranty terms.",
    images: ["/logos/origin-logo-light.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
    (() => {
      try {
        const stored = localStorage.getItem("origin-theme");
        const theme = stored === "light" || stored === "dark"
          ? stored
          : window.matchMedia("(prefers-color-scheme: light)").matches
            ? "light"
            : "dark";
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");
        root.dataset.theme = theme;
        root.style.colorScheme = theme;
      } catch {
        const theme = window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";
        document.documentElement.classList.toggle("dark", theme === "dark");
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
      }
    })();
  `;
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${SEO.siteUrl}/#business`,
        name: BUSINESS.name,
        description:
          "Device repair service in Leeds for phones, tablets, laptops, consoles, custom PCs, liquid damage and data recovery assessment.",
        url: SEO.siteUrl,
        telephone: BUSINESS.phone,
        email: BUSINESS.email,
        image: `${SEO.siteUrl}/logos/origin-logo-light.png`,
        logo: `${SEO.siteUrl}/logos/origin-icon.png`,
        address: {
          "@type": "PostalAddress",
          streetAddress: "76 Cookridge Street",
          addressLocality: "Leeds",
          postalCode: BUSINESS.postcode,
          addressCountry: "GB",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: BUSINESS.coordinates.lat,
          longitude: BUSINESS.coordinates.lng,
        },
        hasMap: BUSINESS.googleMapsUrl,
        areaServed: "Leeds",
        ...(FEATURES.walkInsEnabled
          ? {
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                  opens: "09:00",
                  closes: "18:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "10:00",
                  closes: "16:00",
                },
              ],
            }
          : {}),
        makesOffer: SERVICES.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.name,
            description: service.description,
            areaServed: "Leeds",
            provider: { "@id": `${SEO.siteUrl}/#business` },
          },
          url: `${SEO.siteUrl}${service.href}`,
        })),
        ...(TRUST.googleBusinessUrl || TRUST.trustpilotUrl
          ? {
              sameAs: [
                TRUST.googleBusinessUrl,
                TRUST.trustpilotUrl,
              ].filter((url): url is string => Boolean(url)),
            }
          : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${SEO.siteUrl}/#website`,
        url: SEO.siteUrl,
        name: SEO.siteName,
        publisher: { "@id": `${SEO.siteUrl}/#business` },
        inLanguage: "en-GB",
      },
    ],
  };

  return (
    <html
      lang="en-GB"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <script
          nonce={nonce}
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <div id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </div>
        {process.env.VERCEL_ENV === "preview" && (
          <div className="fixed bottom-16 left-3 z-[90] rounded-md border border-border bg-card px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:bottom-3">
            Preview
          </div>
        )}
        <MobileCTABar />
      </body>
    </html>
  );
}
