import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroVisual from "@/components/HeroVisual";
import QuoteCalculator from "@/components/QuoteCalculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Smartphone,
  Tablet,
  Laptop,
  Battery,
  Monitor,
  Wrench,
  ArrowRight,
  ShieldCheck,
  Clock,
  Star,
  CheckCircle,
  TrendingUp,
  Zap,
  Award,
  MapPin,
} from "lucide-react";
import { BUSINESS, USP, REPAIR_PROCESS, FAQS, TESTIMONIALS } from "@/lib/constants";

const services = [
  {
    icon: Smartphone,
    title: "iPhone Repair",
    desc: "All models from iPhone 11 to iPhone 16. Screen, battery, camera, charging port & more.",
  },
  {
    icon: Smartphone,
    title: "Samsung Repair",
    desc: "Galaxy S, A-series, Z-series. Screen, battery, water damage & specialist repairs.",
  },
  {
    icon: Tablet,
    title: "iPad & Tablet Repairs",
    desc: "iPad, Tab S series. Fast turnaround on all tablet repairs with warranty.",
  },
  {
    icon: Laptop,
    title: "Laptop & MacBook",
    desc: "MacBook Air/Pro, Dell, HP, Lenovo. Screen, keyboard, battery, data recovery.",
  },
  {
    icon: Battery,
    title: "Battery Replacement",
    desc: "Restore your device to full battery health. All brands supported.",
  },
  {
    icon: Monitor,
    title: "Screen Replacement",
    desc: "Crystal-clear OEM-grade displays. Fitted in 60 minutes or less.",
  },
];

const trustMetrics = [
  {
    icon: TrendingUp,
    value: "10,000+",
    label: "Devices repaired",
    desc: "Trusted by thousands",
  },
  {
    icon: Zap,
    value: "60 min",
    label: "Average turnaround",
    desc: "Most repairs while you wait",
  },
  {
    icon: Award,
    value: "12 months",
    label: "Warranty",
    desc: "Full coverage on all work",
  },
  {
    icon: Star,
    value: "4.8 ★",
    label: "Google rating",
    desc: "1,200+ verified reviews",
  },
];

const reasons = [
  {
    icon: ShieldCheck,
    title: "OEM-Grade Parts",
    desc: "We use genuine components that meet manufacturer standards. No cheap replacements.",
  },
  {
    icon: Clock,
    title: "Same-Day Service",
    desc: "90% of repairs completed in 60 minutes while you wait or grab a coffee.",
  },
  {
    icon: Wrench,
    title: "Expert Technicians",
    desc: "Certified engineers with 5+ years experience. Every repair is done right.",
  },
  {
    icon: Star,
    title: "12-Month Warranty",
    desc: "Every repair covered. No hidden conditions. No fine print.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-24 pb-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text */}
          <div>
            <Badge
              variant="outline"
              className="mb-6 text-xs tracking-widest uppercase border-border text-muted-foreground"
            >
              Device Repair · Leeds
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
              Your device,
              <br />
              <span className="text-primary">professionally restored.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-8">
              Expert iPhone, Samsung, and laptop repair in Leeds. Same-day service, genuine parts, 12-month warranty. Fast, honest, professional.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-blue-700 text-white font-medium"
              >
                <Link href="/book">Book a Repair</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-primary text-primary hover:bg-blue-50"
              >
                <Link href="/quote">Get Instant Quote</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm">
              <div>
                <p className="font-semibold text-foreground">4.8 ⭐</p>
                <p className="text-muted-foreground">1,200+ reviews</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="font-semibold text-foreground">60 min</p>
                <p className="text-muted-foreground">Avg. turnaround</p>
              </div>
            </div>
          </div>

          {/* Right: Premium Visual */}
          <HeroVisual />
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="border-y border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustMetrics.map(({ icon: Icon, value, label, desc }) => (
              <div key={label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {value}
                </p>
                <p className="font-semibold text-foreground mb-1">{label}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-16">
          <p className="text-xs tracking-widest uppercase text-primary font-semibold mb-3">
            Services
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Every device, every repair.
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-2xl">
            From cracked screens to water damage, we repair it all with OEM parts and expert care.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {services.map(({ icon: Icon, title, desc }) => (
            <Card
              key={title}
              className="bg-white border-border hover:border-primary hover:shadow-lg transition-all group"
            >
              <CardContent className="p-8">
                <Icon className="h-8 w-8 mb-6 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <Button asChild variant="outline" className="border-2">
            <Link href="/repairs" className="flex items-center gap-2">
              View All Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-t border-border bg-secondary/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-16">
            <p className="text-xs tracking-widest uppercase text-primary font-semibold mb-3">
              Why Choose Us
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              The standard you deserve.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reasons.map(({ icon: Icon, title, desc }) => (
              <Card
                key={title}
                className="bg-white border-border hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-8">
                  <Icon className="h-8 w-8 mb-6 text-primary" />
                  <h3 className="font-semibold text-lg text-foreground mb-3">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Repair Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-16">
          <p className="text-xs tracking-widest uppercase text-primary font-semibold mb-3">
            How It Works
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Simple repair process.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {REPAIR_PROCESS.map(({ step, title, description }) => (
            <div key={step} className="relative">
              <div className="flex flex-col h-full">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
              {step < 4 && (
                <div className="hidden lg:block absolute -right-3 top-10 text-primary">
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-16 text-center">
            <p className="text-xs tracking-widest uppercase text-primary font-semibold mb-3">
              Testimonials
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Trusted by Leeds customers.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real feedback from people who&apos;ve trusted us with their devices.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ author, role, content, rating, device }) => (
              <Card
                key={author}
                className="bg-background border-border hover:shadow-lg transition-shadow flex flex-col"
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-6 flex-1 text-muted-foreground">
                    "{content}"
                  </p>
                  <div className="pt-4 border-t border-border">
                    <p className="font-semibold text-sm text-foreground">
                      {author}
                    </p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                    <p className="text-xs text-primary font-medium mt-2">
                      {device}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Calculator */}
      <QuoteCalculator />

      {/* FAQ */}
      <section className="border-t border-border bg-secondary/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-16 text-center">
            <p className="text-xs tracking-widest uppercase text-primary font-semibold mb-3">
              FAQ
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Common questions.
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQS.map(({ q, a }, i) => (
              <AccordionItem
                key={q}
                value={`item-${i}`}
                className="border-border bg-white rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-4">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-12 p-8 bg-primary/10 border border-primary/20 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Still have questions?
            </p>
            <Button asChild variant="outline" className="border-primary text-primary">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Ready to get your device fixed?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Book online, get an instant quote, or walk in anytime. We're here Monday to Saturday.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-blue-700 text-white"
            >
              <Link href="/book">Book a Repair Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2"
            >
              <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            📍 {BUSINESS.address} | Mon-Sat: 9am-6pm | Sun: Closed
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
