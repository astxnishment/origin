"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { BUSINESS, FEATURES } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/repairs", label: "Repairs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/quote", label: "Quote" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  ...(FEATURES.mailInEnabled
    ? [{ href: "/mail-in", label: "Mail-in" }]
    : []),
];

const PHONE = BUSINESS.phoneDisplay;
const PHONE_HREF = BUSINESS.phoneHref;

export default function Navbar() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="glass fixed top-0 inset-x-0 z-50">
      {/* 1fr | auto | 1fr keeps the nav mathematically centred in the container */}
      <div className="page-container grid h-16 grid-cols-[1fr_auto] items-center gap-3 md:h-[72px] md:grid-cols-[1fr_auto_1fr] md:gap-6">

        <Link
          href="/"
          aria-label="Origin Repairs — home"
          className="shrink-0 justify-self-start transition-opacity duration-200 hover:opacity-75"
        >
          <Logo variant="light" heightClass="h-9 sm:h-11" className="block dark:hidden" />
          <Logo variant="dark" heightClass="h-9 sm:h-11" className="hidden dark:block" />
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

        {/* Right side */}
        <div className="hidden md:flex items-center gap-1.5 justify-self-end">
          <ThemeToggle />
          {FEATURES.bookingEnabled && (
            <Button asChild className="btn-primary ml-2 h-10 whitespace-nowrap px-5 text-[13px]">
              <Link href="/book">Request Repair</Link>
            </Button>
          )}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-1">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(20rem,calc(100vw-12px))] border-border bg-card p-0">
              <SheetTitle className="sr-only">Site navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Browse repair services, pricing and contact options.
              </SheetDescription>
              <div className="flex h-full flex-col p-6">
                <div className="mb-7 flex items-center justify-between">
                  <Logo variant="light" heightClass="h-8" className="block dark:hidden" />
                  <Logo variant="dark" heightClass="h-8" className="hidden dark:block" />
                  <ThemeToggle />
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
                <div className="space-y-2.5 border-t border-border pt-5">
                  {FEATURES.bookingEnabled && (
                    <SheetClose asChild>
                      <Button asChild className="w-full btn-primary h-11">
                        <Link href="/book">Book a Repair</Link>
                      </Button>
                    </SheetClose>
                  )}
                  <SheetClose asChild>
                    <Button asChild className="btn-secondary h-11 w-full text-sm">
                      <Link href="/quote">Get Instant Quote</Link>
                    </Button>
                  </SheetClose>
                  <a
                    href={PHONE_HREF}
                    className="flex h-11 w-full items-center justify-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
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
