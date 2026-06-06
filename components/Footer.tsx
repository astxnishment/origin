import Link from "next/link";
import Image from "next/image";
import { BUSINESS } from "@/lib/constants";
import { MapPin, Mail, Phone, Clock } from "lucide-react";

const services = [
  { href: "/repairs/iphone", label: "iPhone Repair" },
  { href: "/repairs/samsung", label: "Samsung Repair" },
  { href: "/repairs/laptops", label: "Laptop & MacBook" },
  { href: "/repairs/data-recovery", label: "Data Recovery" },
  { href: "/pricing", label: "Pricing" },
  { href: "/quote", label: "Get a Quote" },
];

const company = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/book", label: "Book Repair" },
];

export default function Footer() {
  return (
    <footer className="section-border bg-surface/50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" aria-label="Origin Repairs — home" className="inline-block mb-6 transition-opacity duration-200 hover:opacity-70">
              <Image
                src="/origin_repairs_logo.png"
                alt="Origin Repairs"
                width={1536}
                height={1024}
                sizes="150px"
                className="h-12 w-auto object-contain dark:invert"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Professional device repair in Leeds. Every repair backed by a 12-month warranty.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={BUSINESS.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Google ↗
              </a>
              <span className="text-border">·</span>
              <a
                href={BUSINESS.trustpilotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Trustpilot ↗
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-5">Services</p>
            <ul className="space-y-3">
              {services.map(({ href, label }) => (
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
          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-5">Contact</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <a
                  href={`tel:${BUSINESS.phone}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {BUSINESS.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {BUSINESS.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <address className="not-italic text-sm text-muted-foreground">
                  76 Cookridge Street<br />
                  Leeds, LS2 8GL
                </address>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground space-y-0.5">
                  <p>Mon–Fri: 9am–6pm</p>
                  <p>Sat: 10am–4pm</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Origin Repairs Ltd. All rights reserved.</p>
          <p>76 Cookridge Street, Leeds, LS2 8GL, UK</p>
        </div>
      </div>
    </footer>
  );
}
