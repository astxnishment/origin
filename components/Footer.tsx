import Link from "next/link";
import Logo from "@/components/Logo";
import { BUSINESS } from "@/lib/constants";
import { Phone, Mail, MapPin } from "lucide-react";

const navLinks = [
  { href: "/repairs", label: "Repairs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/quote", label: "Quote" },
  { href: "/book", label: "Book Repair" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const legal = [
  { href: "/warranty", label: "Warranty" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function Footer() {
  return (
    <footer className="section-border bg-surface/40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
          {/* Brand */}
          <div className="max-w-xs">
            <Link
              href="/"
              aria-label="Origin Repairs — home"
              className="inline-block mb-5 transition-opacity duration-200 hover:opacity-70"
            >
              <Logo variant="dark" heightClass="h-9" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium device repair in Leeds. Every repair carried out with care and backed by our warranty.
            </p>
          </div>

          {/* Links + contact */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-10 sm:gap-16">
            <nav aria-label="Footer">
              <p className="text-xs font-semibold text-foreground uppercase tracking-[0.2em] mb-4">
                Explore
              </p>
              <ul className="space-y-3">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-[0.2em] mb-4">
                Visit &amp; contact
              </p>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <address className="not-italic text-sm text-muted-foreground">
                    76 Cookridge Street
                    <br />
                    Leeds, LS2 8GL
                  </address>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <a
                    href={BUSINESS.phoneHref}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {BUSINESS.phoneDisplay}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <a
                    href={`mailto:${BUSINESS.email}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {BUSINESS.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-7 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Origin Repairs. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {legal.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
