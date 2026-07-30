import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingTable from "@/components/PricingTable";
import { Button } from "@/components/ui/button";
import {
  PageContainer,
  PageIntro,
  SectionHeading,
} from "@/components/layout/PageContainer";
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

      <main className="pb-16 pt-16 md:pb-24 md:pt-[72px]">
        <PageContainer>
          <PageIntro
            eyebrow="Pricing"
            title="Repair prices."
            description="Search your model or choose a device category. We confirm the final price before any work starts."
          />

          {/* Price table */}
          <section className="section-compact border-b border-border">
            <SectionHeading
              title="Find your price"
              description="Model repairs, consoles, custom PCs and specialist work."
              action={
                <Link
                  href="/quote"
                  className="hidden items-center gap-1.5 text-[12px] font-semibold text-foreground hover:underline sm:flex"
                >
                  Build a device quote
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              }
            />
            <PricingTable />
          </section>

          {/* FAQ */}
          <section className="section-compact border-b border-border">
            <h2 className="section-title text-[clamp(1.5rem,2.2vw,2rem)]">
              Pricing questions
            </h2>
            <div className="mt-8 divide-y divide-border border-y border-border">
              {faqs.map(({ q, a }) => (
                <div
                  key={q}
                  className="grid gap-2 py-5 md:grid-cols-2 md:gap-10"
                >
                  <p className="text-[14px] font-medium text-foreground">{q}</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="section-standard text-center">
            <h2 className="section-title">Build your repair quote.</h2>
            <p className="mx-auto mb-8 mt-4 max-w-sm text-[15px] text-muted-foreground">
              Use the calculator for a catalogue estimate, or contact the team
              when the model or fault needs assessment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="btn-primary h-12 px-6 text-[13px]"
              >
                <Link href="/quote" className="flex items-center gap-2">
                  Quote calculator <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              {FEATURES.bookingEnabled && (
                <Button
                  asChild
                  variant="outline"
                  className="btn-secondary h-12 px-6 text-[13px]"
                >
                  <Link href="/book">Request a Repair</Link>
                </Button>
              )}
            </div>
          </section>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
}
