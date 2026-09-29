import { pageMetadata } from "@/lib/metadata";
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

export const metadata: Metadata = pageMetadata("/faq", {
  title: "Frequently Asked Questions",
  description:
    "Repair estimates, parts choices, warranty terms, turnaround and assessment questions for Origin Repairs.",
});

const categories = [
  {
    name: "Requests & estimates",
    faqs: [
      {
        q: "Does an online request reserve a time?",
        a: "An online submission asks us to confirm a repair and preferred time. Wait for confirmation before travelling or posting your device. Work begins only after you approve the scope and price.",
      },
      {
        q: "Can I get an estimate without requesting a time?",
        a: "Yes. The quote calculator shows published estimates and enquiry options for newer models. We confirm repair feasibility, parts and the final price before work begins.",
      },
      {
        q: "Are walk-ins available?",
        a: FEATURES.walkInsEnabled
          ? "You can visit during our published opening hours. Call ahead for complex work or repairs that may need parts ordered."
          : "Please contact us to arrange a visit before travelling.",
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
        a: "Depending on your model and availability, options may include compatible aftermarket, refurbished original, pulled original or genuine service parts. Your quote identifies the proposed option and any known limitations before you decide.",
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
        a: "The additional warranty covers the supplied part or workmanship identified in your accepted quote. We assess the reported fault and explain the available remedy. This does not replace or restrict your statutory consumer rights.",
      },
      {
        q: "Does it cover new accidental damage?",
        a: "New impact, liquid ingress or another unrelated fault is assessed separately. Later damage does not automatically remove rights relating to the original repair. See the warranty terms for claim steps.",
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
        a: "Some faults need extended diagnostic work. We explain any diagnostic charge and obtain your approval before that work begins.",
      },
      {
        q: "What happens before work starts?",
        a: "We explain the proposed repair, selected part, total price and any applicable delivery or assessment charges, estimated time and warranty for your approval.",
      },
      {
        q: "Can I cancel?",
        a: "Contact us to withdraw an unaccepted request. Consumer services agreed at a distance normally have a 14-day cancellation period. Starting work during that period needs your express request and can affect the amount payable if you cancel. Our repair terms explain this and include an optional cancellation form.",
      },
    ],
  },
  ...(FEATURES.mailInEnabled || FEATURES.trackingEnabled ? [{
    name: "Mail-in & tracking",
    faqs: [
      ...(FEATURES.mailInEnabled ? [{
        q: "Can I post my device to you?",
        a: "Yes. Request a mail-in repair and wait for acceptance and shipping instructions before posting it. We confirm packaging requirements, who arranges and pays for shipping, and return arrangements first. Keep proof of posting.",
      }] : []),
      ...(FEATURES.trackingEnabled ? [{
        q: "How do I track my repair?",
        a: "Open the tracking page and sign in using the email address from your repair request. The email sign-in link verifies access to your repairs. You can see the latest status and updates recorded by the team and use a repair reference to find a particular job. Keep sign-in links private and contact us if anything is unclear.",
      }] : []),
      {
        q: "How is my information used?",
        a: "We use your details to handle the request, carry out agreed work, return your device and provide updates. Account access uses an email sign-in link. Our privacy notice explains service providers, storage, retention and your rights. Do not send passwords or unrelated sensitive information in website forms.",
      },
    ],
  }] : []),
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
      <main id="main-content" tabIndex={-1} className="pb-24 pt-24">
        <PageContainer size="narrow">
          <PageIntro
            eyebrow="FAQ"
            title="Questions answered."
            description={
              <>
              Need help with a specific device?{" "}
              <a href={BUSINESS.phoneHref} className="text-primary underline underline-offset-4">
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
            <p className="mb-6 text-sm text-muted-foreground">
              Read our{" "}
              <Link href="/terms" className="text-primary underline underline-offset-4">repair terms</Link>,{" "}
              <Link href="/warranty" className="text-primary underline underline-offset-4">warranty terms</Link>{" "}
              and <Link href="/privacy" className="text-primary underline underline-offset-4">privacy notice</Link>.
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
