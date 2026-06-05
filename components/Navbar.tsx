"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { BUSINESS } from "@/lib/constants";

const links = [
  { href: "/repairs", label: "Repairs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-xl text-foreground tracking-tight"
        >
          <span className="text-primary">Origin</span> Repairs
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm px-4 py-2 rounded-md transition-colors ${
                pathname === href
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA + Phone */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={`tel:${BUSINESS.phone}`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {BUSINESS.phone}
          </a>
          <Button asChild size="sm" className="bg-primary hover:bg-blue-700">
            <Link href="/book">Book Repair</Link>
          </Button>
        </div>

        {/* Mobile nav */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background border-border">
            <div className="flex flex-col gap-6 mt-8">
              {/* Phone */}
              <a
                href={`tel:${BUSINESS.phone}`}
                className="text-sm font-medium text-primary"
              >
                {BUSINESS.phone}
              </a>

              {/* Mobile nav links */}
              {links.map(({ href, label }) => (
                <SheetClose asChild key={href}>
                  <Link
                    href={href}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </SheetClose>
              ))}

              {/* Mobile CTA */}
              <SheetClose asChild>
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-blue-700 mt-4"
                >
                  <Link href="/book">Book Repair</Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
