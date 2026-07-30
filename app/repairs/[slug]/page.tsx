import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { ArrowRight, Clock, MapPin, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ALL_DEVICES,
  buildBookingHref,
  buildRepairSlug,
  getRepairTiers,
  getSupportedRepairTypes,
  parseRepairSlug,
  type DeviceModel,
  type RepairType,
} from "@/lib/calculatorData";
import {
  selectRecommendedTier,
  type PartOrigin,
  type RepairCatalogueEntry,
} from "@/lib/repairCatalogue";
import { BUSINESS, FEATURES, SEO } from "@/lib/constants";

export const dynamicParams = false;

type GeneratedRepair = {
  device: DeviceModel;
  repairType: RepairType;
};

function generatedRepairs(): GeneratedRepair[] {
  return ALL_DEVICES.flatMap((device) =>
    getSupportedRepairTypes(device)
      .filter((repairType) =>
        getRepairTiers(device, repairType).some((entry) => entry.seoEligible)
      )
      .map((repairType) => ({ device, repairType }))
  );
}

function pageTiers(
  device: DeviceModel,
  repairType: RepairType
): RepairCatalogueEntry[] {
  return getRepairTiers(device, repairType);
}

function isGeneratedRepair(
  device: DeviceModel,
  repairType: RepairType
): boolean {
  return pageTiers(device, repairType).some((entry) => entry.seoEligible);
}

function formatPrice(entry: RepairCatalogueEntry): string {
  if (
    entry.inspectionRequired ||
    entry.minPrice === null ||
    entry.maxPrice === null
  ) {
    return "Assessment required";
  }
  return entry.minPrice === entry.maxPrice
    ? `£${entry.minPrice}`
    : `£${entry.minPrice}–£${entry.maxPrice}`;
}

const PART_ORIGIN_LABELS: Record<PartOrigin, string> = {
  "compatible-aftermarket": "Compatible aftermarket",
  "refurbished-original": "Refurbished original",
  "pulled-original": "Pulled original",
  "genuine-service-part": "Genuine service part",
  diagnostic: "Diagnostic service",
  "not-specified": "Part type confirmed before repair",
};

function jsonLd(value: object): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function generateStaticParams() {
  return generatedRepairs().map(({ device, repairType }) => ({
    slug: buildRepairSlug(device, repairType),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseRepairSlug(slug);
  if (
    !parsed ||
    !isGeneratedRepair(parsed.device, parsed.repairType)
  ) {
    return { title: "Repair not found", robots: { index: false } };
  }

  const { device, repairType } = parsed;
  const tiers = pageTiers(device, repairType);
  const selected = selectRecommendedTier(tiers);
  const title = `${device.name} ${repairType} in Leeds`;
  const description = selected
    ? `${repairType} for ${device.name} in Leeds. ${formatPrice(selected)}, ${selected.estimatedTime}, with ${selected.warranty.toLowerCase()} warranty terms.`
    : `${repairType} assessment for ${device.name} at Origin Repairs in Leeds.`;
  const canonical = `${SEO.siteUrl}/repairs/${slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ${BUSINESS.name}`,
      description,
      url: canonical,
      siteName: BUSINESS.name,
      locale: "en_GB",
      type: "website",
      images: ["/logos/origin-logo-light.png"],
    },
  };
}

export default async function RepairPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tier?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const parsed = parseRepairSlug(slug);
  if (
    !parsed ||
    !isGeneratedRepair(parsed.device, parsed.repairType)
  ) {
    notFound();
  }

  const { device, repairType } = parsed;
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const tiers = pageTiers(device, repairType);
  const selected =
    tiers.find((tier) => tier.partTierId === query.tier) ??
    selectRecommendedTier(tiers);
  if (!selected) notFound();

  const relatedRepairs = getSupportedRepairTypes(device)
    .filter(
      (candidate) =>
        candidate !== repairType &&
        isGeneratedRepair(device, candidate)
    )
    .slice(0, 4);

  const canonical = `${SEO.siteUrl}/repairs/${slug}`;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${device.name} ${repairType}`,
    description: `${repairType} for ${device.name}, with the selected part option and final price confirmed before work begins.`,
    url: canonical,
    provider: {
      "@type": "LocalBusiness",
      name: BUSINESS.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: BUSINESS.addressLines[0],
        addressLocality: "Leeds",
        postalCode: BUSINESS.postcode,
        addressCountry: "GB",
      },
      telephone: BUSINESS.phone,
    },
    areaServed: "Leeds",
    ...(!selected.inspectionRequired &&
    selected.minPrice !== null &&
    selected.maxPrice !== null
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "GBP",
            lowPrice: selected.minPrice,
            highPrice: selected.maxPrice,
            availability: "https://schema.org/LimitedAvailability",
          },
        }
      : {}),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Repairs",
        item: `${SEO.siteUrl}/repairs`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: device.name,
        item: canonical,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: repairType,
        item: canonical,
      },
    ],
  };

  return (
    <>
      <script
        nonce={nonce}
        suppressHydrationWarning
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(serviceSchema) }}
      />
      <script
        nonce={nonce}
        suppressHydrationWarning
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }}
      />
      <Navbar />

      <main className="pb-28 pt-32">
        <section className="mx-auto max-w-5xl px-5 sm:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/repairs"
              className="transition-colors hover:text-foreground"
            >
              Repairs
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">{device.name}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:items-start">
            <div>
              <div className="mb-5 flex w-fit items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                Leeds, {BUSINESS.postcode}
              </div>
              <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
                {device.name}
                <span className="mt-2 block text-muted-foreground">
                  {repairType}
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-[15px] leading-7 text-muted-foreground">
                Choose the part option that suits the device and your budget.
                The final price, availability and repair scope are confirmed
                before work begins.
              </p>

              <dl className="mt-10 grid max-w-xl gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
                <div className="bg-card p-5">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Estimated time
                  </dt>
                  <dd className="mt-2 text-[14px] font-semibold">
                    {selected.estimatedTime}
                  </dd>
                </div>
                <div className="bg-card p-5">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Warranty
                  </dt>
                  <dd className="mt-2 text-[14px] font-semibold">
                    {selected.warranty}
                  </dd>
                </div>
              </dl>
            </div>

            <aside className="rounded-md border border-border bg-card p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Selected option
              </p>
              <h2 className="mt-3 text-lg font-semibold">
                {selected.partTier}
              </h2>
              <p className="mt-1 text-[12px] text-muted-foreground">
                {PART_ORIGIN_LABELS[selected.partOrigin]}
              </p>
              <p className="mt-7 text-3xl font-semibold tracking-tight">
                {formatPrice(selected)}
              </p>
              <p className="mt-2 text-[12px] leading-5 text-muted-foreground">
                {selected.inspectionRequired
                  ? "The fault must be assessed before a final price can be offered."
                  : "Estimate including the listed part option and labour. The final quote is agreed first."}
              </p>

              <div className="mt-6 space-y-3 border-t border-border pt-5 text-[12px] text-muted-foreground">
                <p className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {selected.estimatedTime}
                </p>
                <p className="flex items-start gap-2">
                  <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {selected.warranty}
                </p>
              </div>

              {FEATURES.bookingEnabled && (
                <Button asChild className="mt-7 h-11 w-full rounded-md">
                  <Link
                    href={buildBookingHref(
                      device,
                      repairType,
                      selected.partTierId
                    )}
                  >
                    {selected.inspectionRequired
                      ? "Request an Assessment"
                      : "Request This Repair"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              <a
                href={BUSINESS.phoneHref}
                className="mt-3 block min-h-11 rounded-md border border-border px-4 py-3 text-center text-[13px] font-semibold transition-colors hover:bg-surface"
              >
                Call {BUSINESS.phoneDisplay}
              </a>
            </aside>
          </div>
        </section>

        {tiers.length > 1 && (
          <section className="mx-auto mt-20 max-w-5xl border-t border-border px-5 pt-14 sm:px-8">
            <div className="mb-7 max-w-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Part options
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Compare before you choose.
              </h2>
            </div>
            <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-2">
              {tiers.map((tier) => (
                <article key={tier.id} className="flex flex-col bg-card p-6">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <h3 className="text-[15px] font-semibold">
                        {tier.partTier}
                      </h3>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {PART_ORIGIN_LABELS[tier.partOrigin]}
                      </p>
                    </div>
                    <p className="shrink-0 text-[15px] font-semibold">
                      {formatPrice(tier)}
                    </p>
                  </div>
                  <p className="mt-5 flex-1 text-[12px] leading-6 text-muted-foreground">
                    {tier.customerNote ||
                      "Part type and availability are confirmed before repair."}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4 text-[11px] text-muted-foreground">
                    <span>{tier.estimatedTime}</span>
                    <span>{tier.warranty}</span>
                  </div>
                  {FEATURES.bookingEnabled && (
                    <Link
                      href={buildBookingHref(
                        device,
                        repairType,
                        tier.partTierId
                      )}
                      className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border px-4 text-[12px] font-semibold transition-colors hover:bg-surface"
                    >
                      Choose this option
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {relatedRepairs.length > 0 && (
          <section className="mx-auto mt-20 max-w-5xl border-t border-border px-5 pt-14 sm:px-8">
            <h2 className="text-xl font-semibold tracking-tight">
              Other {device.name} repairs
            </h2>
            <div className="mt-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
              {relatedRepairs.map((candidate) => (
                <Link
                  key={candidate}
                  href={`/repairs/${buildRepairSlug(device, candidate)}`}
                  className="flex min-h-16 items-center justify-between gap-4 bg-card px-5 text-[13px] font-medium transition-colors hover:bg-surface"
                >
                  {candidate}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
