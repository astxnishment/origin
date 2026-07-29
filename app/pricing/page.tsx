import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingTable from "@/components/PricingTable";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Cpu, Droplets, HardDrive, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Repair Pricing Leeds | Transparent Fixed Quotes",
  description:
    "Clear repair pricing for screens, batteries, charging ports, liquid damage, data recovery and board-level repairs in Leeds. Fixed quote before work starts.",
};

const included = [
  "Fixed price quote before we start",
  "Free basic assessment",
  "Board-level repairs available",
  "OEM-grade and compatible part options",
  "12-month warranty on eligible repairs",
  "Microscope diagnostics for complex faults",
  "Data always protected",
];

const advancedRepairs = [
  {
    icon: Cpu,
    title: "Motherboard, logic board and PCs",
    price: "from £79",
    detail: "No power, short circuits, charging IC, custom PC builds, upgrades and board-level faults.",
  },
  {
    icon: Zap,
    title: "Ports, consoles and no-power faults",
    price: "from £59",
    detail: "USB-C, charging, HDMI, console ports and power faults diagnosed before parts are ordered.",
  },
  {
    icon: Droplets,
    title: "Liquid damage",
    price: "diagnostic from £29",
    detail: "Assessment first, then a fixed quote for cleaning, parts or board work.",
  },
  {
    icon: HardDrive,
    title: "Data recovery",
    price: "from £79",
    detail: "Phones, SSDs, hard drives and liquid-damaged devices. No recovery cases quoted first.",
  },
];

const faqs = [
  {
    q: "Are prices fixed or estimates?",
    a: "We give a fixed quote before any work begins. The price you're quoted is the price you pay.",
  },
  {
    q: "Is the assessment free?",
    a: "Basic checks are free. Liquid damage, data recovery and board-level faults may need a paid deep diagnostic, which is confirmed before we start.",
  },
  {
    q: "What if I don't proceed with the repair?",
    a: "No charge. You're never obligated to go ahead after a quote.",
  },
  {
    q: "Do you do motherboard repairs?",
    a: "Yes. We handle board-level faults such as no power, charging IC issues, liquid damage, short circuits and selected Face ID or biometric faults.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="pt-10 pb-16 border-b border-border">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              Pricing
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
              <div>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5">
                  Transparent pricing.
                  <br />
                  No surprises.
                </h1>
                <p className="text-[15px] text-muted-foreground leading-relaxed max-w-md">
                  Every repair gets a clear quote before work starts. Common repairs can be priced
                  quickly; complex board-level work is diagnosed first.
                </p>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {included.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="py-16 border-b border-border">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Advanced repairs</h2>
                <p className="text-[13px] text-muted-foreground max-w-2xl">
                  Board-level faults need proper inspection, but they should still be easy to understand. These are the advanced repairs we can assess and quote in-store.
                </p>
              </div>
              <Button asChild className="btn-secondary h-10 w-fit px-5 text-[13px]">
                <Link href="/contact">Discuss complex repair</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {advancedRepairs.map(({ icon: Icon, title, price, detail }) => (
                <div key={title} className="bg-card p-5">
                  <Icon className="mb-6 h-5 w-5 text-[color:var(--icon-fg)]" />
                  <p className="text-[14px] font-semibold text-foreground">{title}</p>
                  <p className="mt-2 text-[18px] font-bold text-foreground">{price}</p>
                  <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Price table */}
          <div className="py-16 border-b border-border">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Complete repair price table</h2>
                <p className="max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
                  Every published model, repair and part-quality option, plus our console,
                  custom PC, board-level and recovery services. Prices are estimates until
                  the device and fault are assessed.
                </p>
              </div>
              <Link href="/quote" className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground hover:underline">
                Build a device quote
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <PricingTable />
          </div>

          {/* FAQ */}
          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-8">Pricing FAQ</h2>
            <div className="space-y-6">
              {faqs.map(({ q, a }) => (
                <div key={q} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p className="text-[14px] font-medium text-foreground">{q}</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">Get your exact quote now</h2>
            <p className="text-[15px] text-muted-foreground mb-8 max-w-sm mx-auto">
              Use our calculator for an instant estimate, or walk in for a free assessment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="btn-primary h-10 rounded-lg px-6 text-[13px]"
              >
                <Link href="/quote" className="flex items-center gap-2">
                  Quote calculator <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-xl h-10 px-6 text-[13px] border-border hover:bg-muted"
              >
                <Link href="/book">Book a Repair</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
