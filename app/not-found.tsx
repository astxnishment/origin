import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Wrench, MessageCircle } from "lucide-react";
import { FEATURES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Page Not Found | Origin Repairs",
  description: "The page you're looking for doesn't exist. Return to Origin Repairs Leeds for phone, tablet, laptop and console repairs.",
};

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="relative min-h-screen flex items-center pt-28 pb-24 overflow-hidden">
        {/* Subtle bg texture */}
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-5 sm:px-8 text-center">
          {/* Cute broken-device mascot */}
          <div className="mx-auto mb-8 w-40 sm:w-48">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="A sad little phone that lost its page">
              {/* soft shadow */}
              <ellipse cx="100" cy="182" rx="52" ry="8" fill="color-mix(in srgb, var(--foreground) 8%, transparent)" />

              {/* little stars / sparkles */}
              <g fill="color-mix(in srgb, var(--foreground) 22%, transparent)">
                <path d="M40 44 l2.2 5 5 2.2 -5 2.2 -2.2 5 -2.2 -5 -5 -2.2 5 -2.2 z" />
                <path d="M164 70 l1.8 4 4 1.8 -4 1.8 -1.8 4 -1.8 -4 -4 -1.8 4 -1.8 z" />
                <circle cx="156" cy="38" r="2.4" />
                <circle cx="34" cy="92" r="2" />
              </g>

              {/* phone body, tilted */}
              <g transform="rotate(-9 100 105)">
                <rect x="62" y="40" width="76" height="130" rx="16"
                  fill="var(--card)" stroke="color-mix(in srgb, var(--foreground) 18%, transparent)" strokeWidth="3" />
                {/* screen */}
                <rect x="71" y="52" width="58" height="106" rx="9"
                  fill="color-mix(in srgb, var(--foreground) 6%, transparent)" />
                {/* speaker notch */}
                <rect x="91" y="46" width="18" height="3.5" rx="1.75"
                  fill="color-mix(in srgb, var(--foreground) 20%, transparent)" />

                {/* cute sad face */}
                <g stroke="color-mix(in srgb, var(--foreground) 55%, transparent)" strokeWidth="3.4" strokeLinecap="round">
                  {/* eyes */}
                  <line x1="89" y1="92" x2="89" y2="100" />
                  <line x1="111" y1="92" x2="111" y2="100" />
                  {/* frown */}
                  <path d="M88 120 q12 -11 24 0" fill="none" />
                </g>
                {/* blush */}
                <circle cx="83" cy="110" r="4" fill="color-mix(in srgb, var(--accent) 40%, transparent)" />
                <circle cx="117" cy="110" r="4" fill="color-mix(in srgb, var(--accent) 40%, transparent)" />

                {/* unplugged charging cable + plug coming loose at bottom */}
                <path d="M100 170 q0 14 -16 18" fill="none"
                  stroke="color-mix(in srgb, var(--foreground) 30%, transparent)" strokeWidth="3.6" strokeLinecap="round" />
                <rect x="74" y="186" width="14" height="9" rx="2.5" transform="rotate(20 81 190)"
                  fill="color-mix(in srgb, var(--foreground) 30%, transparent)" />
              </g>
            </svg>
          </div>

          {/* tiny 404 tag */}
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-3">
            Error 404
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Oops — sorry!
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-10 max-w-md mx-auto">
            We couldn&apos;t find what you were looking for. This page may have moved or never
            existed — but don&apos;t worry, we can still fix your device. Let&apos;s get you back on track.
          </p>

          {/* Primary actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Button asChild className="btn-primary h-11 px-7 text-sm">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Back to homepage
              </Link>
            </Button>
            {FEATURES.bookingEnabled && (
              <Button asChild variant="outline" className="h-11 px-7 text-sm border-border hover:bg-surface">
                <Link href="/book" className="flex items-center gap-2">
                  Request a repair
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          {/* Quick links */}
          <div
            className="rounded-lg p-6 text-left"
            style={{ background: "var(--soft-bg)", border: "1px solid var(--control-border)" }}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Popular pages
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { href: "/repairs/phones",       label: "Phone Repairs",         icon: Wrench },
                { href: "/repairs/ipad",          label: "iPad Repairs",          icon: Wrench },
                { href: "/repairs/laptops",       label: "Laptop Repairs",        icon: Wrench },
                { href: "/repairs/consoles",      label: "Console Repairs",       icon: Wrench },
                { href: "/quote",                 label: "Get an Estimate",       icon: ArrowRight },
                { href: "/contact",               label: "Contact Us",            icon: MessageCircle },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
                >
                  <Icon className="h-3.5 w-3.5 text-[color:var(--icon-fg)] flex-shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
