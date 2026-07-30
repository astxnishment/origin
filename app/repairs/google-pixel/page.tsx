import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import {
  getStartingPriceLabel,
  getVisibleModels,
} from "@/lib/serviceCatalogue";

export const metadata: Metadata = {
  title: "Google Pixel Repair Leeds | Screen, Battery & More",
  description:
    "Google Pixel repairs in Leeds for visible catalogue models. Compare screen, battery, port and back-glass estimates with repair-specific warranty terms.",
};

function pixelPrice(repairTypeIds: string[]): string {
  return getStartingPriceLabel({
    brand: "Google Pixel",
    category: "phone",
    repairTypeIds,
  });
}

const repairTypes = [
  { name: "Screen replacement", price: pixelPrice(["screen-replacement"]), time: "Model dependent" },
  { name: "Battery replacement", price: pixelPrice(["battery-replacement"]), time: "Model dependent" },
  { name: "Charging port", price: pixelPrice(["charging-port-replacement", "charging-port-repair"]), time: "Fault dependent" },
  { name: "Back glass", price: pixelPrice(["back-glass", "back-glass-replacement"]), time: "Model dependent" },
  { name: "Water damage", price: pixelPrice(["water-damage-diagnostics", "water-damage-diagnostic", "liquid-damage-repair"]), time: "Assessment required" },
];

const guarantees = [
  "Visible Pixel models listed below",
  "Warranty shown with the selected repair",
  "Repair time estimated before approval",
  "Price agreed before repair",
  "Part type confirmed before repair",
  "Backup recommended before repair",
];

const allModels = getVisibleModels("Google Pixel", "phone");
const totalModels = allModels.length;

// Group by generation
const modelGroups = [
  { label: "Pixel 9 Series", models: allModels.filter((m) => m.startsWith("Pixel 9")) },
  { label: "Pixel 8 Series", models: allModels.filter((m) => m.startsWith("Pixel 8")) },
  { label: "Pixel 7 Series", models: allModels.filter((m) => m.startsWith("Pixel 7")) },
  { label: "Pixel 6 Series", models: allModels.filter((m) => m.startsWith("Pixel 6")) },
  { label: "Older Pixel",    models: allModels.filter((m) => m.startsWith("Pixel 5") || m.startsWith("Pixel 4")) },
];

export default function GooglePixelRepairsPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="pt-10 pb-16 border-b border-border">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              Google Pixel Repairs · Leeds
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5">
                  Google Pixel repair, done right.
                </h1>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-6 max-w-md">
                  {totalModels} visible Pixel models are currently listed.
                  Price, part type, availability and warranty are confirmed for
                  the selected repair.
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
                    <Link href="/book">Request Pixel Repair</Link>
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
                  <Image
                    src="/GooglePixel/Pixel-9-repair-in-Leeds.png"
                    alt="Google Pixel 9"
                    width={220}
                    height={440}
                    className="relative object-contain max-h-80 w-auto drop-shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {modelGroups.filter((g) => g.models.length > 0).map(({ label, models }) => (
                <div key={label}>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    {label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {models.map((model) => (
                      <span
                        key={model}
                        className="px-3 py-1.5 rounded-full bg-surface border border-border text-[12px] text-foreground"
                      >
                        {model}
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
              Ready to get your Pixel fixed?
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
