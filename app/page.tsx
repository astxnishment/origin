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
  { icon: Clock, label: "Same-day", desc: "Most repairs while you wait" },
  { icon: Shield, label: "12-month warranty", desc: "Parts & labour covered" },
  { icon: Zap, label: "Transparent pricing", desc: "No hidden fees" },
  { icon: Star, label: "Expert technicians", desc: "Certified engineers" },
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-32 pb-16 overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />

        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            {/* Badge */}
            <div className="badge-premium mb-6 w-fit">
              <MapPin className="h-3.5 w-3.5" />
              Leeds, UK • Same-day service
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Premium device repair in Leeds.
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed mb-10">
              iPhone, Samsung, laptop and tablet repairs with clear pricing, quality parts, and warranty-backed service.
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

            {/* Trust badges row */}
            <div className="flex flex-col sm:flex-row gap-8 text-sm">
              <div>
                <p className="font-bold text-2xl text-foreground">4.8★</p>
                <p className="text-muted-foreground">1,200+ reviews</p>
              </div>
              <div className="w-px bg-border hidden sm:block" />
              <div>
                <p className="font-bold text-2xl text-foreground">60 min</p>
                <p className="text-muted-foreground">Average turnaround</p>
              </div>
              <div className="w-px bg-border hidden sm:block" />
              <div>
                <p className="font-bold text-2xl text-foreground">10k+</p>
                <p className="text-muted-foreground">Devices repaired</p>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square rounded-3xl border border-border overflow-hidden bg-gradient-to-br from-surface to-card p-8 glow-blue-lg">
              {/* Diagnostic card visual */}
              <div className="absolute inset-0 flex flex-col justify-between p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-foreground">iPhone 15 Pro</div>
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Screen repair</span>
                      <span className="text-foreground font-medium">£79–£129</span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-1.5">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: "100%" }} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-surface rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground mb-1">Est. time</p>
                      <p className="text-sm font-semibold text-foreground">45 min</p>
                    </div>
                    <div className="bg-surface rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground mb-1">Warranty</p>
                      <p className="text-sm font-semibold text-green-500">12 months</p>
                    </div>
                  </div>
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg text-sm transition-all duration-200">
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-card rounded-2xl border border-border p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-xs">✓</div>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Warranty</p>
                  <p className="text-[11px] text-muted-foreground">12-month coverage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST POINTS ─────────────────────────────── */}
      <section className="section-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {trustPoints.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="stat-box">
                <Icon className="h-5 w-5 text-blue-500 mb-3" />
                <p className="font-semibold text-sm text-foreground mb-1">{label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
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
      <section className="section-border">
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
      <section className="section-border bg-surface/40">
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

      {/* ── TESTIMONIALS ─────────────────────────────── */}
      <section className="section-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="mb-14">
            <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">Reviews</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Trusted by Leeds customers.
            </h2>
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
                  "{content}"
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
      <section className="section-border bg-surface/40">
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
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-12 sm:p-20 text-center glow-blue-lg">
            {/* Gradient accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Ready to get your device fixed?
              </h2>
              <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                Book online, get an instant quote, or walk in. We're open Monday to Saturday.
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
                {BUSINESS.address} • Mon–Fri 9am–6pm • Sat 10am–4pm
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
