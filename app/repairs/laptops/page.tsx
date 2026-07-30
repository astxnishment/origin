import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { serviceImages } from "@/lib/serviceImages";
import {
  getSpecialistPriceLabel,
  getStartingPriceLabel,
  getVisibleModels,
} from "@/lib/serviceCatalogue";

export const metadata: Metadata = {
  title: "Laptop Repair Leeds | MacBook, Windows, Gaming Laptops",
  description: "All kinds of laptop repair in Leeds: MacBook, Dell, HP, Lenovo, ASUS, Acer, Surface and gaming laptops. Screens, batteries, keyboards, liquid damage and board repair.",
};

const repairTypes = [
  { name: "Screen replacement", price: getStartingPriceLabel({ category: "laptop", repairTypeIds: ["screen-replacement"] }), time: "Model and part dependent" },
  { name: "Battery replacement", price: getStartingPriceLabel({ category: "laptop", repairTypeIds: ["battery-replacement"] }), time: "Model dependent" },
  { name: "Keyboard / trackpad", price: getSpecialistPriceLabel("laptop", "keyboard-trackpad-repair"), time: "1–3 days estimate" },
  { name: "Liquid damage", price: getSpecialistPriceLabel("laptop", "liquid-damage-repair"), time: "2–7 days estimate" },
  { name: "Logic board repair", price: getSpecialistPriceLabel("laptop", "motherboard-logic-board"), time: "2–7 days estimate" },
  { name: "No power repair", price: getSpecialistPriceLabel("laptop", "no-power-repair"), time: "2–7 days estimate" },
  { name: "SSD / RAM upgrade", price: getSpecialistPriceLabel("laptop", "ssd-ram-upgrade"), time: "Parts dependent" },
  { name: "Overheating / fan service", price: getSpecialistPriceLabel("laptop", "overheating-fan-service"), time: "Fault dependent" },
];

const brands = [
  "MacBook Air", "MacBook Pro", "Dell XPS", "Dell Inspiron", "HP Spectre",
  "HP Pavilion", "Lenovo ThinkPad", "Lenovo IdeaPad", "Surface Laptop", "Surface Pro",
  "ASUS ZenBook", "ASUS ROG", "Acer Swift", "Acer Nitro", "MSI Gaming", "Razer Blade",
];

const guarantees = [
  "MacBook & PC laptops covered",
  "Backup recommended before repair",
  "Repair-specific warranty shown",
  "Board-level repairs available",
  "Price agreed before repair",
  "Parts and scope explained first",
];

const macbookModels = getVisibleModels("Apple", "laptop");

export default function LaptopRepairsPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="pt-10 pb-16 border-b border-border">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              Laptop Repairs · Leeds
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5">
                  All kinds of laptop repair.
                </h1>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-6 max-w-md">
                  MacBook, Windows, gaming, business and 2-in-1 laptops.
                  Back up important data where possible; complex faults are
                  assessed and quoted before repair work starts.
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
                  <Button asChild className="btn-primary h-10 rounded-lg px-6 text-[13px]">
                    <Link href="/book">Request Laptop Repair</Link>
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
                <div className="relative w-full max-w-sm">
                  <Image
                    src={serviceImages.macbook.src}
                    alt={serviceImages.macbook.alt}
                    width={serviceImages.macbook.width}
                    height={serviceImages.macbook.height}
                    sizes="(min-width: 1024px) 384px, 85vw"
                    className="relative object-contain w-full drop-shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Data safety notice */}
          <div className="py-8 border-b border-border">
            <div className="rounded-xl bg-card border border-border p-6 flex gap-4">
              <div className="w-1 rounded-full bg-accent shrink-0" />
              <div>
                <p className="text-[13px] font-semibold text-foreground mb-1">Back up before repair</p>
                <p className="text-[13px] text-muted-foreground">
                  Routine hardware work does not normally require access to
                  personal files. Back up important data where possible, and
                  provide explicit consent before any data-access or recovery
                  work.
                </p>
              </div>
            </div>
          </div>

          {/* Repair types */}
          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-8">Repair types &amp; pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden">
              {repairTypes.map(({ name, price, time }) => (
                <div key={name} className="bg-card p-5 hover:bg-surface transition-colors">
                  <p className="text-[13px] font-medium text-foreground mb-1">{name}</p>
                  <p className="text-[13px] font-semibold text-primary">{price}</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* MacBook models */}
          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-2">MacBook models</h2>
            <p className="text-[13px] text-muted-foreground mb-8">{macbookModels.length} models supported</p>
            <div className="flex flex-wrap gap-2 mb-10">
              {macbookModels.map((model) => (
                <span key={model} className="px-3 py-1.5 rounded-full bg-surface border border-border text-[12px] text-foreground">
                  {model}
                </span>
              ))}
            </div>
            <h3 className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">Laptop brands and ranges</h3>
            <div className="flex flex-wrap gap-2">
              {brands.filter(b => !b.startsWith("MacBook")).map((brand) => (
                <span key={brand} className="px-3 py-1.5 rounded-full bg-surface border border-border text-[12px] text-foreground">
                  {brand}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">Ready to get your laptop fixed?</h2>
            <p className="text-[15px] text-muted-foreground mb-8 max-w-sm mx-auto">
              Request a preferred time so the team can confirm the appropriate
              assessment and any parts required.
            </p>
            <Button asChild className="btn-primary h-10 rounded-lg px-8 text-[13px]">
              <Link href="/book">Request a Repair</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
