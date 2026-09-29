import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { serviceImages } from "@/lib/serviceImages";
import { SAMSUNG_DEVICES, type DeviceModel } from "@/lib/calculatorData";
import {
  getSpecialistPriceLabel,
  getStartingPriceLabel,
} from "@/lib/serviceCatalogue";

export const metadata: Metadata = pageMetadata("/repairs/samsung", {
  title: "Samsung Repair Leeds | Galaxy S, A & Z Series",
  description:
    "Samsung Galaxy repair enquiries in Leeds, including S26, A57 and Z Fold8 models. Parts, repair options, price and warranty are confirmed before work starts.",
});

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
  "Screen, battery and charging repairs",
  "Price and parts agreed before work begins",
  "Repair-specific warranty explained",
];

const samsungModels = (() => {
  const models = SAMSUNG_DEVICES
    .filter((model) => model.category === "phone")
    .sort((a, b) => b.name.localeCompare(a.name, "en-GB", { numeric: true }));
  const sSeries: DeviceModel[] = [];
  const aSeries: DeviceModel[] = [];
  const zSeries: DeviceModel[] = [];
  for (const model of models) {
    if (model.name.startsWith("Galaxy S")) sSeries.push(model);
    else if (model.name.startsWith("Galaxy A")) aSeries.push(model);
    else if (model.name.startsWith("Galaxy Z")) zSeries.push(model);
  }
  return [
    { label: "Galaxy S Series", id: "galaxy-s", models: sSeries },
    { label: "Galaxy A Series", id: "galaxy-a", models: aSeries },
    { label: "Galaxy Z Series", id: "galaxy-z", models: zSeries },
  ];
})();

const totalModels = samsungModels.reduce((acc, g) => acc + g.models.length, 0);

export default function SamsungRepairsPage() {
  return (
    <>
      <Navbar />

      <main id="main-content" tabIndex={-1} className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <section className="pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-border">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-center">
              <div>
                <p className="eyebrow mb-4">Samsung repairs · Leeds</p>
                <h1 className="text-[clamp(2.5rem,4.5vw,4rem)] font-semibold leading-[1.05] tracking-tight mb-6">
                  Samsung repair.<br />Made clear.
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-md">
                  A cracked screen, a tired battery or a phone that won’t charge.
                  Tell us what’s wrong with your Galaxy and we’ll explain your
                  options, with a clear quote before any repair.
                </p>
                <ul className="space-y-3 mb-8">
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
                    className="btn-primary h-11 rounded-lg px-5 text-[13px]"
                  >
                    <Link href="/book?brand=samsung">Request Samsung Repair</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-lg h-11 px-5 text-[13px] border-border hover:bg-muted">
                    <Link href="/quote?brand=samsung" className="flex items-center gap-2">
                      Get a quote <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <figure className="relative isolate w-full max-w-[500px] justify-self-center overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-8">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,rgba(139,120,193,0.18),transparent_70%)]" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Galaxy S · A · Z</p>
                <div className="flex aspect-square items-center justify-center py-5">
                  <Image
                    src={serviceImages.samsung.src}
                    alt={serviceImages.samsung.alt}
                    width={serviceImages.samsung.width}
                    height={serviceImages.samsung.height}
                    sizes="(min-width: 1024px) 440px, (min-width: 640px) 500px, 85vw"
                    loading="eager"
                    className="h-full w-full object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.18)]"
                  />
                </div>
                <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                  <span>Galaxy S26 Ultra</span><a href="#samsung-models" className="font-medium text-foreground underline underline-offset-4">Find your model</a>
                </figcaption>
              </figure>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
              <p className="mr-2 text-xs text-muted-foreground">{totalModels} models listed</p>
              {samsungModels.map(({ label, id }) => <a key={id} href={`#${id}`} className="flex min-h-10 items-center gap-3 rounded-full border border-border bg-card px-4 text-xs font-medium transition-colors hover:bg-surface">{label}<ArrowRight className="h-3 w-3" /></a>)}
            </div>
          </section>

          {/* Repair types */}
          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-2">Repair types &amp; pricing</h2>
            <p className="text-[13px] text-muted-foreground mb-8">
              Starting prices shown. Use the{" "}
              <Link href="/quote" className="text-primary underline underline-offset-4">
                quote calculator
              </Link>{" "}
              for your specific model.
            </p>
            <div className="flex flex-wrap gap-px bg-border rounded-xl overflow-hidden">
              {repairTypes.map(({ name, price, time }) => (
                <div key={name} className="grow basis-full sm:basis-[calc(50%-1px)] lg:basis-[calc(25%-1px)] bg-card p-5 hover:bg-surface transition-colors">
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
          <div id="samsung-models" className="scroll-mt-24 py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-2">Find your Samsung model</h2>
            <p className="text-[13px] text-muted-foreground mb-10">
              Choose your model to start a repair request. If a price is not published, we’ll check your options and confirm a quote.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {samsungModels.map(({ label, id, models }) => (
                <div key={label} id={id} className="scroll-mt-24">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    {label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {models.map((m) => (
                      <Link
                        key={m.id}
                        href={`/book?brand=samsung&model=${encodeURIComponent(m.id)}`}
                        className="inline-flex min-h-10 items-center px-3 py-1.5 rounded-full bg-surface border border-border text-[12px] text-foreground transition-colors hover:bg-muted"
                      >
                        {m.name}
                      </Link>
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
              <Link href="/book?brand=samsung">Request a Repair</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
