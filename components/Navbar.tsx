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
import Image from "next/image";

const links = [
  { href: "/repairs", label: "Repairs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="glass fixed top-0 inset-x-0 z-50 border-b border-blue-500/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-24 flex items-center justify-between gap-8">
        {/* Logo — actual approved Origin Repairs asset */}
        <Link
          href="/"
          aria-label="Origin Repairs — home"
          className="shrink-0 mr-3 sm:mr-6 transition-opacity duration-200 hover:opacity-70"
        >
          <Image
            src="/origin_repairs_logo.png"
            alt="Origin Repairs"
            width={1536}
            height={1024}
            priority
            sizes="200px"
            className="h-[72px] w-auto object-contain dark:invert"
          />
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
          <Button
            asChild
            className="btn-primary text-sm"
          >
            <Link href="/book">Book Repair</Link>
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
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
                <div className="mb-10">
                  <Image
                    src="/origin_repairs_logo.png"
                    alt="Origin Repairs"
                    width={1536}
                    height={1024}
                    sizes="160px"
                    className="h-16 w-auto object-contain dark:invert"
                  />
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
