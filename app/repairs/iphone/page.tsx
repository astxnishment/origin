import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { REPAIR_PRICING } from "@/lib/repairPricing";
import { getRepairPrice, formatPriceRange } from "@/lib/pricing";
import { serviceImages } from "@/lib/serviceImages";
import { appleImageUrl, IPHONE_IMAGES } from "@/lib/appleDeviceImages";

export const metadata: Metadata = {
  title: "iPhone Repair Leeds | All Models",
  description:
    "Expert iPhone repairs in Leeds. Screen replacement, battery, charging port and more. All models from iPhone SE to iPhone 17 Pro Max. Same-day service, 12-month warranty.",
};

// Live prices from v3 workbook — cheapest available tier
function livePrice(model: string, repairType: string): string {
  const row = getRepairPrice("Apple", model, repairType);
  if (!row) return "POA";
  return formatPriceRange(row.minPrice, row.maxPrice);
}

// Use iPhone 16 as representative "current" model for repair type pricing
const repairTypes = [
  {
    name: "Screen replacement",
    price: `from £${
      REPAIR_PRICING.filter((r) => r.brand === "Apple" && r.repairType === "Screen Replacement" && r.minPrice !== null)
        .reduce((min, r) => Math.min(min, r.minPrice!), Infinity)
    }`,
    time: "45–90 min",
  },
  {
    name: "Battery replacement",
    price: `from £${
      REPAIR_PRICING.filter((r) => r.brand === "Apple" && r.repairType === "Battery Replacement" && r.minPrice !== null)
        .reduce((min, r) => Math.min(min, r.minPrice!), Infinity)
    }`,
    time: "30–60 min",
  },
  {
    name: "Charging port",
    price: `from £${
      REPAIR_PRICING.filter((r) => r.brand === "Apple" && r.repairType === "Charging Port Replacement" && r.minPrice !== null)
        .reduce((min, r) => Math.min(min, r.minPrice!), Infinity)
    }`,
    time: "60 min",
  },
  {
    name: "Back glass",
    price: `from £${
      REPAIR_PRICING.filter((r) => r.brand === "Apple" && r.repairType === "Back Glass Replacement" && r.minPrice !== null)
        .reduce((min, r) => Math.min(min, r.minPrice!), Infinity)
    }`,
    time: "45–90 min",
  },
  {
    name: "Camera lens",
    price: `from £${
      REPAIR_PRICING.filter((r) => r.brand === "Apple" && r.repairType === "Camera Lens Replacement" && r.minPrice !== null)
        .reduce((min, r) => Math.min(min, r.minPrice!), Infinity)
    }`,
    time: "60 min",
  },
  {
    name: "Water damage",
    price: livePrice("iPhone 16", "Water Damage Diagnostic"),
    time: "24–48 hrs",
  },
  {
    name: "Data recovery",
    price: livePrice("Phone Data Recovery", "Data Recovery Assessment"),
    time: "24–48 hrs",
  },
];

const guarantees = [
  "OEM-grade replacement screens",
  "12-month warranty included",
  "Same-day in most cases",
  "Fixed price — no surprises",
  "Free diagnostic assessment",
  "Data always protected",
];

// Pull iPhone models from v3 REPAIR_PRICING (in order they appear)
const iphoneModels = (() => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const row of REPAIR_PRICING) {
    if (row.brand === "Apple" && row.model.startsWith("iPhone") && !seen.has(row.model)) {
      seen.add(row.model);
      result.push(row.model);
    }
  }
  return result;
})();

// iPhone 16 Pro screen price breakdown for the tier preview
const iphone16ProScreenPrice = livePrice("iPhone 16 Pro", "Screen Replacement");

export default function IPhoneRepairsPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="pt-10 pb-16 border-b border-border">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              iPhone Repairs · Leeds
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5">
                  iPhone repair, done right.
                </h1>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-6 max-w-md">
                  Every model from iPhone 8 to iPhone 17 Pro Max. Screen replacements from £39.
                  12-month warranty on every repair.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                  {guarantees.map((g) => (
                    <li key={g} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-accent shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 text-[13px]"
                  >
                    <Link href="/book">Book iPhone Repair</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl h-10 px-6 text-[13px] border-border hover:bg-muted"
                  >
                    <Link href="/quote" className="flex items-center gap-2">
                      Get a quote <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
              {/* Hero device image */}
              <div className="flex items-center justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 -m-8 rounded-full bg-blue-500/8 blur-3xl pointer-events-none" />
                  {/* Real iPhone 16 Pro image from appledb.dev */}
                  <Image
                    src={appleImageUrl(IPHONE_IMAGES["iPhone 16 Pro"], 256, false)}
                    alt="iPhone 16 Pro — Origin Repairs"
                    width={256}
                    height={256}
                    unoptimized
                    className="relative object-contain max-h-80 w-auto drop-shadow-[0_16px_48px_rgba(59,130,246,0.2)]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Repair types */}
          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-2">Repair types &amp; pricing</h2>
            <p className="text-[13px] text-muted-foreground mb-8">
              Starting prices shown. Use the{" "}
              <Link href="/quote" className="text-primary hover:underline">
                quote calculator
              </Link>{" "}
              for your specific model and part quality preference.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden">
              {repairTypes.map(({ name, price, time }) => (
                <div key={name} className="bg-card p-5 hover:bg-surface transition-colors">
                  <p className="text-[13px] font-medium text-foreground mb-1">{name}</p>
                  <p className="text-[13px] font-semibold text-primary">{price}</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{time}</p>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-4">
              Prices are estimates and may vary after inspection depending on part quality, device condition and part availability.
            </p>
          </div>

          {/* Screen quality tiers callout */}
          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-2">Screen quality options</h2>
            <p className="text-[13px] text-muted-foreground mb-6 max-w-2xl">
              We offer multiple screen quality tiers so you can choose what suits your budget and
              expectations. For example, iPhone 16 Pro screen replacement:{" "}
              <strong className="text-foreground">{iphone16ProScreenPrice}</strong>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                {
                  tier: "Aftermarket LCD",
                  badge: "Budget",
                  desc: "Lowest cost. Works well but lower brightness and colour than OLED.",
                  badgeColor: "bg-zinc-500/20 text-zinc-300",
                  warn: true,
                },
                {
                  tier: "Hard OLED",
                  badge: "Balanced",
                  desc: "Good colour, brightness, and touch response at a mid-range price.",
                  badgeColor: "bg-blue-500/20 text-blue-300",
                  warn: false,
                },
                {
                  tier: "Soft OLED",
                  badge: "Best value",
                  desc: "Flexible OLED. Closer to original feel and colour accuracy.",
                  badgeColor: "bg-emerald-500/20 text-emerald-300",
                  warn: false,
                },
                {
                  tier: "Refurbished Original",
                  badge: "Near-OEM",
                  desc: "Genuine pulled screen from a working device. Best non-genuine option.",
                  badgeColor: "bg-violet-500/20 text-violet-300",
                  warn: false,
                },
                {
                  tier: "Genuine Apple / IRP",
                  badge: "Premium",
                  desc: "Authentic Apple part via Independent Repair Programme. Highest quality.",
                  badgeColor: "bg-amber-500/20 text-amber-300",
                  warn: false,
                },
              ].map(({ tier, badge, desc, badgeColor, warn }) => (
                <div
                  key={tier}
                  className="rounded-xl p-4 border border-border bg-card hover:bg-surface transition-colors"
                >
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase leading-none ${badgeColor}`}>
                    {badge}
                  </span>
                  <p className="text-[13px] font-medium text-foreground mt-2 mb-1">{tier}</p>
                  <p className="text-[12px] text-muted-foreground leading-snug">{desc}</p>
                  {warn && (
                    <p className="text-[11px] text-amber-400 mt-2 leading-snug">
                      ⚠ LCD has lower colour, brightness and resale value than OLED.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Supported models */}
          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-2">Supported iPhone models</h2>
            <p className="text-[13px] text-muted-foreground mb-8">
              {iphoneModels.length} models covered
            </p>
            <div className="flex flex-wrap gap-2">
              {iphoneModels.map((model) => {
                const isNew = model.includes("17") || model === "iPhone Air";
                return (
                  <span
                    key={model}
                    className="px-3 py-1.5 rounded-full border text-[12px]"
                    style={{
                      background: isNew ? "rgba(59,130,246,0.08)" : undefined,
                      borderColor: isNew ? "rgba(59,130,246,0.3)" : undefined,
                      color: isNew ? "#93c5fd" : undefined,
                    }}
                  >
                    {model}
                    {isNew && (
                      <span className="ml-1.5 text-[9px] font-bold uppercase text-blue-400">
                        New
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
            <p className="text-[12px] text-muted-foreground mt-4">
              iPhone 17 series prices shown as &ldquo;Inspection required&rdquo; until parts availability is confirmed.
            </p>
          </div>

          {/* CTA */}
          <div className="pt-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
              Ready to get your iPhone fixed?
            </h2>
            <p className="text-[15px] text-muted-foreground mb-8 max-w-sm mx-auto">
              Book online or walk in. Most repairs done the same day.
            </p>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-8 text-[13px]"
            >
              <Link href="/book">Book a Repair</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
