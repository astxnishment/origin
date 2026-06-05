import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteCalculator from "@/components/QuoteCalculator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function QuotePage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="pt-10 pb-16 border-b border-border">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              Quote
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                Instant pricing.
              </h1>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Select your device and repair type for an instant estimate. Fixed quote confirmed before we start any work.
              </p>
            </div>
          </div>

          {/* Calculator */}
          <div className="py-16 border-b border-border">
            <QuoteCalculator />
          </div>

          {/* Next step */}
          <div className="pt-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">Ready to book?</h2>
            <p className="text-[15px] text-muted-foreground mb-8 max-w-sm mx-auto">
              Schedule your repair online, or walk in — we&apos;ll give you a free assessment on the spot.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 text-[13px]">
                <Link href="/book">Book a Repair</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl h-10 px-6 text-[13px] border-border hover:bg-muted">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
