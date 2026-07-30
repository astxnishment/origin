import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InteractiveMap from "@/components/InteractiveMap";
import ContactForm from "@/app/contact/ContactForm";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, MapPin } from "lucide-react";
import { BUSINESS, FEATURES } from "@/lib/constants";
import {
  PageContainer,
  PageIntro,
  PageSection,
  SectionHeading,
} from "@/components/layout/PageContainer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pb-20 pt-20 sm:pb-24 sm:pt-24">
        <PageContainer>
          <PageIntro
            eyebrow="Contact"
            title="Get in touch."
            description={
              <>
              Ask about a device, a published estimate, or work that needs an
              assessment. We aim to respond during business hours.
              </>
            }
          />

          <PageSection className="grid grid-cols-1 gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
            <aside className="order-2 panel-muted p-5 sm:p-7 lg:order-1">
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <p className="eyebrow mb-2 text-muted-foreground">
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
                <p className="eyebrow mb-2 text-muted-foreground">
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
                <p className="eyebrow mb-2 text-muted-foreground">
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
                <p className="eyebrow mb-2 text-muted-foreground">
                  Published hours
                </p>
                <div className="text-[15px] text-foreground space-y-0.5">
                  <p>Mon-Fri: 9am-6pm</p>
                  <p>Sat: 10am-4pm</p>
                  <p className="text-muted-foreground">Sun: Closed</p>
                </div>
              </div>
              </div>

              <div className="mt-7 border-t border-border pt-6">
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

            <div className="order-1 lg:order-2 lg:col-span-3">
              <ContactForm />
            </div>
          </PageSection>

          <PageSection>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-stretch">
              <div className="flex flex-col justify-between gap-8">
                <SectionHeading
                  eyebrow="Location"
                  title="Find Origin Repairs."
                  description={
                    <>
                    Use the map for the configured Cookridge Street address and
                    current directions.
                    </>
                  }
                  className="mb-0 block"
                />
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
          </PageSection>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
