"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import QuoteCalculator from "@/components/QuoteCalculator";
import Link from "next/link";

export default function QuotePage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary">Quote</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Instant pricing.
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Select your device and repair type to see an instant quote. No hidden fees. No diagnostic charges. What you see is what you pay.
            </p>
          </div>

          {/* Quote Calculator */}
          <div className="mb-20">
            <QuoteCalculator />
          </div>

          {/* Next steps */}
          <div className="border-t border-border pt-20 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Ready to book?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Got your quote? Schedule your repair online or give us a call to confirm your appointment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-blue-700">
                <Link href="/book">Book Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2">
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
