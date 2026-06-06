"use client";

import Link from "next/link";
import Image from "next/image";
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
    <header className="glass fixed top-0 inset-x-0 z-50 border-b border-blue-500/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0 group"
        >
          <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <Image
              src="/origin_repairs_logo.png"
              alt="ORIGIN Repairs"
              width={48}
              height={48}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-bold text-base tracking-tight text-foreground leading-tight">ORIGIN</span>
            <span className="text-[11px] text-muted-foreground leading-tight">Device Care</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10 flex-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors duration-150 relative ${
                pathname === href || pathname.startsWith(href + "/")
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
              {(pathname === href || pathname.startsWith(href + "/")) && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Button
            asChild
            className="btn-primary text-sm"
          >
            <Link href="/book">Book Repair</Link>
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-border w-80 p-0">
              <div className="flex flex-col h-full p-6">
                {/* Brand */}
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg leading-none">O</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm tracking-tight leading-tight">ORIGIN</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">Device Care</span>
                  </div>
                </div>

                {/* Nav */}
                <nav className="flex flex-col gap-1 flex-1">
                  {[...links, { href: "/contact", label: "Contact" }, { href: "/faq", label: "FAQ" }].map(({ href, label }) => (
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

                {/* Mobile CTA */}
                <div className="pt-6 border-t border-border space-y-3">
                  <SheetClose asChild>
                    <Button asChild className="w-full btn-primary">
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
