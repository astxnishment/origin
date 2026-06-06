import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import FloatingCTA from "@/components/FloatingCTA";
import EmergencyBanner from "@/components/EmergencyBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ORIGIN — Premium Device Repair in Leeds",
  description:
    "Expert repair for iPhones, Samsung, iPads, and MacBooks. Fast, reliable, and backed by a 12-month warranty. Based in Leeds.",
  metadataBase: new URL("https://originrepairs.co.uk"),
  openGraph: {
    title: "ORIGIN — Premium Device Repair in Leeds",
    description: "Expert device repair. Same-day service. 12-month warranty.",
    url: "https://originrepairs.co.uk",
    siteName: "ORIGIN Repairs",
    locale: "en_GB",
    type: "website",
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
    name: "ORIGIN Repairs",
    description:
      "Premium device repair service in Leeds. Expert iPhone, Samsung, MacBook, and iPad repairs with same-day service.",
    url: "https://originrepairs.co.uk",
    telephone: "07768426754",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <EmergencyBanner />
          {children}
          <FloatingCTA />
        </ThemeProvider>
      </body>
    </html>
  );
}
