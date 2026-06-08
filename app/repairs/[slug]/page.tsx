import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ALL_DEVICES,
  REPAIR_TYPES,
  buildRepairSlug,
  parseRepairSlug,
  getRepairQuote,
} from "@/lib/calculatorData";
import { ArrowRight, Check, Clock, Shield, MapPin, Star } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

// ── Static params (generates ~500 SEO pages at build time) ───────
export function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const device of ALL_DEVICES) {
    for (const repairType of REPAIR_TYPES) {
      params.push({ slug: buildRepairSlug(device, repairType) });
    }
  }
  return params;
}

// ── Metadata ─────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseRepairSlug(slug);
  if (!parsed) return { title: "Repair not found" };

  const { device, repairType } = parsed;
  const title = `${device.name} ${repairType} Leeds`;
  const description = `Professional ${repairType.toLowerCase()} for ${device.name} in Leeds. Same-day service, OEM-grade parts, 12-month warranty on eligible repairs. 76 Cookridge Street, Leeds. Call 07768 426754.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Origin Repairs`,
      description,
      url: `https://originrepairs.co.uk/repairs/${slug}`,
      siteName: "Origin Repairs",
      locale: "en_GB",
      type: "website",
      images: ["/origin_repairs_logo.png"],
    },
  };
}

// ── Page ─────────────────────────────────────────────────────────
export default async function RepairPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseRepairSlug(slug);
  if (!parsed) notFound();

  const { device, repairType } = parsed;
  const quote = getRepairQuote(device, repairType);

  // Find related repairs (same device, different repair types)
  const relatedRepairs = REPAIR_TYPES.filter((r) => r !== repairType)
    .slice(0, 4)
    .map((r) => ({
      repairType: r,
      slug: buildRepairSlug(device, r),
      quote: getRepairQuote(device, r),
    }));

  // JSON-LD for this specific repair
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${device.name} ${repairType}`,
    description: `Professional ${repairType.toLowerCase()} for ${device.name} in Leeds.`,
    provider: {
      "@type": "LocalBusiness",
      name: "Origin Repairs",
      address: {
        "@type": "PostalAddress",
        streetAddress: "76 Cookridge Street",
        addressLocality: "Leeds",
        postalCode: "LS2 8GL",
        addressCountry: "GB",
      },
      telephone: "07768426754",
    },
    areaServed: "Leeds",
    offers: {
      "@type": "Offer",
      price: `${quote.minPrice}`,
      priceCurrency: "GBP",
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: quote.minPrice,
        maxPrice: quote.maxPrice,
        priceCurrency: "GBP",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="absolute top-32 left-1/4 w-96 h-96 bg-blue-500/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/repairs"
              className="hover:text-foreground transition-colors"
            >
              Repairs
            </Link>
            <span>/</span>
            <span className="text-foreground">{device.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Content */}
            <div>
              <div className="badge-premium mb-5 w-fit">
                <MapPin className="h-3.5 w-3.5" />
                Leeds, LS2 8GL
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
                {device.name}
                <br />
                <span className="text-blue-500">{repairType}</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Professional {repairType.toLowerCase()} for your {device.name}{" "}
                at Origin Repairs, Leeds. OEM-grade parts, expert technicians,
                and a 12-month warranty on every job.
              </p>

              {/* Trust checklist */}
              <ul className="space-y-3 mb-10">
                {[
                  "Same-day service available",
                  "OEM-grade replacement parts",
                  "12-month parts & labour warranty",
                  "Free diagnostic if we can't fix it",
                  "Fixed quote before we start",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="btn-primary h-11 px-7">
                  <Link href="/book" className="flex items-center gap-2">
                    Book This Repair
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild className="btn-secondary h-11 px-7">
                  <a href={`tel:${BUSINESS.phone}`}>Call {BUSINESS.phoneDisplay}</a>
                </Button>
              </div>
            </div>

            {/* Right: Quote card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, rgba(18,18,18,0.95) 0%, rgba(10,10,10,0.98) 100%)",
                border: "1px solid rgba(59,130,246,0.25)",
                boxShadow:
                  "0 0 0 1px rgba(59,130,246,0.1), 0 24px 60px rgba(59,130,246,0.1)",
              }}
            >
              <div className="px-7 pt-7 pb-5 border-b border-white/[0.06]">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.14em]">
                  Repair Quote
                </span>
                <h2 className="text-xl font-bold text-foreground mt-2">
                  {device.name}
                </h2>
                <p className="text-sm text-muted-foreground">{repairType}</p>
              </div>

              <div className="px-7 py-6 space-y-5">
                {/* Price */}
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                    Estimated Price
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      £{quote.minPrice}
                    </span>
                    <span className="text-2xl font-semibold text-muted-foreground">
                      – £{quote.maxPrice}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    incl. parts & labour
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="p-4 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                      <Clock className="h-3 w-3" />
                      Est. Time
                    </div>
                    <p className="text-sm font-semibold">{quote.estimatedTime}</p>
                  </div>
                  <div
                    className="p-4 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                      <Shield className="h-3 w-3" />
                      Warranty
                    </div>
                    <p className="text-sm font-semibold text-green-500">
                      {quote.warranty}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1.5 pt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-blue-500 text-blue-500" />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">
                    Trusted by Leeds customers
                  </span>
                </div>

                <Button asChild className="w-full btn-primary h-11 rounded-xl">
                  <Link href="/book" className="flex items-center justify-center gap-2">
                    Book Repair Online
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <p className="text-[11px] text-muted-foreground text-center">
                  Final price confirmed after free inspection
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Repairs ─────────────────────────────────── */}
      <section className="section-border">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16">
          <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">
            Also Available
          </p>
          <h2 className="text-3xl font-bold tracking-tight mb-8">
            Other {device.name} repairs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedRepairs.map(({ repairType: rt, slug: s, quote: q }) => (
              <Link
                key={s}
                href={`/repairs/${s}`}
                className="group card-premium p-5 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-sm text-foreground group-hover:text-blue-500 transition-colors">
                    {rt}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    From £{q.minPrice} · {q.estimatedTime}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Address / Contact ───────────────────────────────── */}
      <section className="section-border bg-surface/30">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 text-center">
          <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">
            Find Us
          </p>
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Visit us in Leeds
          </h2>
          <p className="text-muted-foreground mb-2">
            76 Cookridge Street, Leeds, LS2 8GL
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Mon–Fri 9am–6pm · Sat 10am–4pm · Walk-ins welcome
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="btn-primary h-11 px-8">
              <Link href="/book">Book Online</Link>
            </Button>
            <Button asChild className="btn-secondary h-11 px-8">
              <a href="tel:07768426754">Call 07768 426754</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
