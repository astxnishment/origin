import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Clock, Shield, ArrowRight, MapPin } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { getRepairPrice, formatPriceRange } from "@/lib/pricing";
import { REPAIR_PRICING } from "@/lib/repairPricing";
import { serviceImages } from "@/lib/serviceImages";
import { appleImageUrl, IPAD_IMAGES } from "@/lib/appleDeviceImages";

export const metadata: Metadata = {
  title: "iPad Repair Leeds — Screen, Battery & More | Origin Repairs",
  description:
    "iPad screen, battery, and charging port repairs in Leeds city centre. All iPad models. Free assessment, 12-month warranty on eligible repairs. Walk-ins welcome.",
};

// Representative model for price display on this page
const REPR_MODEL = "iPad Air 11-inch M2/M3";

function repairPrice(repairType: string): string {
  const row = getRepairPrice("Apple", REPR_MODEL, repairType);
  if (!row) return "POA";
  return formatPriceRange(row.minPrice, row.maxPrice);
}

const repairTypes = [
  {
    name: "Screen / Display Replacement",
    repairKey: "Display Assembly Replacement",
    desc: "Cracked or unresponsive iPad screen replaced with OEM-grade glass and digitiser.",
    time: "1–2 hours",
  },
  {
    name: "Battery Replacement",
    repairKey: "Battery Replacement",
    desc: "Restore your iPad's battery life. We assess health first and replace only when needed.",
    time: "60–90 minutes",
  },
  {
    name: "Charging Port Repair",
    repairKey: "Charging Port Replacement",
    desc: "Faulty USB-C or Lightning port cleaned, repaired, or replaced.",
    time: "60 minutes",
  },
  {
    name: "Camera Repair",
    repairKey: "Rear Camera Replacement",
    desc: "Front or rear camera replaced if damaged or producing poor-quality images.",
    time: "60 minutes",
  },
  {
    name: "Water Damage Assessment",
    repairKey: "Liquid Damage Diagnostics",
    desc: "Free initial assessment. Specialist cleaning and component-level diagnostics.",
    time: "24–48 hours",
  },
  {
    name: "Speaker Repair",
    repairKey: "Speaker / Earpiece Replacement",
    desc: "Speaker or microphone replaced if muffled, quiet, or completely silent.",
    time: "45–90 minutes",
  },
];

const process = [
  { step: 1, title: "Walk in or book", desc: "Drop in at 76 Cookridge Street or book online. No obligation." },
  { step: 2, title: "Free assessment", desc: "We inspect your iPad and confirm the fault and exact price before starting." },
  { step: 3, title: "Professional repair", desc: "OEM-grade parts, careful disassembly, and full reassembly." },
  { step: 4, title: "Quality check", desc: "Full function test before handover. 12-month warranty on eligible repairs." },
];

// Get unique iPad models from pricing data (brand "Apple", model starts with "iPad")
const iPadModels = (() => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const row of REPAIR_PRICING) {
    if (row.brand === "Apple" && row.model.startsWith("iPad") && !seen.has(row.model)) {
      seen.add(row.model);
      result.push(row.model);
    }
  }
  return result;
})();

export default function IPadRepairPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-16 border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
                iPad Repairs · Leeds
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5">
                iPad repair in Leeds city centre.
              </h1>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-md">
                Screen, battery, charging port, camera, and water damage repairs for all iPad
                models. Walk-ins welcome at 76 Cookridge Street.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 text-[13px]">
                  <Link href="/book" className="flex items-center gap-2">
                    Book iPad Repair <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl h-10 px-6 text-[13px] border-border">
                  <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phoneDisplay}</a>
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              {/* iPad hero image */}
              <div className="flex items-center justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 -m-8 rounded-full bg-blue-500/8 blur-3xl pointer-events-none" />
                  {/* Real iPad Pro M4 image from appledb.dev */}
                  <Image
                    src={appleImageUrl(IPAD_IMAGES['iPad Pro 11" M4'], 256, false)}
                    alt="iPad Pro M4 — Origin Repairs"
                    width={256}
                    height={256}
                    unoptimized
                    className="relative object-contain max-h-64 w-auto drop-shadow-[0_16px_48px_rgba(59,130,246,0.2)]"
                    priority
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Check, title: "Free assessment", desc: "No charge to diagnose the problem" },
                { icon: Shield, title: "12-month warranty", desc: "On eligible parts & labour" },
                { icon: Clock, title: "Same day", desc: "Most repairs completed today" },
                { icon: MapPin, title: "Leeds City Centre", desc: "76 Cookridge Street" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-xl border border-border bg-card p-5">
                  <Icon className="h-4 w-4 text-blue-500 mb-2" />
                  <p className="text-[13px] font-semibold text-foreground mb-0.5">{title}</p>
                  <p className="text-[12px] text-muted-foreground">{desc}</p>
                </div>
              ))}
              </div>
            </div>
          </div>
        </section>

        {/* Repair types + prices */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 border-b border-border">
          <h2 className="text-xl font-semibold mb-2">iPad repairs &amp; pricing</h2>
          <p className="text-[13px] text-muted-foreground mb-8">
            Prices shown are estimates for an iPad Air 11-inch. Exact quote given free before any work starts.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repairTypes.map(({ name, repairKey, desc, time }) => {
              const priceDisplay = repairPrice(repairKey);
              return (
                <div key={name} className="rounded-xl border border-border bg-card p-6 flex flex-col gap-3">
                  <div>
                    <h3 className="text-[14px] font-semibold text-foreground mb-1">{name}</h3>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                  <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">{priceDisplay}</p>
                      <p className="text-[11px] text-muted-foreground">{time}</p>
                    </div>
                    <Button asChild size="sm" variant="outline" className="rounded-lg text-[12px] border-border h-8 px-3">
                      <Link href="/book">Book</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[12px] text-muted-foreground mt-6">
            * Prices are estimates and may vary after inspection depending on part quality, device condition, and availability.{" "}
            <Link href="/quote" className="text-primary hover:underline">Use the quote calculator</Link> for your exact model.
          </p>
        </section>

        {/* Supported models */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 border-b border-border">
          <h2 className="text-xl font-semibold mb-6">Supported iPad models</h2>
          <div className="flex flex-wrap gap-2">
            {iPadModels.map((model) => (
              <span key={model} className="px-3 py-1.5 rounded-full border border-border text-[13px] text-muted-foreground">
                {model}
              </span>
            ))}
            <span className="px-3 py-1.5 rounded-full border border-border text-[13px] text-muted-foreground">
              Older models — ask us
            </span>
          </div>
        </section>

        {/* Process */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 border-b border-border">
          <h2 className="text-xl font-semibold mb-8">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map(({ step, title, desc }) => (
              <div key={step}>
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-[12px] font-semibold text-muted-foreground mb-4">
                  {step}
                </div>
                <h3 className="text-[14px] font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 border-b border-border">
          <h2 className="text-xl font-semibold mb-8">iPad repair FAQ</h2>
          <div className="space-y-6">
            {[
              {
                q: "Do I need an appointment for iPad repair?",
                a: "Walk-ins are welcome for most iPad repairs. For iPad Pro or complex data recovery, booking ahead ensures we have the right parts and time allocated for you.",
              },
              {
                q: "Will I lose my data?",
                a: "No. We do not access, delete, or transfer your personal data during screen, battery, or port repairs. For any repair involving storage components, we'll advise you to back up first.",
              },
              {
                q: "Do you use genuine Apple parts?",
                a: "We use OEM-grade components that meet Apple's quality standards. For iPad Pro, we source high-quality aftermarket screens that match the original resolution and colour accuracy. We'll tell you exactly what we're using before we start.",
              },
              {
                q: "What if the repair doesn't fix the problem?",
                a: "We offer a 12-month warranty on eligible repairs. If the same fault reappears due to our work, we'll fix it free of charge.",
              },
              {
                q: "My iPad got wet — can it be repaired?",
                a: "Bring it in as soon as possible. Don't try to charge it. We offer a free initial assessment for liquid damage and will tell you honestly whether recovery is possible.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-border pb-6 last:border-0 last:pb-0">
                <p className="text-[14px] font-semibold text-foreground mb-2">{q}</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3">Get your iPad fixed today.</h2>
          <p className="text-[15px] text-muted-foreground mb-8 max-w-sm mx-auto">
            Walk in or book online. Free assessment, transparent pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 text-[13px]">
              <Link href="/book" className="flex items-center gap-2">
                Book iPad Repair <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl h-10 px-6 text-[13px] border-border">
              <a href={`tel:${BUSINESS.phone}`}>Call {BUSINESS.phoneDisplay}</a>
            </Button>
          </div>
          <p className="text-[12px] text-muted-foreground">
            {BUSINESS.address} · Mon–Fri 9am–6pm · Sat 10am–4pm
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
