import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteCalculator from "@/components/QuoteCalculator";
import HeroCalculator from "@/components/HeroCalculator";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, Check, MapPin, Clock, Shield, Star, Zap } from "lucide-react";
import { BUSINESS, REPAIR_PROCESS, FAQS, TESTIMONIALS } from "@/lib/constants";

const services = [
  {
    label: "iPhone",
    href: "/repairs/iphone",
    tagline: "All models • Screen • Battery • Camera",
    icon: "📱",
  },
  {
    label: "Samsung",
    href: "/repairs/samsung",
    tagline: "Galaxy S • A-series • Z-series • Tab",
    icon: "📱",
  },
  {
    label: "MacBook",
    href: "/repairs/laptops",
    tagline: "Air • Pro • Screen • Battery • Keyboard",
    icon: "💻",
  },
  {
    label: "iPad",
    href: "/repairs/laptops",
    tagline: "All models • Screen • Battery",
    icon: "📱",
  },
  {
    label: "Data Recovery",
    href: "/repairs/data-recovery",
    tagline: "Phone • Laptop • SSD • Hard drive",
    icon: "🔍",
  },
  {
    label: "All Repairs",
    href: "/repairs",
    tagline: "Don't see your device? We cover it.",
    icon: "🔧",
  },
];

const trustPoints = [
  { icon: Zap, label: "Same-Day Diagnostics", desc: "Free assessment, no obligation" },
  { icon: Shield, label: "12-Month Warranty", desc: "Parts & labour fully covered" },
  { icon: MapPin, label: "Leeds Based", desc: "Local service since 2018" },
  { icon: Check, label: "Transparent Pricing", desc: "Fixed quotes, no surprises" },
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-36 pb-20 overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

        {/* Gradient orbs - more subtle */}
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-32 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left: Text */}
          <div>
            {/* Badge */}
            <div className="badge-premium mb-6 w-fit">
              <MapPin className="h-3.5 w-3.5" />
              Leeds, UK
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Premium device repair in Leeds.
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed mb-12">
              Expert repairs on iPhone, Samsung, MacBook and more. Clear pricing. Quality parts. Warranty-backed service.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Button
                asChild
                className="btn-primary h-12 px-8 text-base"
              >
                <Link href="/book" className="flex items-center gap-2">
                  Book a Repair
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="btn-secondary h-12 px-8 text-base"
              >
                <Link href="/quote">Get Instant Quote</Link>
              </Button>
            </div>

            {/* Real trust callouts */}
            <div className="text-sm space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Same-day diagnostics and repairs</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>12-month warranty on every repair</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Fixed pricing, no hidden fees</span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Calculator */}
          <div className="w-full">
            <HeroCalculator />
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────── */}
      <section className="relative border-y border-blue-500/10 bg-gradient-to-r from-blue-500/5 via-transparent to-blue-500/5 py-12 sm:py-16">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6">
            {trustPoints.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="text-center sm:text-left">
                <Icon className="h-5 w-5 text-blue-500 mb-3 mx-auto sm:mx-0" />
                <p className="font-semibold text-sm text-foreground mb-0.5">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────── */}
      <section className="section-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="mb-14">
            <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">Services</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Every device. Every repair.
            </h2>
          </div>

          <div className="grid-bordered grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ label, href, tagline, icon }) => (
              <Link
                key={label}
                href={href}
                className="p-7 sm:p-8 hover:bg-surface/80 transition-colors duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
                <h3 className="font-bold text-lg text-foreground mb-1">{label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── REPAIR PROCESS ───────────────────────────── */}
      <section className="section-border bg-surface/30">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="mb-14">
            <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Simple from start to finish.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {REPAIR_PROCESS.map(({ step, title, description }) => (
              <div key={step} className="relative">
                <div className="flex flex-col h-full">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-500 flex items-center justify-center font-bold text-sm mb-5">
                    {step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE CALCULATOR ─────────────────────────── */}
      <section className="section-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="mb-14">
            <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Get your instant quote.
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg">
              No hidden fees. Fixed quote before we start. What you see is what you pay.
            </p>
          </div>
          <QuoteCalculator />
        </div>
      </section>

      {/* ── WHY CHOOSE ORIGIN ────────────────────────── */}
      <section className="section-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="mb-14">
            <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">Why Us</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Built differently.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
            {[
              {
                icon: "⚡",
                title: "Same-Day Service",
                desc: "90% of repairs completed within the hour. Walk in, wait, leave with a working device.",
              },
              {
                icon: "💰",
                title: "Transparent Pricing",
                desc: "Fixed quote before we start. No diagnostics fees, no hidden charges, no surprises.",
              },
              {
                icon: "🛡️",
                title: "12-Month Warranty",
                desc: "Industry-leading cover on parts and labour. We'll fix it free if anything goes wrong.",
              },
              {
                icon: "📍",
                title: "Leeds Based",
                desc: "Locally owned. Walk in at 76 Cookridge Street. Real people, real accountability.",
              },
              {
                icon: "🔧",
                title: "Quality Parts",
                desc: "OEM-grade components that meet manufacturer standards. Nothing cheap, nothing counterfeit.",
              },
              {
                icon: "🔍",
                title: "Free Diagnostics",
                desc: "If we can't fix it, you don't pay. Free assessment on every device, every time.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-card p-8 group">
                <div className="text-3xl mb-5 group-hover:scale-110 transition-transform duration-300 w-fit">
                  {icon}
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────── */}
      <section className="section-border bg-surface/30">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="mb-14">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">Reviews</p>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                  What customers say.
                </h2>
              </div>
              {/* Placeholder notice */}
              <div
                className="px-4 py-3 rounded-xl text-xs text-muted-foreground max-w-xs"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                Real Google reviews will appear here once collected.
                <a href="https://www.google.com/search?q=Origin+Repairs+Leeds" target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-1 hover:underline">
                  Leave a review →
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ author, role, content, rating, device }) => (
              <div
                key={author}
                className="card-premium p-7 flex flex-col gap-4"
              >
                <div className="flex gap-1">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-blue-500 text-blue-500" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  &ldquo;{content}&rdquo;
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="font-semibold text-sm text-foreground">{author}</p>
                  <p className="text-xs text-muted-foreground">{role} · {device}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="section-border">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
          <div className="mb-14">
            <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Common questions.
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-1">
            {FAQS.slice(0, 5).map(({ q, a }, i) => (
              <AccordionItem
                key={q}
                value={`item-${i}`}
                className="border-b border-border last:border-0"
              >
                <AccordionTrigger className="text-base font-medium text-foreground hover:text-blue-500 py-4 text-left">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <Link href="/faq" className="text-sm font-medium text-blue-500 hover:text-blue-600 inline-flex items-center gap-2">
              View all questions
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────── */}
      <section className="section-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
          <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-card p-12 sm:p-20 text-center glow-blue-lg">
            {/* Gradient accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Ready to get your device fixed?
              </h2>
              <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                Book online, get an instant quote, or walk in. Free diagnostics. Fixed pricing. 12-month warranty.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Button
                  asChild
                  className="btn-primary h-12 px-8"
                >
                  <Link href="/book" className="flex items-center gap-2">
                    Book a Repair
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  className="btn-secondary h-12 px-8"
                >
                  <Link href="/quote">Get Quote</Link>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                76 Cookridge Street, Leeds • Mon–Fri 9am–6pm • Sat 10am–4pm
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
