import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { APPLE_IPHONES } from "@/lib/repair-data";
import { serviceImages } from "@/lib/serviceImages";

export const metadata: Metadata = {
  title: "iPhone Repair Leeds | All Models",
  description: "Expert iPhone repairs in Leeds. Screen replacement, battery, charging port and more. All models from iPhone SE to 17 Pro Max. Same-day service, 12-month warranty.",
};

const repairTypes = [
  { name: "Screen replacement", price: "from £79", time: "45 min" },
  { name: "Battery replacement", price: "from £49", time: "30 min" },
  { name: "Charging port", price: "from £59", time: "60 min" },
  { name: "Back glass", price: "from £69", time: "45 min" },
  { name: "Camera replacement", price: "from £69", time: "60 min" },
  { name: "Speaker repair", price: "from £49", time: "45 min" },
  { name: "Water damage", price: "from £49", time: "24–48 hrs" },
  { name: "Software repair", price: "from £39", time: "30–60 min" },
];

const guarantees = [
  "OEM-grade replacement screens",
  "12-month warranty included",
  "Same-day in most cases",
  "Fixed price — no surprises",
  "Free diagnostic assessment",
  "Data always protected",
];

const models = Array.from(new Set(APPLE_IPHONES.map((d) => d.model)));

export default function IPhoneRepairsPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="pt-10 pb-16 border-b border-border">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              iPhone Repairs · Leeds
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5">
                  iPhone repair, done right.
                </h1>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-6 max-w-md">
                  Every model from iPhone 11 to 16 Pro Max. Screen replacements in 45 minutes. 12-month warranty on every repair.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                  {guarantees.map((g) => (
                    <li key={g} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-accent shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 text-[13px]">
                    <Link href="/book">Book iPhone Repair</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-xl h-10 px-6 text-[13px] border-border hover:bg-muted">
                    <Link href="/quote" className="flex items-center gap-2">
                      Get a quote <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
              {/* Hero device image */}
              <div className="flex items-center justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 -m-8 rounded-full bg-blue-500/8 blur-3xl pointer-events-none" />
                  <Image
                    src={serviceImages.iphone.src}
                    alt={serviceImages.iphone.alt}
                    width={320}
                    height={400}
                    className="relative object-contain max-h-80 w-auto drop-shadow-[0_16px_48px_rgba(59,130,246,0.2)]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Repair types */}
          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-8">Repair types &amp; pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden">
              {repairTypes.map(({ name, price, time }) => (
                <div key={name} className="bg-card p-5 hover:bg-surface transition-colors">
                  <p className="text-[13px] font-medium text-foreground mb-1">{name}</p>
                  <p className="text-[13px] font-semibold text-primary">{price}</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Supported models */}
          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-2">Supported models</h2>
            <p className="text-[13px] text-muted-foreground mb-8">{models.length} models supported</p>
            <div className="flex flex-wrap gap-2">
              {models.map((model) => (
                <span
                  key={model}
                  className="px-3 py-1.5 rounded-full bg-surface border border-border text-[12px] text-foreground"
                >
                  {model}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">Ready to get your iPhone fixed?</h2>
            <p className="text-[15px] text-muted-foreground mb-8 max-w-sm mx-auto">
              Book online or walk in. Most repairs done the same day.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-8 text-[13px]">
              <Link href="/book">Book a Repair</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
