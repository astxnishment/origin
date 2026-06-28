import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { APPLE_MACBOOKS } from "@/lib/repair-data";
import { appleImageUrl, MACBOOK_IMAGES } from "@/lib/appleDeviceImages";

export const metadata: Metadata = {
  title: "Laptop Repair Leeds | MacBook, Windows, Gaming Laptops",
  description: "All kinds of laptop repair in Leeds: MacBook, Dell, HP, Lenovo, ASUS, Acer, Surface and gaming laptops. Screens, batteries, keyboards, liquid damage and board repair.",
};

const repairTypes = [
  { name: "Screen replacement", price: "from £199", time: "1–3 days" },
  { name: "Battery replacement", price: "from £99", time: "90 min" },
  { name: "Keyboard replacement", price: "from £129", time: "2 hrs" },
  { name: "Liquid damage", price: "from £129", time: "2–7 days" },
  { name: "Logic board repair", price: "from £129", time: "2–7 days" },
  { name: "No power repair", price: "from £129", time: "2–7 days" },
  { name: "SSD upgrade", price: "from £79", time: "60 min" },
  { name: "Fan cleaning", price: "from £49", time: "60 min" },
];

const brands = [
  "MacBook Air", "MacBook Pro", "Dell XPS", "Dell Inspiron", "HP Spectre",
  "HP Pavilion", "Lenovo ThinkPad", "Lenovo IdeaPad", "Surface Laptop", "Surface Pro",
  "ASUS ZenBook", "ASUS ROG", "Acer Swift", "Acer Nitro", "MSI Gaming", "Razer Blade",
];

const guarantees = [
  "MacBook & PC laptops covered",
  "Data always protected",
  "12-month warranty included",
  "Board-level repairs available",
  "Transparent fixed pricing",
  "Certified engineers only",
];

const macbookModels = Array.from(new Set(APPLE_MACBOOKS.map((d) => d.model)));

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
                  MacBook, Windows laptops, gaming laptops, business laptops and 2-in-1 devices. Your data is always protected, and complex faults are quoted before work starts.
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
                    <Link href="/book">Book Laptop Repair</Link>
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
                  {/* Real MacBook Air M3 image from appledb.dev */}
                  <Image
                    src={appleImageUrl(MACBOOK_IMAGES['MacBook Air 13" M3'], 256, false)}
                    alt="MacBook Air M3 — Origin Repairs"
                    width={256}
                    height={256}
                    unoptimized
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
                <p className="text-[13px] font-semibold text-foreground mb-1">Your data is safe with us</p>
                <p className="text-[13px] text-muted-foreground">
                  We never access your personal files without consent. Before any repair, we&apos;ll advise on backup options. Data protection is part of every job.
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
              Book online or walk in. Complex repairs booked in advance preferred.
            </p>
            <Button asChild className="btn-primary h-10 rounded-lg px-8 text-[13px]">
              <Link href="/book">Book a Repair</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
