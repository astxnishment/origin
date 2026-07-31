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
import { getSpecialistPriceLabel } from "@/lib/serviceCatalogue";
import {
  PageContainer,
  PageIntro,
  PageSection,
} from "@/components/layout/PageContainer";

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
  description: "Repair services in Leeds for phones, tablets, laptops, consoles and custom PCs, including assessment-led liquid damage, board repair and data recovery.",
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
      { name: "Other Android tablet", note: "Lenovo, Huawei, Amazon & more", href: "/contact", image: serviceImages.androidLogo },
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
      { name: "Custom PC Build", time: "1–3 days estimate", from: getSpecialistPriceLabel("desktop", "custom-pc-build") },
      { name: "GPU / Cooling Upgrade", time: "Parts dependent", from: getSpecialistPriceLabel("desktop", "gpu-cooling-upgrade") },
      { name: "SSD / RAM Upgrade", time: "Parts dependent", from: getSpecialistPriceLabel("desktop", "ssd-ram-upgrade") },
      { name: "No Power Repair", time: "Fault dependent", from: getSpecialistPriceLabel("desktop", "no-power-repair") },
      { name: "Hardware Diagnostics", time: "Assessment required", from: getSpecialistPriceLabel("desktop", "hardware-diagnostics") },
    ],
  },
  {
    device: "Data Recovery",
    href: "/repairs/data-recovery",
    tagline: "Phones, tablets, computers, SSDs, hard drives and lost files",
    image: serviceImages.dataRecovery,
    repairs: [
      { name: "Data Recovery Assessment", time: "2–10 days estimate", from: getSpecialistPriceLabel("data-recovery", "data-recovery") },
      { name: "Phone Board Recovery", time: "2–7 days estimate", from: getSpecialistPriceLabel("phone", "data-recovery") },
      { name: "Laptop / Drive Recovery", time: "3–10 days estimate", from: getSpecialistPriceLabel("laptop", "data-recovery") },
      { name: "Specialist Lab Referral", time: "Confirmed after assessment", from: "Specialist quote" },
    ],
  },
  {
    device: "Liquid Damage Repair",
    href: "/repairs/liquid-damage",
    tagline: "Phones, tablets, laptops, consoles and custom PCs",
    image: serviceImages.liquidDamage,
    repairs: [
      { name: "Phone Liquid Damage", time: "1–5 days estimate", from: getSpecialistPriceLabel("phone", "liquid-damage-repair") },
      { name: "Tablet Liquid Damage", time: "1–5 days estimate", from: getSpecialistPriceLabel("tablet", "liquid-damage-repair") },
      { name: "Laptop Liquid Damage", time: "2–7 days estimate", from: getSpecialistPriceLabel("laptop", "liquid-damage-repair") },
      { name: "Console Liquid Damage", time: "1–5 days estimate", from: getSpecialistPriceLabel("console", "liquid-damage-repair") },
      { name: "Desktop / Custom PC", time: "2–7 days estimate", from: getSpecialistPriceLabel("desktop", "liquid-damage-repair") },
      { name: "Corrosion / Board Repair", time: "Condition dependent", from: "Assessment required" },
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

      <main className="pb-16 pt-20 sm:pb-24 sm:pt-24">
        <PageContainer>
          <PageIntro
            eyebrow="Repairs"
            title="Repair, without the guesswork."
            description={
              <>
              Phones, tablets, all kinds of laptops, consoles, custom PCs, liquid damage, data recovery and board-level repairs.
              </>
            }
          />

          {/* Repair type pills */}
          <div
            role="region"
            aria-label="Repair types"
            tabIndex={0}
            className="-mx-4 mb-10 mt-8 flex snap-x gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mb-16 sm:mt-10 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
          >
            {repairTypes.map((label) => (
              <span
                key={label}
                className="shrink-0 snap-start rounded-full border border-border px-3 py-1.5 text-[12px] text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Device categories — pick your device first, pricing follows */}
          <div className="space-y-10 sm:space-y-14">
            {categories.map(({ device, href, tagline, image, prompt, choices, repairs }) => (
              <div key={device} className="section-border pt-8 first:border-0 first:pt-0 sm:pt-10">
                <div className="mb-5 flex items-start justify-between gap-2 sm:mb-6 sm:items-center sm:gap-4">
                  <div className="flex min-w-0 items-center gap-3 sm:gap-5">
                    {/* Device image thumbnail */}
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface sm:h-16 sm:w-16 sm:rounded-xl">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        className="h-10 w-10 object-contain sm:h-12 sm:w-12"
                      />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold leading-snug text-foreground sm:text-xl">{device}</h2>
                      <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-muted-foreground sm:text-[13px]">{prompt ?? tagline}</p>
                    </div>
                  </div>
                  <Link
                    href={href}
                    aria-label={`View all ${device}`}
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md text-primary transition-colors hover:bg-surface sm:h-auto sm:w-auto sm:gap-1 sm:rounded-none sm:text-[13px] sm:hover:bg-transparent sm:hover:underline sm:underline-offset-4"
                  >
                    <span className="hidden sm:inline">View all</span>
                    <ArrowRight className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                  </Link>
                </div>

                {choices ? (
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 ${
                      choices.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
                    } gap-px overflow-hidden rounded-lg bg-border sm:rounded-xl`}
                  >
                    {choices.map((c) => (
                      <Link
                        key={c.name}
                        href={c.href}
                        className="group flex min-h-20 items-center gap-3 bg-card p-4 transition-colors hover:bg-surface sm:gap-4 sm:p-5"
                      >
                        <div className="flex h-12 w-14 flex-shrink-0 items-center justify-center sm:h-14 sm:w-16">
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
                  <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-border sm:grid-cols-2 sm:rounded-xl lg:grid-cols-3">
                    {repairs?.map(({ name, time, from }) => (
                      <div
                        key={name}
                        className="flex min-h-20 items-center justify-between gap-3 bg-card p-4 transition-colors hover:bg-surface sm:p-5"
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
          <PageSection bordered={false} className="mt-14 text-center sm:mt-20">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
              Not sure what&apos;s wrong?
            </h2>
            <p className="text-muted-foreground text-[15px] mb-8 max-w-sm mx-auto">
              Send the model and symptoms so the team can confirm the right
              assessment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="btn-primary h-10 rounded-lg px-6 text-[13px]">
                <Link href="/book">Request a Repair</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl h-10 px-6 text-[13px] border-border hover:bg-muted">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </PageSection>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
}
