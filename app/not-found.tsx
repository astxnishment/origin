import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Wrench, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found | Origin Repairs",
  description: "The page you're looking for doesn't exist. Return to Origin Repairs Leeds for iPhone, Samsung, and MacBook repairs.",
};

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen flex items-center pt-28 pb-24">
        {/* Subtle bg texture */}
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-blue-500/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-5 sm:px-8 text-center">
          {/* 404 number */}
          <p
            className="text-[120px] sm:text-[160px] font-bold leading-none select-none mb-4"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0.05) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Page not found
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-10 max-w-md mx-auto">
            The page you&apos;re looking for has moved, been removed, or never existed. Let&apos;s get you back on track.
          </p>

          {/* Primary actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Button asChild className="btn-primary h-11 px-7 text-sm">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Back to homepage
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 px-7 text-sm border-border hover:bg-surface">
              <Link href="/book" className="flex items-center gap-2">
                Book a repair
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Quick links */}
          <div
            className="rounded-2xl p-6 text-left"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Popular pages
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { href: "/repairs/iphone",       label: "iPhone Repairs",        icon: Wrench },
                { href: "/repairs/samsung",       label: "Samsung Repairs",       icon: Wrench },
                { href: "/repairs/ipad",          label: "iPad Repairs",          icon: Wrench },
                { href: "/repairs/laptops",       label: "MacBook & Laptop",      icon: Wrench },
                { href: "/quote",                 label: "Get Instant Quote",     icon: ArrowRight },
                { href: "/contact",               label: "Contact Us",            icon: MessageCircle },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
                >
                  <Icon className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
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
