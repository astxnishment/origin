import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingCTA from "@/components/FloatingCTA";
import MobileCTABar from "@/components/MobileCTABar";
import { BUSINESS, SEO, SERVICES } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Origin Repairs — Premium Device Repair in Leeds",
    template: "%s | Origin Repairs",
  },
  description:
    "Expert repair for phones, tablets, laptops, consoles, custom PCs and liquid-damaged devices. Based in Leeds.",
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
  icons: {
    icon: [
      { url: "/logos/origin-icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/logos/origin-icon.png"],
  },
  openGraph: {
    title: "Origin Repairs — Premium Device Repair in Leeds",
    description: "Expert device repair. Same-day service. 12-month warranty.",
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
    title: "Origin Repairs — Premium Device Repair in Leeds",
    description: "Expert device repair. Same-day service. 12-month warranty.",
    images: ["/logos/origin-logo-light.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
    (() => {
      try {
        const stored = localStorage.getItem("origin-theme");
        const theme = stored === "light" || stored === "dark" ? stored : "dark";
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");
        root.dataset.theme = theme;
        root.style.colorScheme = theme;
      } catch {
        document.documentElement.classList.add("dark");
        document.documentElement.dataset.theme = "dark";
        document.documentElement.style.colorScheme = "dark";
      }
    })();
  `;

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${SEO.siteUrl}/#business`,
        name: BUSINESS.name,
        description:
          "Device repair service in Leeds city centre. Expert phone, tablet, laptop, console, custom PC, liquid damage and data recovery repairs.",
        url: SEO.siteUrl,
        telephone: BUSINESS.phone,
        email: BUSINESS.email,
        image: `${SEO.siteUrl}/logos/origin-logo-light.png`,
        logo: `${SEO.siteUrl}/logos/origin-icon.png`,
        priceRange: "£39-£599",
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
        areaServed: [
          "Leeds City Centre",
          "Headingley",
          "Hyde Park",
          "Chapel Allerton",
          "Roundhay",
          "Horsforth",
        ],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
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
        sameAs: [BUSINESS.googleReviewUrl, BUSINESS.trustpilotUrl],
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
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground pb-[60px] md:pb-0">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <div id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </div>
        <FloatingCTA />
        <MobileCTABar />
      </body>
    </html>
  );
}
