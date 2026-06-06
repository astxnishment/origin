import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Device Repairs Leeds | iPhone, Samsung, MacBook | ORIGIN Repairs",
  description: "Expert repairs for iPhone, Samsung, iPad, MacBook and more. Same-day service, OEM parts, 12-month warranty. Walk in or book online. Leeds LS2 8GL.",
};

const categories = [
  {
    device: "iPhone",
    href: "/repairs/iphone",
    tagline: "All models from iPhone 11 to 16 Pro Max",
    repairs: [
      { name: "Screen Replacement", time: "45 min", from: "£49" },
      { name: "Battery Replacement", time: "30 min", from: "£39" },
      { name: "Charging Port", time: "60 min", from: "£45" },
      { name: "Camera Repair", time: "60 min", from: "£55" },
      { name: "Water Damage", time: "24 hrs", from: "£65" },
      { name: "Back Glass", time: "45 min", from: "£40" },
    ],
  },
  {
    device: "Samsung",
    href: "/repairs/samsung",
    tagline: "Galaxy S, A-series, Z-series, Tab",
    repairs: [
      { name: "Screen Replacement", time: "60 min", from: "£59" },
      { name: "Battery Replacement", time: "45 min", from: "£45" },
      { name: "Charging Port", time: "60 min", from: "£50" },
      { name: "Camera Lens", time: "45 min", from: "£35" },
      { name: "Water Damage", time: "24 hrs", from: "£65" },
      { name: "Back Glass", time: "90 min", from: "£55" },
    ],
  },
  {
    device: "iPad",
    href: "/repairs/laptops",
    tagline: "All iPad models including Pro and mini",
    repairs: [
      { name: "Screen Replacement", time: "90 min", from: "£79" },
      { name: "Battery Replacement", time: "60 min", from: "£55" },
      { name: "Charging Port", time: "60 min", from: "£50" },
      { name: "Home Button", time: "45 min", from: "£40" },
      { name: "Camera Repair", time: "60 min", from: "£55" },
      { name: "Software Issues", time: "60 min", from: "£35" },
    ],
  },
  {
    device: "MacBook & Laptop",
    href: "/repairs/laptops",
    tagline: "MacBook Air/Pro, Dell, HP, Lenovo",
    repairs: [
      { name: "Screen Replacement", time: "2–3 hrs", from: "£149" },
      { name: "Battery Replacement", time: "90 min", from: "£99" },
      { name: "Keyboard Replacement", time: "2 hrs", from: "£129" },
      { name: "Liquid Damage", time: "24–48 hrs", from: "£95" },
      { name: "SSD Upgrade", time: "60 min", from: "£79" },
      { name: "RAM Upgrade", time: "60 min", from: "£69" },
    ],
  },
];

const repairTypes = [
  "Screen replacement", "Battery", "Water damage", "Camera",
  "Charging port", "Speaker & mic", "Software issues", "Data recovery",
];

export default function RepairsPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="pt-10 pb-16">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              Repairs
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5 max-w-lg">
              Every device.<br />Every repair.
            </h1>
            <p className="text-[15px] text-muted-foreground max-w-md leading-relaxed">
              OEM-grade parts. Same-day service on most repairs. 12-month warranty included.
            </p>
          </div>

          {/* Repair type pills */}
          <div className="flex flex-wrap gap-2 mb-16">
            {repairTypes.map((label) => (
              <span
                key={label}
                className="px-3 py-1.5 rounded-full border border-border text-[12px] text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Device categories */}
          <div className="space-y-14">
            {categories.map(({ device, href, tagline, repairs }) => (
              <div key={device} className="section-border pt-10 first:border-0 first:pt-0">
                <div className="flex items-baseline justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{device}</h2>
                    <p className="text-[13px] text-muted-foreground mt-0.5">{tagline}</p>
                  </div>
                  <Link
                    href={href}
                    className="text-[13px] text-primary hover:underline underline-offset-4 whitespace-nowrap flex items-center gap-1"
                  >
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
                  {repairs.map(({ name, time, from }) => (
                    <div
                      key={name}
                      className="bg-card p-5 flex justify-between items-center hover:bg-surface transition-colors"
                    >
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{name}</p>
                        <p className="text-[12px] text-muted-foreground mt-0.5">{time}</p>
                      </div>
                      <p className="text-[13px] font-semibold text-foreground whitespace-nowrap">
                        {from}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-20 pt-16 border-t border-border text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
              Not sure what&apos;s wrong?
            </h2>
            <p className="text-muted-foreground text-[15px] mb-8 max-w-sm mx-auto">
              Walk in — we diagnose for free with no obligation.
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
