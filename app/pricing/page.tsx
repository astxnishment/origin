import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export default function PricingPage() {
  const repairs = [
    { service: "iPhone screen replacement", price: "£49–£149" },
    { service: "Samsung screen replacement", price: "£69–£139" },
    { service: "iPhone battery", price: "£39–£59" },
    { service: "Samsung battery", price: "£45–£65" },
    { service: "iPad screen", price: "£79–£179" },
    { service: "MacBook screen", price: "£149–£299" },
    { service: "MacBook battery", price: "£99–£149" },
    { service: "Water damage assessment", price: "£49–£149" },
    { service: "Data recovery", price: "£149–£599" },
    { service: "Charging port repair", price: "£59–£99" },
    { service: "Camera replacement", price: "£49–£129" },
    { service: "Keyboard replacement", price: "£99–£199" },
  ];

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-20 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary">Pricing</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Transparent pricing.
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              No hidden fees. No diagnostics charges. You get a fixed quote
              before we start work. All repairs include a 12-month warranty.
            </p>
          </div>

          {/* Repair Price List */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-12">
              Common repair prices:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border rounded-lg overflow-hidden">
              {repairs.map(({ service, price }) => (
                <div
                  key={service}
                  className="bg-white p-6 flex justify-between items-center"
                >
                  <span className="text-foreground font-medium">{service}</span>
                  <span className="text-primary font-bold text-lg">
                    {price}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Key Points */}
          <section className="border-t border-border pt-20 mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-12">
              What's included:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Fixed Pricing",
                  items: [
                    "Quote before we start",
                    "No hidden diagnostics fees",
                    "No surprises",
                  ],
                },
                {
                  title: "12-Month Warranty",
                  items: [
                    "Parts covered",
                    "Labour covered",
                    "No conditions",
                  ],
                },
                {
                  title: "Expert Service",
                  items: [
                    "Certified technicians",
                    "OEM-grade parts",
                    "Proper techniques",
                  ],
                },
              ].map(({ title, items }) => (
                <div key={title}>
                  <h3 className="text-xl font-bold text-foreground mb-6">
                    {title}
                  </h3>
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Get Quote */}
          <section className="bg-blue-50 border border-primary/20 rounded-lg p-12 text-center mb-20">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Not sure of the price?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Use our instant quote calculator to see estimated pricing for your
              device. Or call us for a specific quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-blue-700">
                <Link href="/quote">Get Instant Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2">
                <Link href="/contact">Call for Quote</Link>
              </Button>
            </div>
          </section>

          {/* FAQ */}
          <section className="border-t border-border pt-20">
            <h2 className="text-3xl font-bold text-foreground mb-12">
              Pricing questions:
            </h2>
            <div className="space-y-8 max-w-3xl">
              {[
                {
                  q: "Why are prices different for the same repair?",
                  a: "Device condition varies. A screen with minor cracks costs less than one with major damage. We inspect before quoting.",
                },
                {
                  q: "Do you price match?",
                  a: "We won't beat every lowball quote, but we're competitive and transparent. Quality costs slightly more.",
                },
                {
                  q: "Are there any extra charges?",
                  a: "No. The quote is final. No diagnostics fees, no assembly charges, no 'handling' fees. That's it.",
                },
                {
                  q: "What if you discover extra damage?",
                  a: "We'll diagnose for free and show you the full scope of work. You approve the final quote before we proceed.",
                },
                {
                  q: "Do I get an invoice?",
                  a: "Yes. Every repair includes an itemized invoice showing parts, labour, and warranty period.",
                },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-bold text-foreground mb-2 text-lg">
                    {q}
                  </h3>
                  <p className="text-muted-foreground">{a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
