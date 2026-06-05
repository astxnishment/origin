import Link from "next/link";
import { BUSINESS } from "@/lib/constants";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const nav = [
  {
    heading: "Services",
    links: [
      { href: "/repairs", label: "All Repairs" },
      { href: "/repairs/iphone", label: "iPhone Repair" },
      { href: "/repairs/samsung", label: "Samsung Repair" },
      { href: "/repairs/laptops", label: "Laptop Repair" },
      { href: "/pricing", label: "Pricing" },
      { href: "/book", label: "Book Repair" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
      { href: "/quote", label: "Get Quote" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <p className="font-bold text-lg mb-2">
                <span className="text-primary">Origin</span> Repairs
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Expert device repair in Leeds. Fast, honest, professional.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.google.com/search?q=Origin+Repairs+Leeds"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Google
              </a>
              <span className="text-muted-foreground">•</span>
              <a
                href="https://www.trustpilot.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Trustpilot
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          {nav.map(({ heading, links }) => (
            <div key={heading}>
              <p className="text-sm font-semibold text-foreground mb-4">
                {heading}
              </p>
              <ul className="space-y-2.5">
                {links.map(({ href, label }) => (
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
          ))}

          {/* Contact Section */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-4">
              Contact
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <a
                  href={`tel:${BUSINESS.phone}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {BUSINESS.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {BUSINESS.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <address className="text-sm text-muted-foreground not-italic">
                  {BUSINESS.address}
                  <br />
                  {BUSINESS.postcode}
                </address>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p>Mon–Fri: 9am–6pm</p>
                  <p>Sat: 10am–4pm</p>
                  <p>Sun: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="border-t border-border bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Origin Repairs. All rights
            reserved.
          </p>
          <p>76 Cookridge Street, Leeds, LS2 8GL, UK</p>
        </div>
      </div>
    </footer>
  );
}
