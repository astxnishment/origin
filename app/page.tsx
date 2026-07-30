import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCalculator from "@/components/HeroCalculator";
import {
  PageContainer,
  PageSection,
  SectionHeading,
} from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Battery,
  Clock,
  Droplets,
  Gamepad2,
  HardDrive,
  Laptop,
  MapPin,
  MonitorCog,
  Package,
  Phone,
  Shield,
  Smartphone,
  Tablet,
  Wrench,
  Zap,
} from "lucide-react";
import { BUSINESS, FEATURES } from "@/lib/constants";
import { serviceImages } from "@/lib/serviceImages";
import { getHomepageRepairs } from "@/lib/serviceCatalogue";

const homepageMacBookImage = serviceImages.macbook;

const categories = [
  {
    label: "Phones",
    href: "/repairs/phones",
    note: "iPhone, Samsung and Pixel",
    icon: Smartphone,
    image: serviceImages.phones,
    imageClassName: "h-[88%] w-[88%]",
  },
  {
    label: "Tablets",
    href: "/repairs/ipad",
    note: "iPad, Galaxy Tab and Android",
    icon: Tablet,
    image: serviceImages.tablets,
    imageClassName: "h-[92%] w-[92%]",
  },
  {
    label: "Laptops",
    href: "/repairs/laptops",
    note: "MacBook, Windows and gaming",
    icon: Laptop,
    image: homepageMacBookImage,
    imageClassName: "h-[74%] w-[94%]",
  },
  {
    label: "Consoles",
    href: "/repairs/consoles",
    note: "HDMI, power and overheating",
    icon: Gamepad2,
    image: serviceImages.console,
    imageClassName: "h-[84%] w-[88%]",
  },
  {
    label: "Custom PCs",
    href: "/repairs/custom-pc",
    note: "Builds, upgrades and cooling",
    icon: MonitorCog,
    image: serviceImages.customPc,
    imageClassName: "h-[90%] w-[82%]",
  },
  {
    label: "Data Recovery & Liquid Damage",
    href: "/repairs/data-recovery",
    note: "Devices, SSDs and files",
    icon: HardDrive,
    image: serviceImages.dataRecoveryLiquidDamage,
    imageClassName: "h-[88%] w-[84%]",
  },
];

const popularRepairIcons = [Wrench, Battery, Zap, Droplets];
const popularRepairs = getHomepageRepairs().map((repair, index) => ({
  ...repair,
  icon: popularRepairIcons[index],
}));

const trustItems = [
  { icon: Clock, label: "Same-day options" },
  { icon: Shield, label: "Warranty shown with quote" },
  {
    icon: FEATURES.mailInEnabled ? Package : MapPin,
    label: FEATURES.mailInEnabled
      ? "Leeds and mail-in service"
      : "Leeds drop-off service",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Choose your repair",
    body: "Select the device, model and fault or tell us what is happening.",
  },
  {
    number: "02",
    title: "Confirm the quote",
    body: "We check the fault, parts, repair time and fixed price with you.",
  },
  {
    number: "03",
    title: "Bring in or send it",
    body: "Visit Cookridge Street or request mail-in instructions.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <section className="border-b border-border pt-16 md:pt-[72px]">
          <PageContainer>
            <div className="grid min-h-[640px] items-center gap-4 py-4 sm:min-h-[680px] sm:gap-8 sm:py-12 lg:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)] lg:gap-10 lg:py-14">
              <div className="relative z-10">
                <a
                  href={BUSINESS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge-premium mb-3 w-fit transition-colors hover:border-foreground/25 hover:text-foreground sm:mb-5"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Leeds · Cookridge Street
                </a>

                <h1 className="display-title text-foreground">
                  Device repair in Leeds.
                </h1>
                <p className="body-large mt-4 max-w-[48ch] text-muted-foreground sm:mt-5">
                  Phones, tablets, laptops, consoles and custom PCs, with the
                  price agreed before work begins.
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-7 sm:flex">
                  <Button
                    asChild
                    className="btn-primary h-12 px-4 text-sm sm:h-14 sm:px-7"
                  >
                    <Link
                      href="/quote"
                      aria-label="Get an instant repair quote"
                      className="flex items-center gap-2"
                    >
                      Instant Quote
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  {FEATURES.bookingEnabled && (
                    <Button
                      asChild
                      className="btn-secondary h-12 px-4 text-sm sm:h-14 sm:px-7"
                    >
                      <Link href="/book">Book Repair</Link>
                    </Button>
                  )}
                </div>

                <a
                  href={BUSINESS.phoneHref}
                  className="mt-3 inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground sm:mt-4"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Prefer to call? {BUSINESS.phoneDisplay}
                </a>

                <div className="mt-5 grid max-w-xl grid-cols-3 border-t border-border pt-4 sm:mt-7 sm:pt-5">
                  {trustItems.map(({ icon: Icon, label }, index) => (
                    <div
                      key={label}
                      className={`flex items-start gap-2 pr-3 text-xs leading-4 text-muted-foreground ${
                        index > 0 ? "border-l border-border pl-3" : ""
                      }`}
                    >
                      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--icon-fg)]" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative order-first h-36 sm:h-64 lg:order-last lg:h-[540px]">
                <Image
                  src={serviceImages.iphone.src}
                  alt="Latest iPhone supported by Origin Repairs"
                  width={serviceImages.iphone.width}
                  height={serviceImages.iphone.height}
                  priority
                  sizes="(max-width: 639px) 180px, (max-width: 1023px) 260px, 390px"
                  className="absolute right-[3%] top-0 z-20 h-36 w-36 object-contain drop-shadow-[0_26px_52px_rgba(0,0,0,0.3)] sm:h-60 sm:w-60 lg:right-[4%] lg:top-[1%] lg:h-[390px] lg:w-[390px]"
                />
                <Image
                  src={homepageMacBookImage.src}
                  alt={homepageMacBookImage.alt}
                  width={homepageMacBookImage.width}
                  height={homepageMacBookImage.height}
                  sizes="(max-width: 639px) 170px, (max-width: 1023px) 280px, 420px"
                  className="absolute bottom-0 left-[4%] z-10 h-24 w-44 object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.28)] sm:h-36 sm:w-72 lg:bottom-[4%] lg:left-[2%] lg:h-60 lg:w-[430px]"
                />
                <Image
                  src="/GooglePixel/Pixel-9-repair-in-Leeds.png"
                  alt="Google Pixel supported by Origin Repairs"
                  width={1200}
                  height={1200}
                  sizes="(max-width: 639px) 88px, (max-width: 1023px) 130px, 170px"
                  className="absolute bottom-[10%] left-0 z-20 h-20 w-20 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.28)] sm:h-28 sm:w-28 lg:bottom-[24%] lg:left-[4%] lg:h-40 lg:w-40"
                />
              </div>
            </div>
          </PageContainer>
        </section>

        <PageSection bordered={false}>
          <PageContainer>
            <SectionHeading
              eyebrow="Repairs"
              title="Choose a device."
              description="Start with the device family. We will narrow down the model, fault and available repair options."
              action={
                <Link
                  href="/repairs"
                  className="hidden items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
                >
                  All repairs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map(
                ({
                  label,
                  href,
                  note,
                  icon: Icon,
                  image,
                  imageClassName,
                }) => (
                  <Link
                    key={label}
                    href={href}
                    className="interactive-card group grid min-h-44 grid-cols-[minmax(0,1fr)_42%] items-center gap-2 p-4 sm:min-h-56 sm:p-5"
                  >
                    <div className="flex min-w-0 self-stretch flex-col justify-between">
                      <Icon className="h-5 w-5 text-[color:var(--icon-fg)]" />
                      <div>
                        <h3 className="text-lg font-semibold leading-tight tracking-tight text-foreground">
                          {label}
                        </h3>
                        <p className="mt-2 text-[13px] leading-5 text-muted-foreground">
                          {note}
                        </p>
                      </div>
                    </div>
                    <div className="flex h-36 items-center justify-center overflow-hidden sm:h-44">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        loading="lazy"
                        sizes="(max-width: 639px) 130px, (max-width: 1023px) 180px, 160px"
                        className={`${imageClassName} object-contain transition-transform duration-200 group-hover:scale-[1.025]`}
                      />
                    </div>
                  </Link>
                )
              )}
            </div>
          </PageContainer>
        </PageSection>

        <PageSection className="bg-surface/55">
          <PageContainer>
            <div className="grid items-start gap-8 lg:grid-cols-[0.68fr_1.32fr] lg:gap-14">
              <div className="lg:sticky lg:top-28">
                <p className="eyebrow">Instant quote</p>
                <h2 className="section-title mt-3">Price your repair.</h2>
                <p className="mt-4 max-w-[42ch] text-[15px] leading-6 text-muted-foreground">
                  Choose a device, model and repair to see the available part
                  options, estimated time and repair-specific warranty.
                </p>
                <Link
                  href="/quote"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:underline"
                >
                  Open the full quote tool
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="panel overflow-hidden">
                <HeroCalculator />
              </div>
            </div>
          </PageContainer>
        </PageSection>

        <PageSection>
          <PageContainer>
            <SectionHeading
              eyebrow="Popular"
              title="Common repairs."
              description="Starting prices and typical timeframes are shown separately so you can compare the most requested work."
            />

            <div className="overflow-hidden rounded-lg border border-border bg-card md:grid md:grid-cols-2 lg:grid-cols-4">
              {popularRepairs.map(
                ({ icon: Icon, label, price, time }, index) => (
                  <Link
                    key={label}
                    href="/quote"
                    className={`group flex min-h-40 flex-col justify-between border-b border-border p-5 transition-colors hover:bg-surface lg:min-h-48 lg:border-b-0 ${
                      index > 0 ? "md:border-l" : ""
                    } ${index === 2 ? "md:border-l-0 lg:border-l" : ""}`}
                  >
                    <div>
                      <Icon className="h-5 w-5 text-[color:var(--icon-fg)]" />
                      <h3 className="mt-6 text-lg font-semibold text-foreground">
                        {label}
                      </h3>
                    </div>
                    <div className="mt-6 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          Starting price
                        </p>
                        <p className="mt-1 text-base font-semibold text-foreground">
                          {price}
                        </p>
                      </div>
                      <p className="max-w-28 text-right text-xs leading-4 text-muted-foreground">
                        {time}
                      </p>
                    </div>
                  </Link>
                )
              )}
            </div>
          </PageContainer>
        </PageSection>

        <PageSection className="bg-surface/35">
          <PageContainer>
            <SectionHeading
              eyebrow="How it works"
              title="A clear route from fault to fix."
            />
            <div className="grid border-y border-border md:grid-cols-3">
              {processSteps.map((step, index) => (
                <div
                  key={step.number}
                  className={`py-6 md:px-7 md:py-8 ${
                    index > 0
                      ? "border-t border-border md:border-l md:border-t-0"
                      : ""
                  }`}
                >
                  <p className="font-mono text-xs text-muted-foreground">
                    {step.number}
                  </p>
                  <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 max-w-[34ch] text-sm leading-6 text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </PageContainer>
        </PageSection>

        <PageSection>
          <PageContainer>
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="eyebrow">Leeds and mail-in</p>
                <h2 className="section-title mt-3">Repair your way.</h2>
                <p className="mt-4 max-w-[58ch] text-[15px] leading-6 text-muted-foreground">
                  Visit 76 Cookridge Street in Leeds, or request current
                  packing and postage instructions before sending a device.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <Button asChild className="btn-primary h-12 px-6">
                  <a
                    href={BUSINESS.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </a>
                </Button>
                {FEATURES.mailInEnabled && (
                  <Button asChild className="btn-secondary h-12 px-6">
                    <Link href="/mail-in">Mail-in Repairs</Link>
                  </Button>
                )}
              </div>
            </div>
          </PageContainer>
        </PageSection>
      </main>

      <Footer />
    </>
  );
}
