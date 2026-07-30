import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InteractiveMap from "@/components/InteractiveMap";
import ContactForm from "@/app/contact/ContactForm";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, MapPin } from "lucide-react";
import { BUSINESS, FEATURES } from "@/lib/constants";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="pt-10 pb-14 border-b border-border">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              Contact
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5 max-w-lg">
              Get in touch.
            </h1>
            <p className="text-[15px] text-muted-foreground max-w-md leading-relaxed">
              Ask about a device, a published estimate, or work that needs an
              assessment. We aim to respond during business hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 py-14">
            <aside className="lg:col-span-2 space-y-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Phone
                </p>
                <a
                  href={BUSINESS.phoneHref}
                  className="text-[15px] font-medium text-foreground hover:text-primary transition-colors"
                >
                  {BUSINESS.phoneDisplay}
                </a>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Email
                </p>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="text-[15px] font-medium text-foreground hover:text-primary transition-colors"
                >
                  {BUSINESS.email}
                </a>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Address
                </p>
                <a
                  href={BUSINESS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex flex-col gap-2 text-[15px] text-foreground"
                >
                  <address className="not-italic transition-colors group-hover:text-primary">
                    {BUSINESS.addressLines[0]}
                    <br />
                    {BUSINESS.addressLines[1]}
                  </address>
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-primary group-hover:underline">
                    <MapPin className="h-3.5 w-3.5" />
                    View on Google Maps
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </a>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Published hours
                </p>
                <div className="text-[15px] text-foreground space-y-0.5">
                  <p>Mon-Fri: 9am-6pm</p>
                  <p>Sat: 10am-4pm</p>
                  <p className="text-muted-foreground">Sun: Closed</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start gap-2 mb-2">
                  <Clock className="h-4 w-4 text-[color:var(--icon-fg)] mt-0.5 flex-shrink-0" />
                  <p className="text-[13px] font-semibold text-foreground">
                    Visit policy
                  </p>
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {FEATURES.walkInsEnabled
                    ? "Walk-ins are currently enabled. Call ahead for complex or parts-dependent work."
                    : "Walk-in availability is not currently published. Contact us before travelling."}
                </p>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>

          <section className="border-t border-border py-14">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-stretch">
              <div className="flex flex-col justify-between gap-8">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">
                    Location
                  </p>
                  <h2 className="text-3xl font-semibold tracking-tight mb-4">
                    Find Origin Repairs.
                  </h2>
                  <p className="text-[15px] text-muted-foreground leading-relaxed max-w-sm">
                    Use the map for the configured Cookridge Street address and
                    current directions.
                  </p>
                </div>
                <Button asChild className="btn-secondary h-11 w-fit px-5 text-[13px]">
                  <a
                    href={BUSINESS.googleDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    Get directions
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
              <InteractiveMap />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
