"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import Logo from "@/components/Logo";
import { BUSINESS } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/repairs", label: "Repairs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/quote",   label: "Quote"   },
  { href: "/about",   label: "About"   },
  { href: "/contact", label: "Contact" },
];

const PHONE = BUSINESS.phoneDisplay;
const PHONE_HREF = BUSINESS.phoneHref;

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="glass fixed top-0 inset-x-0 z-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between gap-6">

        {/* Logo — navbar is always near-black glass, use dark variant (white logo) */}
        <Link
          href="/"
          aria-label="Origin Repairs — home"
          className="shrink-0 transition-opacity duration-200 hover:opacity-75"
        >
          <Logo variant="dark" heightClass="h-9 sm:h-10" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 flex-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`text-[13px] font-medium transition-colors duration-150 relative pb-0.5 ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-blue-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side — phone + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={PHONE_HREF}
            className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            {PHONE}
          </a>
          <Button asChild className="btn-primary h-9 px-5 text-[13px]">
            <Link href="/book">Book Repair</Link>
          </Button>
        </div>

        {/* Mobile — phone icon + hamburger */}
        <div className="flex md:hidden items-center gap-1">
          <a
            href={PHONE_HREF}
            aria-label="Call us"
            className="h-10 w-10 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
          >
            <Phone className="h-4 w-4" />
          </a>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-border w-80 p-0">
              <div className="flex flex-col h-full p-6">
                {/* Brand — mobile sheet is dark (bg-card), use dark variant */}
                <div className="mb-8">
                  <Logo variant="dark" heightClass="h-8" />
                </div>

                {/* Nav links */}
                <nav className="flex flex-col gap-0.5 flex-1">
                  {NAV_LINKS.map(({ href, label }) => (
                    <SheetClose asChild key={href}>
                      <Link
                        href={href}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground py-3 px-4 rounded-lg hover:bg-surface transition-colors"
                      >
                        {label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                {/* Mobile CTAs */}
                <div className="pt-5 border-t border-border space-y-2.5">
                  <SheetClose asChild>
                    <Button asChild className="w-full btn-primary h-11">
                      <Link href="/book">Book a Repair</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild variant="outline" className="w-full h-11 border-border text-sm">
                      <Link href="/quote">Get Instant Quote</Link>
                    </Button>
                  </SheetClose>
                  <a
                    href={PHONE_HREF}
                    className="flex items-center justify-center gap-2 w-full h-10 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {PHONE}
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}
