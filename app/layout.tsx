import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingCTA from "@/components/FloatingCTA";
import MobileCTABar from "@/components/MobileCTABar";

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
    "Expert repair for iPhones, Samsung, iPads, and MacBooks. Fast, reliable, and backed by a 12-month warranty. Based in Leeds.",
  metadataBase: new URL("https://originrepairs.co.uk"),
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
    url: "https://originrepairs.co.uk",
    siteName: "Origin Repairs",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/logos/origin-logo-light.png",
        width: 1298,
        height: 1001,
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
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Origin Repairs",
    description:
      "Premium device repair service in Leeds. Expert iPhone, Samsung, MacBook, and iPad repairs with same-day service.",
    url: "https://originrepairs.co.uk",
    telephone: "+447768426754",
    email: "tech@originrepairs.co.uk",
    address: {
      "@type": "PostalAddress",
      streetAddress: "76 Cookridge Street",
      addressLocality: "Leeds",
      postalCode: "LS2 8GL",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 53.8017,
      longitude: -1.5543,
    },
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
    priceRange: "£39-£599",
    sameAs: [
      "https://www.google.com/search?q=Origin+Repairs+Leeds",
      "https://www.trustpilot.com",
    ],
  };

  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground pb-[60px] md:pb-0">
        {children}
        <FloatingCTA />
        <MobileCTABar />
      </body>
    </html>
  );
}
