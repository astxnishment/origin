import Link from "next/link";
import Logo from "@/components/Logo";
import { BUSINESS, FEATURES, TRUST } from "@/lib/constants";
import { WARRANTY_NOTICE } from "@/lib/warranty";
import { MapPin, Mail, Phone, Clock } from "lucide-react";

const repairs = [
  { href: "/repairs/phones", label: "Phone Repair" },
  { href: "/repairs/ipad", label: "iPad Repair" },
  { href: "/repairs/laptops", label: "Laptop Repair" },
  { href: "/repairs/consoles", label: "Console Repair" },
  { href: "/repairs/custom-pc", label: "Custom PC Builds" },
  { href: "/repairs/data-recovery", label: "Data & Liquid Damage" },
];

const services = [
  { href: "/pricing", label: "Pricing" },
  { href: "/quote", label: "Get a Quote" },
  ...(FEATURES.customerAccountsEnabled
    ? [{ href: "/account", label: "Customer Account" }]
    : []),
  ...(FEATURES.mailInEnabled
    ? [{ href: "/mail-in", label: "Mail-in Repairs" }]
    : []),
  { href: "/track", label: "Track a Repair" },
];

const company = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  ...(FEATURES.bookingEnabled
    ? [{ href: "/book", label: "Request Repair" }]
    : []),
];

const legal = [
  { href: "/warranty", label: "Warranty Terms" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export default function Footer() {
  return (
    <footer className="section-border bg-surface/45">
      <div className="page-container py-12 sm:py-14">
        {/* Top grid */}
        <div className="mb-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:mb-12 lg:grid-cols-6 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2 lg:pr-10">
            <Link href="/" aria-label="Origin Repairs — home" className="inline-block mb-6 transition-opacity duration-200 hover:opacity-70">
              <Logo variant="light" heightClass="h-10" className="block dark:hidden" />
              <Logo variant="dark" heightClass="h-10" className="hidden dark:block" />
            </Link>
            <p className="mb-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Professional device repair in Leeds. {WARRANTY_NOTICE}
            </p>
            {(TRUST.googleBusinessUrl || TRUST.trustpilotUrl) && (
              <div className="flex items-center gap-3">
                {TRUST.googleBusinessUrl && (
                  <a
                    href={TRUST.googleBusinessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Google profile ↗
                  </a>
                )}
                {TRUST.googleBusinessUrl && TRUST.trustpilotUrl && (
                  <span className="text-border">·</span>
                )}
                {TRUST.trustpilotUrl && (
                  <a
                    href={TRUST.trustpilotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Trustpilot ↗
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Repairs */}
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-foreground">Repairs</p>
            <ul className="space-y-3">
              {repairs.map(({ href, label }) => (
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
          </div>

          {/* Services */}
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-foreground">Services</p>
            <ul className="space-y-3">
              {services.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-5">Company</p>
            <ul className="space-y-3">
              {company.map(({ href, label }) => (
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
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-5">Contact</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-[color:var(--icon-fg)] flex-shrink-0 mt-0.5" />
                <a
                  href={`tel:${BUSINESS.phone}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {BUSINESS.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-[color:var(--icon-fg)] flex-shrink-0 mt-0.5" />
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {BUSINESS.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[color:var(--icon-fg)] flex-shrink-0 mt-0.5" />
                <a
                  href={BUSINESS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <address className="not-italic">
                    76 Cookridge Street<br />
                    Leeds, LS2 8GL
                  </address>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-[color:var(--icon-fg)] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground space-y-0.5">
                  <p>Mon–Fri: 9am–6pm</p>
                  <p>Sat: 10am–4pm</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal links */}
        <div className="border-t border-border pt-7">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Origin Repairs. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {legal.map(({ href, label }) => (
                <Link key={href} href={href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
