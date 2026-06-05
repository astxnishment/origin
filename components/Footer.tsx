import Link from "next/link";
import { BUSINESS } from "@/lib/constants";

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
    <footer className="section-border bg-card mt-auto">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex w-7 h-7 rounded-lg bg-primary items-center justify-center">
                <span className="text-white text-[12px] font-bold leading-none">O</span>
              </span>
              <span className="font-semibold text-sm text-foreground">ORIGIN</span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-5">
              Professional device repair in Leeds. Every repair backed by a 12-month warranty.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={BUSINESS.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Google ↗
              </a>
              <span className="text-border">·</span>
              <a
                href={BUSINESS.trustpilotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Trustpilot ↗
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-[12px] font-semibold text-foreground uppercase tracking-widest mb-4">
              Services
            </p>
            <ul className="space-y-2.5">
              {services.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-[12px] font-semibold text-foreground uppercase tracking-widest mb-4">
              Company
            </p>
            <ul className="space-y-2.5">
              {company.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[12px] font-semibold text-foreground uppercase tracking-widest mb-4">
              Contact
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${BUSINESS.phone}`}
                  className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {BUSINESS.email}
                </a>
              </li>
              <li>
                <address className="not-italic text-[13px] text-muted-foreground">
                  76 Cookridge Street<br />
                  Leeds, LS2 8GL
                </address>
              </li>
              <li className="text-[13px] text-muted-foreground">
                <span className="block">Mon–Fri: 9am–6pm</span>
                <span className="block">Sat: 10am–4pm</span>
                <span className="block">Sun: Closed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 text-[12px] text-muted-foreground">
          <p>© {new Date().getFullYear()} Origin Repairs Ltd. All rights reserved.</p>
          <p>76 Cookridge Street, Leeds, LS2 8GL, UK</p>
        </div>
      </div>
    </footer>
  );
}
