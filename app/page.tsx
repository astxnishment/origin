import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteCalculator from "@/components/QuoteCalculator";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, Check } from "lucide-react";
import { BUSINESS, REPAIR_PROCESS, FAQS, TESTIMONIALS } from "@/lib/constants";

const services = [
  {
    label: "iPhone",
    href: "/repairs/iphone",
    desc: "All models · Screen · Battery · Camera",
  },
  {
    label: "Samsung",
    href: "/repairs/samsung",
    desc: "Galaxy S · A-series · Z-series · Tab",
  },
  {
    label: "MacBook",
    href: "/repairs/laptops",
    desc: "Air · Pro · Screen · Battery · Keyboard",
  },
  {
    label: "iPad",
    href: "/repairs/laptops",
    desc: "All iPad models · Screen · Battery",
  },
  {
    label: "Data Recovery",
    href: "/repairs/data-recovery",
    desc: "Phone · Laptop · SSD · Hard drive",
  },
  {
    label: "All Repairs",
    href: "/repairs",
    desc: "Don't see your device? We cover it.",
  },
];

const stats = [
  { value: "10k+", label: "Devices repaired" },
  { value: "60 min", label: "Avg. turnaround" },
  { value: "12 mo.", label: "Warranty on all work" },
  { value: "4.8", label: "Google rating" },
];

const guarantees = [
  "Fixed price quote before we start",
  "OEM-grade replacement parts",
  "12-month warranty on all repairs",
  "Same-day service on most repairs",
  "Certified technicians only",
  "No fix, no fee",
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[90vh] flex flex-col justify-center pt-20 pb-16">
        {/* Background texture */}
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

        {/* Top gradient accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 w-full">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-[12px] text-muted-foreground mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            Leeds, UK · Open Mon–Sat
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] mb-6 max-w-3xl">
            Device repair
            <br />
            <span className="text-muted-foreground">done properly.</span>
          </h1>

          <p className="text-[17px] text-muted-foreground max-w-lg leading-relaxed mb-10">
            Expert iPhone, Samsung, and laptop repair in Leeds. Same-day service, genuine parts, 12-month warranty.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-16">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-medium h-11 px-6 rounded-xl shadow-none text-[14px]"
            >
              <Link href="/book">Book a Repair</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border hover:bg-muted h-11 px-6 rounded-xl text-[14px] font-medium"
            >
              <Link href="/quote" className="flex items-center gap-2">
                Get instant quote
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-semibold text-foreground">{value}</p>
                <p className="text-[13px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────── */}
      <section className="section-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="mb-12">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              Services
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Every device. Every repair.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
            {services.map(({ label, href, desc }) => (
              <Link
                key={label}
                href={href}
                className="group bg-card hover:bg-surface-raised p-7 transition-colors duration-150 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[15px] text-foreground">{label}</h3>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150" />
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── GUARANTEES ───────────────────────────────── */}
      <section className="section-border bg-card">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
                Our Standard
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6">
                What you get with every repair.
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                We treat every device like it's our own. No shortcuts, no upselling, no surprises. Just professional repairs done right.
              </p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {guarantees.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-accent" />
                  </span>
                  <span className="text-[14px] text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────── */}
      <section className="section-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="mb-12">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Simple from start to finish.
            </h2>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-5 left-[2.5rem] right-[2.5rem] h-px bg-border" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {REPAIR_PROCESS.map(({ step, title, description }) => (
                <div key={step} className="relative flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-raised border border-border flex items-center justify-center text-[13px] font-semibold text-foreground z-10">
                    {step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[14px] text-foreground mb-1.5">{title}</h3>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE CALCULATOR ─────────────────────────── */}
      <section className="section-border bg-card">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="mb-12">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              Pricing
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
              Instant quote calculator.
            </h2>
            <p className="text-[15px] text-muted-foreground max-w-lg">
              Select your device and repair type. No hidden fees — what you see is what you pay.
            </p>
          </div>
          <QuoteCalculator />
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────── */}
      <section className="section-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="mb-12">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              Reviews
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Trusted in Leeds.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map(({ author, role, content, rating, device }) => (
              <div
                key={author}
                className="card-premium p-6 flex flex-col gap-4"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: rating }).map((_, i) => (
                    <span key={i} className="text-primary text-sm">★</span>
                  ))}
                </div>
                <p className="text-[14px] text-muted-foreground leading-relaxed flex-1">
                  "{content}"
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-[13px] font-semibold text-foreground">{author}</p>
                  <p className="text-[12px] text-muted-foreground">{role} · {device}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="section-border bg-card">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-20">
          <div className="mb-10">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Questions answered.
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-1">
            {FAQS.map(({ q, a }, i) => (
              <AccordionItem
                key={q}
                value={`item-${i}`}
                className="border-b border-border last:border-0"
              >
                <AccordionTrigger className="text-[14px] font-medium text-foreground hover:text-primary py-4 text-left">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed pb-4">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-10 text-center">
            <Link href="/faq" className="text-[13px] text-primary hover:underline underline-offset-4">
              View all questions →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────── */}
      <section className="section-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
          <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-10 sm:p-16 text-center">
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/10 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
                Ready to fix your device?
              </h2>
              <p className="text-[16px] text-muted-foreground mb-10 max-w-lg mx-auto">
                Book online, get an instant quote, or walk in. Open Monday to Saturday.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white h-11 px-8 rounded-xl text-[14px] font-medium"
                >
                  <Link href="/book">Book a Repair</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-border h-11 px-8 rounded-xl text-[14px] font-medium hover:bg-muted"
                >
                  <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a>
                </Button>
              </div>

              <p className="text-[12px] text-muted-foreground">
                {BUSINESS.address} · Mon–Fri 9am–6pm · Sat 10am–4pm
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
