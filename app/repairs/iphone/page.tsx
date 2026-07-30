import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import {
  getStartingPriceLabel,
  getSpecialistPriceLabel,
  getVisibleModels,
} from "@/lib/serviceCatalogue";
import { serviceImages } from "@/lib/serviceImages";

export const metadata: Metadata = {
  title: "iPhone Repair Leeds | Listed Models",
  description:
    "iPhone repair estimates in Leeds for visible catalogue models, including screens, batteries, charging ports and assessment-led board repairs.",
};

function iphonePrice(repairTypeIds: string[], model?: string): string {
  return getStartingPriceLabel({
    brand: "Apple",
    category: "phone",
    model,
    repairTypeIds,
  });
}

const repairTypes = [
  {
    name: "Screen replacement",
    price: iphonePrice(["screen-replacement"]),
    time: "Model and part dependent",
  },
  {
    name: "Battery replacement",
    price: iphonePrice(["battery-replacement"]),
    time: "Model dependent",
  },
  {
    name: "Charging port",
    price: iphonePrice([
      "charging-port-replacement",
      "charging-port-repair",
    ]),
    time: "Fault dependent",
  },
  {
    name: "Back glass",
    price: iphonePrice([
      "back-glass-replacement",
      "back-glass",
    ]),
    time: "Model dependent",
  },
  {
    name: "Camera lens",
    price: iphonePrice(["camera-lens-replacement", "camera-repair"]),
    time: "Model dependent",
  },
  {
    name: "Water damage",
    price: iphonePrice([
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
    name: "Face ID repair",
    price: getSpecialistPriceLabel("phone", "face-id-biometric-repair"),
    time: "1–3 days",
  },
  {
    name: "Data recovery",
    price: getSpecialistPriceLabel("phone", "data-recovery"),
    time: "2–7 days",
  },
];

const guarantees = [
  "Compatible and original-part options explained",
  "Warranty shown for the selected part",
  "Repair time estimated before approval",
  "Price agreed before repair",
  "Board-level repairs available",
  "Backup recommended before repair",
];

const iphoneModels = getVisibleModels("Apple", "phone").filter((model) =>
  model.startsWith("iPhone")
);

const iphone16ProScreenPrice = iphonePrice(
  ["screen-replacement"],
  "iPhone 16 Pro"
);

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
                  Visible catalogue models through iPhone 17 Pro Max, with
                  screen, battery, port and specialist repair options. Price,
                  part type and warranty vary by selection.
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
                    <Link href="/book">Request iPhone Repair</Link>
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
                    src={serviceImages.iphone.src}
                    alt={serviceImages.iphone.alt}
                    width={serviceImages.iphone.width}
                    height={serviceImages.iphone.height}
                    sizes="(min-width: 1024px) 320px, 70vw"
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
                  badgeColor: "bg-surface text-[color:var(--icon-fg)]",
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
                  badge: "Original",
                  desc: "An original display restored with replacement glass. Availability varies by model.",
                  badgeColor: "bg-violet-500/20 text-violet-300",
                  warn: false,
                },
                {
                  tier: "Genuine service part",
                  badge: "Premium",
                  desc: "Only offered when a genuine service part is listed and available for the selected model.",
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
                      background: isNew ? "var(--soft-bg-strong)" : undefined,
                      borderColor: isNew ? "var(--control-border-hover)" : undefined,
                      color: isNew ? "var(--icon-fg)" : undefined,
                    }}
                  >
                    {model}
                    {isNew && (
                      <span className="ml-1.5 text-[9px] font-bold uppercase text-[color:var(--icon-fg)]">
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
