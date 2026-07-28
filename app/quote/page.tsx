import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FullCalculator from "@/components/FullCalculator";

export const metadata: Metadata = {
  title: "Repair Quote — Leeds & Mail-in",
  description:
    "Get an estimate for phone, tablet, laptop, console, custom PC, liquid damage, motherboard and data recovery work. Visit us in Leeds or post your device.",
};

export default function QuotePage() {
  return (
    <>
      <Navbar />

      <main id="main-content" className="min-h-screen pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid gap-6 border-b border-border py-10 sm:py-12 lg:grid-cols-[1fr_430px] lg:items-end">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
                Repair quote
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Tell us what&apos;s broken.
              </h1>
            </div>
            <p className="max-w-md text-[14px] leading-relaxed text-muted-foreground lg:justify-self-end">
              Phones, tablets, all laptops, consoles, custom PCs, liquid damage,
              data recovery and board-level repairs. Choose a device for an estimate.
            </p>
          </div>

          <div className="py-10">
            <Suspense fallback={null}>
              <FullCalculator />
            </Suspense>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
