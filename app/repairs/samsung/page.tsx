import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { SamsungCategoryIcon } from "@/components/SamsungCategoryIcon";
import {
  getSpecialistPriceLabel,
  getStartingPriceLabel,
  getVisibleModels,
} from "@/lib/serviceCatalogue";

export const metadata: Metadata = {
  title: "Samsung Repair Leeds | Galaxy S, A Series",
  description:
    "Samsung Galaxy repairs in Leeds for visible catalogue models. Compare screen, battery and charging-port options, times and repair-specific warranties.",
};

function samsungPrice(repairTypeIds: string[]): string {
  return getStartingPriceLabel({
    brand: "Samsung",
    category: "phone",
    repairTypeIds,
  });
}

const repairTypes = [
  {
    name: "Screen replacement",
    price: samsungPrice(["screen-replacement"]),
    time: "Model and part dependent",
  },
  {
    name: "Battery replacement",
    price: samsungPrice(["battery-replacement"]),
    time: "Model dependent",
  },
  {
    name: "Charging port",
    price: samsungPrice([
      "charging-port-replacement",
      "charging-port-repair",
    ]),
    time: "Fault dependent",
  },
  {
    name: "Back cover",
    price: samsungPrice(["back-cover-replacement", "back-glass"]),
    time: "Model dependent",
  },
  {
    name: "Water damage",
    price: samsungPrice([
      "water-damage-diagnostic",
      "liquid-damage-diagnostic",
    ]),
    time: "Assessment required",
  },
  {
    name: "Motherboard repair",
    price: getSpecialistPriceLabel("phone", "motherboard-logic-board"),
    time: "1–5 days",
  },
  {
    name: "No power repair",
    price: getSpecialistPriceLabel("phone", "no-power-repair"),
    time: "1–5 days",
  },
];

const guarantees = [
  "Visible Galaxy S and A models listed",
  "Warranty shown with each part option",
  "Repair time estimated before approval",
  "Price agreed before repair",
  "Part type explained before repair",
  "Backup recommended before repair",
];

const samsungModels = (() => {
  const models = getVisibleModels("Samsung", "phone");
  const sSeries: string[] = [];
  const aSeries: string[] = [];
  for (const model of models) {
    if (model.includes("S2") || model.startsWith("Galaxy S")) sSeries.push(model);
    else aSeries.push(model);
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
                  {totalModels} visible Galaxy S and A-series models are
                  currently listed. Part option, availability and warranty are
                  confirmed for the selected repair.
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
                    <Link href="/book">Request Samsung Repair</Link>
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
              Request a preferred time and the team will confirm availability.
            </p>
            <Button
              asChild
              className="btn-primary h-10 rounded-lg px-8 text-[13px]"
            >
              <Link href="/book">Request a Repair</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
