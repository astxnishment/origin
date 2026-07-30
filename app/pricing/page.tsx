import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingTable from "@/components/PricingTable";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FEATURES } from "@/lib/constants";
import { WARRANTY_NOTICE } from "@/lib/warranty";

export const metadata: Metadata = {
  title: "Repair Pricing Leeds | Transparent Fixed Quotes",
  description:
    "Clear repair pricing for screens, batteries, charging ports, liquid damage, data recovery and board-level repairs in Leeds. Fixed quote before work starts.",
};

const faqs = [
  {
    q: "Are prices fixed or estimates?",
    a: "Online prices are estimates. The final repair scope and price are confirmed for approval before repair work begins.",
  },
  {
    q: "Is the assessment free?",
    a: "Basic checks are free. Liquid damage, data recovery and board-level faults may need a paid deep diagnostic, which is confirmed before we start.",
  },
  {
    q: "What if I don't proceed with the repair?",
    a: "You are not required to approve a repair quote. Any diagnostic or assessment charge is explained before that work begins.",
  },
  {
    q: "Do you do motherboard repairs?",
    a: "Yes. We handle board-level faults such as no power, charging IC issues, liquid damage, short circuits and selected Face ID or biometric faults.",
  },
  {
    q: "What warranty applies?",
    a: WARRANTY_NOTICE,
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="pt-10 pb-10 border-b border-border">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              Pricing
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
              Repair prices.
            </h1>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-lg">
              Search your model or choose a device category. We confirm the final
              price before any work starts.
            </p>
          </div>

          {/* Price table */}
          <div className="py-10 border-b border-border">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Find your price</h2>
                <p className="max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
                  Model repairs, consoles, custom PCs and specialist work.
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
              Use the calculator for a catalogue estimate, or contact the team
              when the model or fault needs assessment.
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
              {FEATURES.bookingEnabled && (
                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl h-10 px-6 text-[13px] border-border hover:bg-muted"
                >
                  <Link href="/book">Request a Repair</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
