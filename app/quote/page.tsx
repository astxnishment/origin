import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FullCalculator from "@/components/FullCalculator";

export const metadata: Metadata = {
  title: "Instant Repair Quote — Leeds",
  description:
    "Get an instant repair quote for your iPhone, Samsung, MacBook or any device. Transparent pricing, no hidden fees. Leeds based.",
};

export default function QuotePage() {
  return (
    <>
      <Navbar />

      <main className="relative min-h-screen pt-28 pb-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="absolute top-32 left-1/4 w-96 h-96 bg-blue-500/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-32 right-1/4 w-96 h-96 bg-blue-500/4 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="badge-premium mx-auto mb-5 w-fit">
              Instant Quote
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-5">
              What does your repair cost?
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Search your device, select the repair, get an instant estimate.
              Fixed price confirmed before we start.
            </p>
          </div>

          {/* Full calculator */}
          <FullCalculator />
        </div>
      </main>

      <Footer />
    </>
  );
}
