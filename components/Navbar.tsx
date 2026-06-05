"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { BUSINESS } from "@/lib/constants";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/repairs", label: "Repairs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="glass fixed top-0 inset-x-0 z-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link
          href="/"
          className="font-semibold text-[15px] tracking-tight text-foreground shrink-0 flex items-center gap-2"
        >
          <span className="inline-block w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white text-[11px] font-bold leading-none">O</span>
          </span>
          <span>ORIGIN</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-[13px] px-3 py-1.5 rounded-md transition-colors duration-150 ${
                pathname === href || pathname.startsWith(href + "/")
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <a
            href={`tel:${BUSINESS.phone}`}
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
          >
            {BUSINESS.phone}
          </a>
          <Button
            asChild
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white text-[13px] h-8 px-4 rounded-lg font-medium shadow-none"
          >
            <Link href="/book">Book Repair</Link>
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-border w-72 p-0">
              <div className="flex flex-col h-full p-6">
                {/* Brand */}
                <div className="flex items-center gap-2 mb-8">
                  <span className="inline-block w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                    <span className="text-white text-[11px] font-bold leading-none">O</span>
                  </span>
                  <span className="font-semibold text-sm">ORIGIN</span>
                </div>

                {/* Nav */}
                <nav className="flex flex-col gap-1 flex-1">
                  {[...links, { href: "/contact", label: "Contact" }, { href: "/faq", label: "FAQ" }].map(({ href, label }) => (
                    <SheetClose asChild key={href}>
                      <Link
                        href={href}
                        className="text-sm text-muted-foreground hover:text-foreground py-2 px-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        {label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <div className="pt-4 border-t border-border space-y-3">
                  <a
                    href={`tel:${BUSINESS.phone}`}
                    className="block text-sm text-muted-foreground text-center py-2"
                  >
                    {BUSINESS.phone}
                  </a>
                  <SheetClose asChild>
                    <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg">
                      <Link href="/book">Book a Repair</Link>
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
