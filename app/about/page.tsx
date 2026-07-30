import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BUSINESS, FEATURES } from "@/lib/constants";
import { WARRANTY_NOTICE } from "@/lib/warranty";
import {
  PageContainer,
  PageIntro,
  PageSection,
  SectionHeading,
} from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "About — Leeds Device Repair Specialists",
  description:
    "Learn how Origin Repairs approaches device assessment, repair quotes, parts choices and warranty terms in Leeds.",
};

const values = [
  {
    title: "Clear approval",
    desc: "The proposed work and price are explained before a repair begins.",
  },
  {
    title: "Appropriate repair",
    desc: "The assessment determines whether a component-level repair, replacement part or specialist referral is appropriate.",
  },
  {
    title: "Parts choices",
    desc: "Available compatible, refurbished-original or genuine service-part options are identified accurately before selection.",
  },
  {
    title: "Documented warranty",
    desc: WARRANTY_NOTICE,
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="pb-24 pt-24">
        <PageContainer>
          <PageIntro
            eyebrow="About Origin"
            title="Clear repair advice, without the guesswork."
            description={
              <>
                Origin Repairs is an independent Leeds device-repair business.
                We assess the fault, explain the available repair and part
                options, and agree the price before authorised work begins.
              </>
            }
          />

          <PageSection>
            <SectionHeading
              eyebrow="Our approach"
              title="Assessment comes first."
            />
            <div className="max-w-3xl space-y-4 text-[15px] leading-7 text-muted-foreground">
              <p>
                Our published catalogue covers phones, tablets, laptops, game
                consoles, custom PCs, liquid-damage assessment and data-recovery
                work. Device condition and parts availability can affect the
                final repair plan.
              </p>
              <p>
                Some straightforward repairs can be completed quickly, while
                board-level, liquid-damage and data-recovery work requires
                inspection. The estimate shown with a repair is not presented
                as a guaranteed completion time.
              </p>
              <p>{WARRANTY_NOTICE}</p>
            </div>
          </PageSection>

          <PageSection>
            <SectionHeading title="What we stand for" />
            <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-border sm:grid-cols-2">
              {values.map(({ title, desc }) => (
                <div
                  key={title}
                  className="border-b border-border bg-card p-6 last:border-b-0 sm:min-h-40 sm:border-r sm:[&:nth-child(2n)]:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
                >
                  <h3 className="card-title mb-2">{title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </PageSection>

          <PageSection>
            <SectionHeading title="Find us" />
            <div className="panel-muted grid grid-cols-1 gap-8 p-6 sm:grid-cols-3 sm:p-8">
              <div>
                <p className="eyebrow mb-2 text-muted-foreground">Location</p>
                <a
                  href={BUSINESS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[14px] text-foreground transition-colors hover:text-primary"
                >
                  <address className="not-italic">
                    76 Cookridge Street<br />
                    Leeds, LS2 8GL
                  </address>
                </a>
              </div>
              <div>
                <p className="eyebrow mb-2 text-muted-foreground">Hours</p>
                <div className="text-[14px] text-foreground space-y-0.5">
                  <p>Mon–Fri: 9am–6pm</p>
                  <p>Sat: 10am–4pm</p>
                  <p className="text-muted-foreground">Sun: Closed</p>
                </div>
              </div>
              <div>
                <p className="eyebrow mb-2 text-muted-foreground">Contact</p>
                <div className="text-[14px] space-y-1">
                  <a href={`tel:${BUSINESS.phone}`} className="block text-foreground hover:text-primary transition-colors">
                    {BUSINESS.phoneDisplay}
                  </a>
                  <a href={`mailto:${BUSINESS.email}`} className="block text-foreground hover:text-primary transition-colors">
                    {BUSINESS.email}
                  </a>
                </div>
              </div>
            </div>
          </PageSection>

          <PageSection bordered={false} className="text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
              Discuss your repair.
            </h2>
            <p className="text-[15px] text-muted-foreground mb-8 max-w-sm mx-auto">
              {FEATURES.walkInsEnabled
                ? "Walk-ins are currently available, or request a time in advance."
                : "Contact us first or send a repair request so we can confirm the next step."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {FEATURES.bookingEnabled && (
                <Button asChild className="btn-primary h-10 rounded-lg px-6 text-[13px]">
                  <Link href="/book">Request a Repair</Link>
                </Button>
              )}
              <Button asChild variant="outline" className="rounded-xl h-10 px-6 text-[13px] border-border hover:bg-muted">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </PageSection>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
}
