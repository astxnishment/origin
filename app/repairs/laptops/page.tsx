import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { APPLE_MACBOOKS } from "@/lib/repair-data";

export const metadata: Metadata = {
  title: "MacBook & Laptop Repair Leeds | ORIGIN Repairs",
  description: "MacBook, Dell, HP, Lenovo and iPad repairs in Leeds. Screen replacement, battery, keyboard, liquid damage and more. Same-day on many repairs. 12-month warranty.",
};

const repairTypes = [
  { name: "Screen replacement", price: "from £149", time: "2–3 hrs" },
  { name: "Battery replacement", price: "from £99", time: "90 min" },
  { name: "Keyboard replacement", price: "from £129", time: "2 hrs" },
  { name: "Liquid damage", price: "from £95", time: "24–48 hrs" },
  { name: "SSD upgrade", price: "from £79", time: "60 min" },
  { name: "RAM upgrade", price: "from £69", time: "60 min" },
  { name: "Fan cleaning", price: "from £49", time: "60 min" },
  { name: "Software repair", price: "from £49", time: "60 min" },
];

const brands = [
  "MacBook Air", "MacBook Pro", "Dell XPS", "HP Spectre",
  "Lenovo ThinkPad", "Surface Pro", "ASUS ZenBook", "Acer Swift",
];

const guarantees = [
  "MacBook & PC laptops covered",
  "Data always protected",
  "12-month warranty included",
  "Free diagnostic assessment",
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
              Laptop &amp; MacBook Repairs · Leeds
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
              <div>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5">
                  Laptop repair you can trust.
                </h1>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-md">
                  MacBook, Dell, HP, Lenovo — we repair them all. Your data is always protected. Every repair comes with a 12-month warranty.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 text-[13px]">
                    <Link href="/book">Book Laptop Repair</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-xl h-10 px-6 text-[13px] border-border hover:bg-muted">
                    <Link href="/quote" className="flex items-center gap-2">
                      Get a quote <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {guarantees.map((g) => (
                  <li key={g} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-accent shrink-0" />
                    {g}
                  </li>
                ))}
              </ul>
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
            <h3 className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">Also supported</h3>
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
            <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-8 text-[13px]">
              <Link href="/book">Book a Repair</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
