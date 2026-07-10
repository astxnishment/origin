import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCalculator from "@/components/HeroCalculator";
import TrackRepairStrip from "@/components/TrackRepairStrip";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Battery,
  Check,
  Clock,
  Droplets,
  Gamepad2,
  HardDrive,
  Laptop,
  MonitorCog,
  MapPin,
  Phone,
  Shield,
  Smartphone,
  Star,
  Tablet,
  Wrench,
  Zap,
} from "lucide-react";
import { BUSINESS, TESTIMONIALS } from "@/lib/constants";
import { serviceImages } from "@/lib/serviceImages";
import { appleImageUrl, MACBOOK_IMAGES } from "@/lib/appleDeviceImages";

const homepageMacBookImage = {
  src: appleImageUrl(MACBOOK_IMAGES['MacBook Pro 16" M3'], 256, false),
  alt: "MacBook Pro repair in Leeds",
  width: 256,
  height: 256,
};


const heroDevices = [
  {
    src: serviceImages.iphone.src,
    alt: "iPhone repair in Leeds",
    width: serviceImages.iphone.width,
    height: serviceImages.iphone.height,
    className:
      "absolute right-[10%] top-[12%] h-60 w-60 sm:h-72 sm:w-72 lg:h-[390px] lg:w-[390px]",
  },
  {
    src: homepageMacBookImage.src,
    alt: homepageMacBookImage.alt,
    width: homepageMacBookImage.width,
    height: homepageMacBookImage.height,
    className:
      "absolute bottom-[6%] right-[0%] h-40 w-64 sm:h-48 sm:w-80 lg:h-64 lg:w-[430px]",
  },
  {
    src: "/GooglePixel/Pixel-9-repair-in-Leeds.png",
    alt: "Google Pixel repair in Leeds",
    width: 1200,
    height: 1200,
    className:
      "absolute bottom-[20%] right-[44%] h-36 w-36 sm:h-44 sm:w-44 lg:h-56 lg:w-56",
  },
];

const categories = [
  {
    label: "Phones",
    href: "/repairs/phones",
    note: "iPhone · Samsung · Pixel",
    icon: Smartphone,
    image: serviceImages.phones,
    imageClassName: "h-32 w-44",
  },
  {
    label: "Tablets",
    href: "/repairs/ipad",
    note: "iPad · Galaxy Tab · Android",
    icon: Tablet,
    image: serviceImages.tablets,
    imageClassName: "h-32 w-44",
  },
  {
    label: "Laptops",
    href: "/repairs/laptops",
    note: "MacBook · Windows · Gaming",
    icon: Laptop,
    image: homepageMacBookImage,
    imageClassName: "h-24 w-40",
  },
  {
    label: "Consoles",
    href: "/repairs/consoles",
    note: "HDMI · Power · Overheating",
    icon: Gamepad2,
    image: serviceImages.console,
    imageClassName: "h-28 w-40",
  },
  {
    label: "Custom PCs",
    href: "/repairs/custom-pc",
    note: "Builds · GPU · SSD · Cooling",
    icon: MonitorCog,
    image: serviceImages.customPc,
    imageClassName: "h-32 w-40",
  },
  {
    label: "Data Recovery & Liquid Damage",
    href: "/repairs/data-recovery",
    note: "All liquid · SSD · Files",
    icon: HardDrive,
    image: serviceImages.dataRecoveryLiquidDamage,
    imageClassName: "h-32 w-40",
  },
];

const popularRepairs = [
  { icon: Wrench, label: "Screen repair", price: "From £49", time: "45-90 min" },
  { icon: Battery, label: "Battery", price: "From £39", time: "30-75 min" },
  { icon: Zap, label: "Charging port", price: "From £45", time: "60 min" },
  { icon: Droplets, label: "Water damage", price: "Free check", time: "Same day" },
];

const trustItems = [
  { icon: Clock, label: "Same-day" },
  { icon: Shield, label: "12-month warranty" },
  { icon: MapPin, label: "Leeds LS2" },
  { icon: Check, label: "Free diagnosis" },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <section className="relative isolate min-h-[calc(100svh-72px)] overflow-hidden pt-[72px]">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-y-0 right-0 hidden w-[62%] lg:block">
              <div className="relative h-full min-h-[560px] opacity-95">
                {heroDevices.map(({ src, alt, width, height, className }) => (
                  <Image
                    key={alt}
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    priority
                    unoptimized={src.startsWith("https://")}
                    className={`${className} object-contain drop-shadow-[0_28px_70px_rgba(0,0,0,0.34)]`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content sits ~96px below the header rather than vertically centred */}
          <div className="mx-auto flex min-h-[calc(100svh-72px)] max-w-6xl items-start px-5 pt-10 pb-14 sm:px-8 lg:pt-24 lg:pb-20">
            <div className="max-w-[680px]">
              <div className="relative mb-8 h-44 lg:hidden">
                <Image
                  src={serviceImages.iphone.src}
                  alt="iPhone repair in Leeds"
                  width={serviceImages.iphone.width}
                  height={serviceImages.iphone.height}
                  priority
                  className="absolute right-0 top-0 h-36 w-36 object-contain drop-shadow-[0_18px_42px_rgba(0,0,0,0.32)]"
                />
                <Image
                  src={homepageMacBookImage.src}
                  alt={homepageMacBookImage.alt}
                  width={homepageMacBookImage.width}
                  height={homepageMacBookImage.height}
                  priority
                  unoptimized
                  className="absolute bottom-0 left-10 h-24 w-44 object-contain drop-shadow-[0_18px_42px_rgba(0,0,0,0.32)]"
                />
                <Image
                  src="/GooglePixel/Pixel-9-repair-in-Leeds.png"
                  alt="Google Pixel repair in Leeds"
                  width={1200}
                  height={1200}
                  priority
                  className="absolute left-0 top-10 h-24 w-24 object-contain drop-shadow-[0_18px_42px_rgba(0,0,0,0.32)]"
                />
              </div>

              <a
                href={BUSINESS.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="badge-premium mb-6 w-fit transition-colors hover:border-foreground/25 hover:text-foreground"
              >
                <MapPin className="h-3.5 w-3.5" />
                Leeds · Cookridge Street
              </a>

              <h1 className="max-w-3xl text-6xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
                Device repair in Leeds.
              </h1>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="btn-primary h-[54px] px-8 text-base">
                  <Link href="/book" className="flex items-center gap-2">
                    Book Repair
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild className="btn-secondary h-[54px] px-8 text-base">
                  <a href={BUSINESS.phoneHref} className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {BUSINESS.phoneDisplay}
                  </a>
                </Button>
              </div>

              <div className="mt-9 grid max-w-xl grid-cols-2 gap-3 text-sm text-muted-foreground sm:grid-cols-4">
                {trustItems.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[color:var(--icon-fg)]" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-border px-5 sm:px-8 lg:grid-cols-4 lg:divide-y-0">
            <a
              href={BUSINESS.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-5 text-sm text-muted-foreground transition-colors hover:text-foreground lg:px-5"
            >
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </span>
              Reviews
            </a>
            {trustItems.slice(0, 3).map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 py-5 text-sm text-muted-foreground lg:px-5">
                <Icon className="h-4 w-4 text-[color:var(--icon-fg)]" />
                {label}
              </div>
            ))}
          </div>
        </section>

        <TrackRepairStrip />

        <section className="section-border">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Repairs</p>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose a device.</h2>
              </div>
              <Link href="/repairs" className="hidden text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground sm:inline-flex">
                All repairs
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {categories.map(({ label, href, note, icon: Icon, image, imageClassName }) => (
                <Link
                  key={label}
                  href={href}
                  className="group grid min-h-[188px] grid-cols-[1fr_auto] items-center gap-4 bg-card p-5 transition-colors hover:bg-surface"
                >
                  <div className="self-end">
                    <Icon className="mb-5 h-5 w-5 text-[color:var(--icon-fg)]" />
                    <h3 className="text-xl font-bold tracking-tight text-foreground">{label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{note}</p>
                  </div>
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      loading="lazy"
                      unoptimized={image.src.startsWith("https://")}
                      sizes="160px"
                      className={`${imageClassName} object-contain transition-transform duration-300 group-hover:scale-105`}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-border">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Popular</p>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Common repairs.</h2>
              </div>
              <Button asChild className="btn-secondary hidden h-10 px-5 text-[13px] sm:inline-flex">
                <Link href="/quote">Get Quote</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 divide-y divide-border border-y border-border md:grid-cols-4 md:divide-x md:divide-y-0">
              {popularRepairs.map(({ icon: Icon, label, price, time }) => (
                <Link key={label} href="/quote" className="group p-5 transition-colors hover:bg-surface">
                  <Icon className="mb-6 h-5 w-5 text-[color:var(--icon-fg)]" />
                  <p className="text-lg font-bold text-foreground">{label}</p>
                  <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-foreground">{price}</span>
                    <span className="text-muted-foreground">{time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-border">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[0.8fr_1fr]">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Instant quote</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pick. Price. Book.</h2>
            </div>
            <HeroCalculator />
          </div>
        </section>

        <section className="section-border">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Reviews</p>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Leeds says.</h2>
              </div>
              <a
                href={BUSINESS.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                Leave a review
              </a>
            </div>

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
              {TESTIMONIALS.map(({ author, role, content, rating, device }) => (
                <figure key={author} className="flex flex-col gap-4 bg-card p-6">
                  <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{content}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center justify-between gap-3 text-[13px]">
                    <span className="font-semibold text-foreground">{author} · {role}</span>
                    <span className="text-muted-foreground">{device}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
