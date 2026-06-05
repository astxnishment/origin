import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

const repairs = [
  { device: "iPhone", service: "Screen replacement", price: "£49–£149", time: "45 min" },
  { device: "iPhone", service: "Battery replacement", price: "£39–£59", time: "30 min" },
  { device: "Samsung", service: "Screen replacement", price: "£59–£139", time: "60 min" },
  { device: "Samsung", service: "Battery replacement", price: "£45–£65", time: "45 min" },
  { device: "iPad", service: "Screen replacement", price: "£79–£179", time: "90 min" },
  { device: "iPad", service: "Battery replacement", price: "£55–£85", time: "60 min" },
  { device: "MacBook", service: "Screen replacement", price: "£149–£299", time: "2–3 hrs" },
  { device: "MacBook", service: "Battery replacement", price: "£99–£149", time: "90 min" },
  { device: "MacBook", service: "Keyboard replacement", price: "£129–£199", time: "2 hrs" },
  { device: "Any device", service: "Charging port repair", price: "£45–£99", time: "60 min" },
  { device: "Any device", service: "Camera replacement", price: "£49–£129", time: "60 min" },
  { device: "Any device", service: "Water damage assessment", price: "£49–£149", time: "24–48 hrs" },
  { device: "Laptop / Phone", service: "Data recovery", price: "£149–£599", time: "1–7 days" },
  { device: "MacBook", service: "SSD upgrade", price: "£79–£199", time: "60 min" },
];

const included = [
  "Fixed price quote before we start",
  "No diagnostic charge",
  "OEM-grade replacement parts",
  "12-month warranty on all repairs",
  "Free post-repair quality check",
  "Data always protected",
];

const faqs = [
  { q: "Are prices fixed or estimates?", a: "We give a fixed quote before any work begins. The price you're quoted is the price you pay." },
  { q: "Is diagnostics free?", a: "Yes. We assess your device for free and tell you exactly what needs fixing before you commit." },
  { q: "What if I don't proceed with the repair?", a: "No charge. You're never obligated to go ahead after a quote." },
  { q: "Why cheaper than Apple or Samsung?", a: "We use OEM-grade parts at a fraction of manufacturer prices. Same quality, honest margins." },
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
                  Transparent pricing.<br />No surprises.
                </h1>
                <p className="text-[15px] text-muted-foreground leading-relaxed max-w-md">
                  Every repair comes with a fixed quote before we start. No diagnostic fees, no hidden charges, no upselling.
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

          {/* Price table */}
          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-8">Common repair prices</h2>
            <div className="rounded-xl border border-border overflow-hidden">
              {/* Header row */}
              <div className="grid grid-cols-4 bg-surface px-5 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Device</p>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground col-span-2">Service</p>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground text-right">Price</p>
              </div>
              {/* Rows */}
              {repairs.map(({ device, service, price, time }, i) => (
                <div
                  key={`${device}-${service}`}
                  className={`grid grid-cols-4 px-5 py-4 items-center border-t border-border hover:bg-surface transition-colors ${
                    i % 2 === 0 ? "bg-card" : "bg-card"
                  }`}
                >
                  <p className="text-[12px] text-muted-foreground">{device}</p>
                  <div className="col-span-2">
                    <p className="text-[13px] font-medium text-foreground">{service}</p>
                    <p className="text-[12px] text-muted-foreground">{time}</p>
                  </div>
                  <p className="text-[13px] font-semibold text-foreground text-right">{price}</p>
                </div>
              ))}
            </div>
            <p className="text-[12px] text-muted-foreground mt-4">
              Prices shown are ranges. Exact quote given free before any work begins.
            </p>
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
              <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 text-[13px]">
                <Link href="/quote" className="flex items-center gap-2">
                  Quote calculator <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl h-10 px-6 text-[13px] border-border hover:bg-muted">
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
