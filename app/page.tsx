import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowUpRight,
  ReceiptText,
  Cpu,
  ShieldCheck,
  MapPin,
  Smartphone,
  Wrench,
  CalendarCheck,
} from "lucide-react";
import { BUSINESS } from "@/lib/constants";

const categories = [
  {
    label: "iPhone",
    href: "/repairs/iphone",
    tagline: "Screen · Battery · Camera · Charging",
    image: "/images/services/iphone.png",
  },
  {
    label: "Samsung",
    href: "/repairs/samsung",
    tagline: "Galaxy S · A-series · Z-series",
    image: "/images/services/samsung.avif",
  },
  {
    label: "MacBook",
    href: "/repairs/laptops",
    tagline: "Air · Pro · Screen · Battery · Keyboard",
    image: "/images/services/macbook.png",
  },
  {
    label: "iPad",
    href: "/repairs/ipad",
    tagline: "All models · Screen · Battery · Port",
    image: "/images/services/ipad.png",
  },
  {
    label: "Google Pixel",
    href: "/repairs/google-pixel",
    tagline: "Pixel 6 · 7 · 8 · 9 · Screen · Battery",
    image: "/GooglePixel/Pixel-9-pro-repair-in-Leeds.png",
  },
  {
    label: "Data Recovery",
    href: "/repairs/data-recovery",
    tagline: "Phone · Laptop · SSD · Hard drive",
    image: "/Data-Recovery.png",
  },
];

const trustPoints = [
  { icon: ReceiptText, label: "Transparent quotes", desc: "A clear price, agreed before any work begins." },
  { icon: Cpu, label: "Quality parts", desc: "Components chosen to meet manufacturer standards." },
  { icon: ShieldCheck, label: "Warranty included", desc: "Every repair is covered by our warranty." },
  { icon: MapPin, label: "Local Leeds repairs", desc: "Carried out in our Leeds city-centre workshop." },
];

const steps = [
  {
    icon: Smartphone,
    title: "Choose your device",
    desc: "Pick your brand and model — iPhone, Samsung, MacBook, iPad, Pixel or a drive for data recovery.",
  },
  {
    icon: Wrench,
    title: "Select your repair",
    desc: "Tell us what needs putting right, from a cracked screen to a tired battery, and see a clear quote.",
  },
  {
    icon: CalendarCheck,
    title: "Book it in",
    desc: "Reserve a slot or walk in to our Leeds workshop and leave the rest to our technicians.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 sm:pt-36 lg:pt-40 pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground mb-7">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Premium device repair · Leeds
            </span>

            <h1 className="text-balance text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02] mb-6">
              Your device,
              <br />
              restored properly.
            </h1>

            <p className="text-pretty text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed mb-9">
              Careful, precise repairs for iPhone, Samsung, MacBook and more — handled by technicians who treat your device like their own, in the heart of Leeds.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5">
              <Button asChild className="btn-primary h-[52px] px-7 text-base">
                <Link href="/quote">
                  Get a Repair Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild className="btn-secondary h-[52px] px-7 text-base">
                <Link href="/repairs">View Repairs</Link>
              </Button>
            </div>
          </div>

          {/* Device showcase */}
          <div className="relative">
            <div className="relative aspect-square w-full max-w-md mx-auto overflow-hidden rounded-3xl border border-border bg-surface">
              <Image
                src="/images/hero-device.png"
                alt="Premium smartphone restored by Origin Repairs"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 480px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── DEVICE SELECTOR ──────────────────────────── */}
      <section className="section-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">
                Choose your device
              </p>
              <h2 className="text-4xl sm:text-5xl font-semibold">
                What needs fixing?
              </h2>
            </div>
            <Link
              href="/repairs"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              All repairs
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {categories.map(({ label, href, tagline, image }) => (
              <Link
                key={label}
                href={href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 hover:border-primary/40"
              >
                {/* Consistent device image area */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-background/40">
            <Image
              src={image}
              alt={`${label} repair`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            />
                </div>
                {/* Label */}
                <div className="flex items-start justify-between gap-3 p-5 sm:p-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{label}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tagline}</p>
                  </div>
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-300 group-hover:border-primary/50 group-hover:text-primary">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────── */}
      <section className="section-border bg-surface/40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {trustPoints.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-primary mb-4">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="font-semibold text-foreground mb-1.5">{label}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="section-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24">
          <div className="mb-12">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">
              How it works
            </p>
            <h2 className="text-4xl sm:text-5xl font-semibold">
              Three steps. No fuss.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="bg-card p-7 sm:p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE / BOOKING CTA ──────────────────────── */}
      <section className="section-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-9 sm:p-14 lg:p-16">
            <div className="relative grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-12 items-center">
              <div>
                <h2 className="text-balance text-4xl sm:text-5xl font-semibold mb-5">
                  Ready to get a price?
                </h2>
                <p className="text-pretty text-lg text-muted-foreground leading-relaxed max-w-xl">
                  Get a clear repair quote in a couple of minutes, then book your device in. Walk-ins are welcome at our Leeds workshop too.
                </p>
              </div>

              <div className="flex flex-col gap-3.5 lg:items-end">
                <div className="flex flex-col sm:flex-row gap-3.5 w-full lg:w-auto">
                  <Button asChild className="btn-primary h-[52px] px-7 text-base">
                    <Link href="/quote">
                      Get a Repair Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild className="btn-secondary h-[52px] px-7 text-base">
                    <Link href="/book">Book a Repair</Link>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {BUSINESS.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
