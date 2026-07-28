"use client";

import { useState } from "react";
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
import ThemeToggle from "@/components/ThemeToggle";
import { AuthMenu, AuthMenuMobile } from "@/components/AuthMenu";
import { BUSINESS } from "@/lib/constants";

// Primary nav — Contact lives in the footer to keep the header uncluttered
const NAV_LINKS = [
  { href: "/repairs", label: "Repairs" },
  { href: "/mail-in", label: "Mail-in" },
  { href: "/pricing", label: "Pricing" },
  { href: "/quote",   label: "Quote"   },
  { href: "/track",   label: "Track Repair" },
  { href: "/about",   label: "About"   },
];

const PHONE = BUSINESS.phoneDisplay;
const PHONE_HREF = BUSINESS.phoneHref;

export default function Navbar() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="glass fixed top-0 inset-x-0 z-50">
      {/* 1fr | auto | 1fr keeps the nav mathematically centred in the container */}
      <div className="max-w-6xl mx-auto grid h-[72px] grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 sm:px-8">

        <Link
          href="/"
          aria-label="Origin Repairs — home"
          className="shrink-0 justify-self-start transition-opacity duration-200 hover:opacity-75"
        >
          <Logo variant="light" heightClass="h-10 sm:h-11" className="block dark:hidden" />
          <Logo variant="dark" heightClass="h-10 sm:h-11" className="hidden dark:block" />
        </Link>

        {/* Desktop nav — centred column */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`whitespace-nowrap text-[13px] font-medium tracking-[0.01em] transition-colors duration-150 relative pb-0.5 ${
                  active
                    ? "text-foreground"
                    : "text-foreground/65 hover:text-foreground"
                }`}
              >
                {label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-px rounded-full bg-foreground/70" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side — theme icon · account icon · CTA */}
        <div className="hidden md:flex items-center gap-1.5 justify-self-end">
          <ThemeToggle />
          <AuthMenu />
          <Button asChild className="btn-primary ml-2 h-10 whitespace-nowrap px-5 text-[13px]">
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
          <ThemeToggle />
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-border w-80 p-0">
              <div className="flex flex-col h-full p-6">
                <div className="mb-8">
                  <Logo variant="light" heightClass="h-8" className="block dark:hidden" />
                  <Logo variant="dark" heightClass="h-8" className="hidden dark:block" />
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

                {/* Account */}
                <div className="pt-5 border-t border-border pb-5">
                  <AuthMenuMobile onNavigate={() => setSheetOpen(false)} />
                </div>

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
