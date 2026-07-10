import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { serviceImages } from "@/lib/serviceImages";
import DeviceImage from "@/components/DeviceImage";
import { DeviceIcon, type DeviceType as DeviceIconType } from "@/components/DeviceIcon";

type Choice = {
  name: string;
  note: string;
  href: string;
  image?: (typeof serviceImages)[keyof typeof serviceImages];
  /** When set, render a real DeviceImage (brand/model). */
  brand?: "Apple" | "Samsung" | "Google Pixel";
  model?: string;
  deviceTypeId?: string;
  /** Fallback inline icon when there's no brand-specific photo. */
  icon?: DeviceIconType;
};

export const metadata: Metadata = {
  title: "Device Repairs Leeds | Phones, Laptops, Consoles, PCs",
  description: "Expert repairs for phones, tablets, all kinds of laptops, consoles, custom PC builds, upgrades, liquid damage and data recovery. Walk in or book online. Leeds LS2 8GL.",
};

const categories: Array<{
  device: string;
  href: string;
  tagline: string;
  image: (typeof serviceImages)[keyof typeof serviceImages];
  prompt?: string;
  choices?: Choice[];
  repairs?: { name: string; time: string; from: string }[];
}> = [
  {
    device: "Phone Repairs",
    href: "/repairs/phones",
    tagline: "iPhone, Samsung Galaxy, Google Pixel and more",
    image: serviceImages.phones,
    prompt: "Which phone do you have? Pick your brand to see models & pricing.",
    choices: [
      { name: "iPhone", note: "iPhone 6 through 17 Pro Max", href: "/repairs/iphone", brand: "Apple", model: "iPhone 17 Pro Max", deviceTypeId: "iphone" },
      { name: "Samsung Galaxy", note: "Galaxy S, A, Z Fold & Flip", href: "/repairs/samsung", brand: "Samsung", model: "Galaxy S24 Ultra", deviceTypeId: "galaxy-s" },
      { name: "Google Pixel", note: "Pixel 6 through 9 Pro", href: "/repairs/google-pixel", brand: "Google Pixel", model: "Pixel 9 Pro", deviceTypeId: "google-pixel" },
      { name: "Other Android", note: "OnePlus, Xiaomi, Sony & more", href: "/repairs/phones", brand: "Samsung", model: "Galaxy A55", deviceTypeId: "galaxy-a" },
    ],
  },
  {
    device: "Tablets",
    href: "/repairs/ipad",
    tagline: "iPad, Samsung Galaxy Tab and Android tablets",
    image: serviceImages.tablets,
    prompt: "Which tablet do you have? Pick yours for an instant price.",
    choices: [
      { name: "iPad", note: "Pro, Air, mini & standard", href: "/quote?device=ipad", brand: "Apple", model: 'iPad Pro 11" M4', deviceTypeId: "ipad" },
      { name: "Samsung Galaxy Tab", note: "Tab S, Tab A series", href: "/quote?device=galaxy-tab", image: serviceImages.samsungGalaxyTab },
      { name: "Other Android tablet", note: "Lenovo, Huawei, Amazon & more", href: "/book", image: serviceImages.androidLogo },
    ],
  },
  {
    device: "Laptops",
    href: "/repairs/laptops",
    tagline: "MacBook, Windows, gaming and business laptops",
    image: serviceImages.macbook,
    prompt: "Which laptop do you have? Pick yours to get started.",
    choices: [
      { name: "MacBook", note: "Air & Pro, all years", href: "/quote?device=macbook", brand: "Apple", model: 'MacBook Pro 14" M3', deviceTypeId: "macbook" },
      { name: "Samsung Galaxy Book", note: "Galaxy Book series", href: "/quote?device=galaxy-book", image: serviceImages.samsungGalaxyBook },
      { name: "Windows / Gaming laptop", note: "Dell, HP, Lenovo, ASUS, Acer & more", href: "/repairs/laptops", image: serviceImages.windowsLogo },
    ],
  },
  {
    device: "Game Consoles",
    href: "/repairs/consoles",
    tagline: "PlayStation, Xbox, Nintendo Switch and handhelds",
    image: serviceImages.console,
    prompt: "Which console do you have? Pick yours to see what we fix.",
    choices: [
      { name: "PlayStation", note: "PS5 & PS4 — HDMI, power, overheating", href: "/repairs/consoles", image: serviceImages.playstation },
      { name: "Xbox", note: "Series X/S & Xbox One", href: "/repairs/consoles", image: serviceImages.xbox },
      { name: "Nintendo Switch", note: "Switch, OLED, Lite & handhelds", href: "/repairs/consoles", image: serviceImages.nintendoSwitch },
    ],
  },
  {
    device: "Custom PC Builds & Upgrades",
    href: "/repairs/custom-pc",
    tagline: "Gaming PCs, workstation builds and performance upgrades",
    image: serviceImages.customPc,
    repairs: [
      { name: "Custom PC Build", time: "1–3 days", from: "£99" },
      { name: "GPU Upgrade", time: "Same day", from: "£39" },
      { name: "SSD / NVMe Upgrade", time: "60 min", from: "£49" },
      { name: "RAM Upgrade", time: "30 min", from: "£29" },
      { name: "Cooling Upgrade", time: "1–2 hrs", from: "£49" },
      { name: "Cable Management", time: "1–2 hrs", from: "£49" },
    ],
  },
  {
    device: "Data Recovery & Liquid Damage",
    href: "/repairs/data-recovery",
    tagline: "All liquid-damaged devices, SSDs, hard drives & lost files",
    image: serviceImages.dataRecoveryLiquidDamage,
    repairs: [
      { name: "Phone Data Recovery", time: "2–7 days", from: "£79" },
      { name: "Liquid Damage Assessment", time: "Same day", from: "£29" },
      { name: "Hard Drive Recovery", time: "3–10 days", from: "£99" },
      { name: "SSD Recovery", time: "24–48 hrs", from: "£99" },
      { name: "RAID Recovery", time: "48–72 hrs", from: "£149" },
      { name: "Board-Level Recovery", time: "2–7 days", from: "£129" },
    ],
  },
];

const repairTypes = [
  "Screen replacement", "Battery", "Charging port", "Motherboard",
  "No power", "Liquid damage", "Data recovery", "Consoles", "Custom PCs", "Face ID / biometric",
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
              Phones, tablets, all kinds of laptops, consoles, custom PCs, liquid damage and board-level repairs.
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

          {/* Device categories — pick your device first, pricing follows */}
          <div className="space-y-14">
            {categories.map(({ device, href, tagline, image, prompt, choices, repairs }) => (
              <div key={device} className="section-border pt-10 first:border-0 first:pt-0">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-5">
                    {/* Device image thumbnail */}
                    <div className="w-16 h-16 rounded-xl bg-surface border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        className="object-contain w-12 h-12"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">{device}</h2>
                      <p className="text-[13px] text-muted-foreground mt-0.5">{prompt ?? tagline}</p>
                    </div>
                  </div>
                  <Link
                    href={href}
                    className="text-[13px] text-primary hover:underline underline-offset-4 whitespace-nowrap flex items-center gap-1 flex-shrink-0"
                  >
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {choices ? (
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 ${
                      choices.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
                    } gap-px bg-border rounded-xl overflow-hidden`}
                  >
                    {choices.map((c) => (
                      <Link
                        key={c.name}
                        href={c.href}
                        className="group bg-card p-5 flex items-center gap-4 hover:bg-surface transition-colors"
                      >
                        <div className="w-16 h-14 flex-shrink-0 flex items-center justify-center">
                          {c.image ? (
                            <Image
                              src={c.image.src}
                              alt={c.image.alt}
                              width={c.image.width}
                              height={c.image.height}
                              className="h-full w-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
                            />
                          ) : c.brand ? (
                            <DeviceImage
                              brand={c.brand}
                              model={c.model ?? ""}
                              deviceTypeId={c.deviceTypeId}
                              category="phone"
                              size={52}
                              className="w-full h-full flex items-center justify-center"
                              imgClassName="object-contain w-full h-full"
                            />
                          ) : (
                            <DeviceIcon device={c.icon ?? "iphone"} size={40} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-semibold text-foreground">{c.name}</p>
                          <p className="text-[12px] text-muted-foreground mt-0.5 leading-snug">{c.note}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
                    {repairs?.map(({ name, time, from }) => (
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
                )}
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
              <Button asChild className="btn-primary h-10 rounded-lg px-6 text-[13px]">
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
