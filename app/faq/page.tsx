import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BUSINESS, FEATURES } from "@/lib/constants";
import { WARRANTY_NOTICE } from "@/lib/warranty";
import {
  PageContainer,
  PageIntro,
  PageSection,
} from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Repair estimates, parts choices, warranty terms, turnaround and assessment questions for Origin Repairs.",
};

const categories = [
  {
    name: "Requests & estimates",
    faqs: [
      {
        q: "Does an online request reserve a time?",
        a: "No. An online submission is a repair-slot request. The team must confirm availability before a time is reserved.",
      },
      {
        q: "Can I get an estimate without requesting a time?",
        a: "Yes. The quote calculator shows published price ranges. The final price is confirmed after the device and fault have been assessed.",
      },
      {
        q: "Are walk-ins available?",
        a: FEATURES.walkInsEnabled
          ? "Walk-ins are currently enabled in our published business settings. Calling before travelling is sensible for complex repairs or parts-dependent work."
          : "Walk-in availability is not currently published. Contact us before travelling so the team can confirm the appropriate next step.",
      },
    ],
  },
  {
    name: "Repairs & parts",
    faqs: [
      {
        q: "How long will my repair take?",
        a: "The catalogue shows an estimate for each repair and part option. Device condition, diagnosis and parts availability can change that estimate, so it is confirmed before work begins.",
      },
      {
        q: "What part options are available?",
        a: "Options can include compatible aftermarket, refurbished original, pulled original or genuine service parts. Only options supported by the supply chain and current catalogue should be offered, and the exact option is identified in the quote.",
      },
      {
        q: "Can liquid-damaged devices be assessed?",
        a: "Yes. Liquid damage requires inspection before the repair scope or likelihood of data recovery can be understood. No recovery outcome is guaranteed.",
      },
      {
        q: "Should I back up my data?",
        a: "Yes, whenever the device still allows it. Repair and diagnostic work can involve failing storage or existing damage, so customers should keep a current backup where possible.",
      },
    ],
  },
  {
    name: "Warranty",
    faqs: [
      {
        q: "What warranty do you offer?",
        a: WARRANTY_NOTICE,
      },
      {
        q: "What does a repair warranty cover?",
        a: "Coverage is limited to the supplied part or workmanship identified in the accepted quote. It applies only when assessment confirms the fault actually resulted from our installation, workmanship or a part supplied by us.",
      },
      {
        q: "Does it cover new accidental damage?",
        a: "New impact, liquid ingress or another unrelated fault is assessed as a separate issue. See the warranty page for the current draft terms.",
      },
    ],
  },
  {
    name: "Pricing",
    faqs: [
      {
        q: "Why do some repairs show a range?",
        a: "The model, part-quality tier, device condition and exact fault can affect price. A range is an estimate, not a promise that every device will cost the minimum amount.",
      },
      {
        q: "Can diagnostic charges apply?",
        a: "Some complex faults require extended bench or diagnostic work. Any applicable diagnostic charge should be disclosed before that work begins.",
      },
      {
        q: "What happens before work starts?",
        a: "The proposed repair, selected part tier, price estimate, time estimate and warranty term are confirmed for approval.",
      },
    ],
  },
  {
    name: "Location & contact",
    faqs: [
      {
        q: "Where is Origin Repairs?",
        a: BUSINESS.address,
      },
      {
        q: "How quickly will you reply?",
        a: "We aim to respond during published business hours. Response times can vary with workload.",
      },
    ],
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: categories.flatMap(({ faqs }) =>
    faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    }))
  ),
};

export default async function FAQPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <script
        nonce={nonce}
        suppressHydrationWarning
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main className="pb-24 pt-24">
        <PageContainer size="narrow">
          <PageIntro
            eyebrow="FAQ"
            title="Questions answered."
            description={
              <>
              Need help with a specific device?{" "}
              <a href={BUSINESS.phoneHref} className="text-primary hover:underline">
                Call us
              </a>
              .
              </>
            }
            className="lg:grid-cols-1"
          />

          <PageSection className="space-y-14">
            {categories.map(({ name, faqs }) => (
              <section key={name}>
                <h2 className="eyebrow mb-5 text-muted-foreground">
                  {name}
                </h2>
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                  {faqs.map(({ q, a }) => (
                    <details key={q} className="group border-b border-border last:border-b-0">
                      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface">
                        <span className="text-sm font-medium text-foreground">
                          {q}
                        </span>
                        <span
                          aria-hidden="true"
                          className="text-lg text-muted-foreground transition-transform group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <div className="px-5 pb-5 pr-10">
                        <p className="text-sm leading-6 text-muted-foreground">
                          {a}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </PageSection>

          <PageSection bordered={false} className="text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
              Still have questions?
            </h2>
            <p className="text-[15px] text-muted-foreground mb-8 max-w-sm mx-auto">
              Contact the team before submitting a repair request.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="btn-primary h-10 rounded-lg px-6 text-[13px]">
                <Link href="/contact">Send a message</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl h-10 px-6 text-[13px] border-border hover:bg-muted">
                <a href={BUSINESS.phoneHref}>Call {BUSINESS.phoneDisplay}</a>
              </Button>
            </div>
          </PageSection>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
