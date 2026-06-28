import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { REPAIR_PRICING } from "@/lib/repairPricing";
import { SamsungCategoryIcon } from "@/components/SamsungCategoryIcon";

export const metadata: Metadata = {
  title: "Samsung Repair Leeds | Galaxy S, A Series",
  description:
    "Professional Samsung repairs in Leeds. Galaxy S and A-series. Screen, battery, charging port and more. Same-day service, 12-month warranty on eligible repairs.",
};

function cheapestSamsungPrice(repairType: string): number {
  const prices = REPAIR_PRICING.filter(
    (r) => r.brand === "Samsung" && r.repairType === repairType && r.minPrice !== null
  ).map((r) => r.minPrice!);
  return prices.length > 0 ? Math.min(...prices) : 0;
}

const repairTypes = [
  {
    name: "Screen replacement",
    price: `from £${cheapestSamsungPrice("Screen Replacement")}`,
    time: "60 min",
  },
  {
    name: "Battery replacement",
    price: `from £${cheapestSamsungPrice("Battery Replacement")}`,
    time: "45–60 min",
  },
  {
    name: "Charging port",
    price: `from £${cheapestSamsungPrice("Charging Port Replacement")}`,
    time: "60 min",
  },
  {
    name: "Back cover",
    price: `from £${cheapestSamsungPrice("Back Cover Replacement")}`,
    time: "45–90 min",
  },
  {
    name: "Water damage",
    price: "diagnostic from £29",
    time: "Same day",
  },
  {
    name: "Motherboard repair",
    price: "from £79",
    time: "1–5 days",
  },
  {
    name: "No power repair",
    price: "from £79",
    time: "1–5 days",
  },
];

const guarantees = [
  "Galaxy S and A series covered",
  "12-month warranty on eligible repairs",
  "Same-day on most models",
  "Fixed price quotes",
  "Free diagnostic assessment",
  "Data protection guaranteed",
];

// Samsung models from v3 REPAIR_PRICING — grouped by series
const samsungModels = (() => {
  const seen = new Set<string>();
  const sSeries: string[] = [];
  const aSeries: string[] = [];
  for (const row of REPAIR_PRICING) {
    if (row.brand !== "Samsung" || seen.has(row.model)) continue;
    seen.add(row.model);
    if (row.model.includes("S2") || row.model.startsWith("Galaxy S")) sSeries.push(row.model);
    else aSeries.push(row.model);
  }
  return [
    { label: "Galaxy S Series", models: sSeries },
    { label: "Galaxy A Series", models: aSeries },
  ];
})();

const totalModels = samsungModels.reduce((acc, g) => acc + g.models.length, 0);

export default function SamsungRepairsPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="pt-10 pb-16 border-b border-border">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              Samsung Repairs · Leeds
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5">
                  Samsung repair, done right.
                </h1>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-6 max-w-md">
                  Full coverage for Galaxy S and A-series. {totalModels} models supported.
                  12-month warranty on eligible repairs.
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
                    className="btn-primary h-10 rounded-lg px-6 text-[13px]"
                  >
                    <Link href="/book">Book Samsung Repair</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-lg h-10 px-6 text-[13px] border-border hover:bg-muted">
                    <Link href="/quote" className="flex items-center gap-2">
                      Get a quote <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
              {/* Hero device image */}
              <div className="flex items-center justify-center lg:justify-end">
                <div className="relative">
                  <SamsungCategoryIcon
                    variant="galaxy-s"
                    size={180}
                    className="relative drop-shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
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
              for your specific model.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-border rounded-xl overflow-hidden">
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

          {/* Supported models */}
          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-2">Supported models</h2>
            <p className="text-[13px] text-muted-foreground mb-10">
              {totalModels} models covered
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {samsungModels.map(({ label, models }) => (
                <div key={label}>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    {label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {models.map((m) => (
                      <span
                        key={m}
                        className="px-3 py-1.5 rounded-full bg-surface border border-border text-[12px] text-foreground"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
              Ready to get your Samsung fixed?
            </h2>
            <p className="text-[15px] text-muted-foreground mb-8 max-w-sm mx-auto">
              Book online or walk in. Most repairs done the same day.
            </p>
            <Button
              asChild
              className="btn-primary h-10 rounded-lg px-8 text-[13px]"
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
