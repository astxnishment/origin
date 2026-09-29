import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BUSINESS, FEATURES } from "@/lib/constants";
import { CONTACT_ONLY_MODE } from "@/lib/business-config";
import { WARRANTY_NOTICE } from "@/lib/warranty";
import {
  PageContainer,
  PageIntro,
  PageSection,
} from "@/components/layout/PageContainer";

export const metadata: Metadata = pageMetadata("/terms", {
  title: "Repair Terms",
  description:
    "Terms for estimates, assessments, repairs, data work and customer approvals at Origin Repairs.",
});

const sections = [
  {
    title: "Estimates, assessment and approval",
    body: "Website prices are estimates. Some models are listed for enquiries until repair feasibility and parts are confirmed. We explain the proposed work, total price including any applicable taxes, diagnostic charges and delivery charges before you agree. Repair work begins only after you approve the scope and price. Additional work or a price change needs your further approval.",
  },
  {
    title: "Parts and manufacturer messages",
    body: "The quote identifies whether the proposed part is compatible aftermarket, refurbished original, pulled original or a genuine service part. We check availability before repair and explain known limitations, including calibration, battery-health or repair-history messages. A genuine part description does not mean that Origin Repairs is authorised by the device manufacturer.",
  },
  {
    title: "Customer-supplied parts",
    body: "If we agree to fit your part, we first discuss its suitability and any known limitations. We do not provide a separate warranty for a part supplied by someone else. We remain responsible for carrying out the agreed installation with reasonable care and skill, and any additional workmanship warranty is recorded in the quote.",
  },
  {
    title: "Data and device access",
    body: "Back up important data before repair whenever possible. Repairs can expose pre-existing storage faults and data recovery can never be guaranteed. Access to personal files, accounts or credentials must be limited to what is necessary for the agreed work and requires the customer's consent. Recovered data and transfer arrangements are agreed separately.",
  },
  {
    title: "Liquid damage and data recovery",
    body: "Liquid-damaged devices and failed storage media require assessment. Corrosion or hidden damage can progress after an initial repair. Recovery work is an attempt, not a promise of a result. A specialist laboratory referral, additional work or revised quote requires customer approval.",
  },
  {
    title: "Repair time and unrepairable devices",
    body: "Published repair times are estimates, not guaranteed completion dates. Parts availability, fault complexity and testing can change the timescale. If a device cannot be repaired within the approved scope, the team will explain the available next step and any assessment charge already agreed.",
  },
  {
    title: "Payment and collection",
    body: "The amount due, accepted payment method and release or return arrangements are confirmed with the customer. Devices are normally released after the agreed amount has been paid. Origin Repairs will make reasonable attempts to contact a customer about completed or unrepairable work.",
  },
  {
    title: "Uncollected devices",
    body: "Please keep your contact details current and arrange collection or return when we contact you. We will make reasonable attempts to reach you about an uncollected device. We will not treat it as abandoned or dispose of it without appropriate notice and a lawful process. Any storage charge must be disclosed and agreed in advance.",
  },
  {
    title: "Warranty",
    body: `${WARRANTY_NOTICE} Any additional warranty covers the supplied part or workmanship identified in your repair record. It does not replace your statutory rights. See the repair warranty page for claim steps.`,
  },
  {
    title: "Statutory rights",
    body: "We must perform services with reasonable care and skill. If a service does not meet the applicable legal standard, you may be entitled to repeat performance or an appropriate price reduction. Rights also apply to goods we supply. Nothing in these terms or a warranty limits rights or liabilities that cannot lawfully be excluded. The law of England and Wales applies subject to your mandatory consumer protections.",
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="pb-24 pt-24">
        <PageContainer size="narrow">
          <PageIntro
            eyebrow="Legal"
            title="Repair Terms"
            description={
              <>
              Last updated: 22 September 2026
              </>
            }
            className="lg:grid-cols-1"
          />

          <PageSection bordered={false} className="space-y-10 text-[14px] leading-7 text-muted-foreground">
            <section className="border-b border-border pb-10">
              <h2 className="mb-3 text-[16px] font-semibold text-foreground">
                Service provider
              </h2>
              <p>
                {BUSINESS.name} provides device assessment and repair services
                from {BUSINESS.address}. An online repair request asks the team
                to confirm availability; it does not reserve a time or create
                an accepted repair contract by itself.
              </p>
            </section>

            {sections.map((section, index) => (
              <section key={section.title} className="border-b border-border pb-10">
                <h2 className="mb-3 text-[16px] font-semibold text-foreground">
                  {index + 2}. {section.title}
                </h2>
                <p>{section.body}</p>
                {section.title === "Warranty" && (
                  <Link
                    href="/warranty"
                    className="mt-2 inline-block text-primary underline underline-offset-4"
                  >
                    Read the repair warranty
                  </Link>
                )}
              </section>
            ))}

            <section className="border-b border-border pb-10">
              <h2 className="mb-3 text-[16px] font-semibold text-foreground">
                Cancelling a request or service
              </h2>
              <p>
                Contact us to withdraw an unaccepted request. For a consumer
                service contract agreed online, by phone or by post, you normally
                have 14 days to cancel, starting the day after the contract is
                agreed. Tell us clearly by {CONTACT_ONLY_MODE ? "phone or post" : "email, phone or post"}; you do not have
                to use the form below.
              </p>
              <p className="mt-3">
                Work within that period needs your express request. If you then
                cancel, you may owe a proportionate amount for work already
                supplied where the legal conditions are met. The cancellation
                right ends after full performance only if you requested the early
                start and acknowledged this consequence. Any refund due is made
                within the applicable legal deadline. These rules do not remove
                rights concerning faulty goods or services.
              </p>
              <div className="mt-4 rounded-lg border border-border p-4">
                <h3 className="font-semibold text-foreground">Optional cancellation form</h3>
                <p className="mt-2">To: {BUSINESS.name}, {BUSINESS.address}{!CONTACT_ONLY_MODE && `, ${BUSINESS.email}`}.</p>
                <p className="mt-2">
                  I give notice that I cancel my contract for the following
                  service: [service and repair reference]. Ordered on: [date].
                  Name: [your name]. Address: [your address]. Date: [today&apos;s
                  date]. Signature: [only if sent on paper].
                </p>
              </div>
            </section>

            {FEATURES.mailInEnabled && (
              <section className="border-b border-border pb-10">
                <h2 className="mb-3 text-[16px] font-semibold text-foreground">
                  Mail-in repairs
                </h2>
                <p>
                  Wait for our acceptance and shipping instructions before
                  sending a device. We confirm who arranges and pays for each
                  journey, the return method and any insurance before dispatch.
                  Follow the agreed packaging and carrier requirements and keep
                  proof of posting. Tell us promptly about a lost or damaged
                  parcel so we can help establish what happened. Shipping
                  arrangements do not remove your statutory rights or our
                  responsibility where the law makes us liable.
                </p>
              </section>
            )}

            {FEATURES.trackingEnabled && (
              <section className="border-b border-border pb-10">
                <h2 className="mb-3 text-[16px] font-semibold text-foreground">Repair tracking</h2>
                <p>
                  Sign in using the email from your repair request to see the
                  latest status recorded by the team. Keep sign-in links private.
                  A status update is progress information; a requested time,
                  estimated completion or notification does not replace an
                  agreed quote or collection instruction. Contact us if an
                  update needs clarification.
                </p>
              </section>
            )}

            <section>
              <h2 className="mb-3 text-[16px] font-semibold text-foreground">
                Questions or complaints
              </h2>
              <p>
                {CONTACT_ONLY_MODE ? (
                  <>Raise questions or complaints, with your repair reference and the outcome you are seeking, by phone on{" "}</>
                ) : (
                  <>
                    Send questions or complaints, with your repair reference and
                    the outcome you are seeking, to{" "}
                    <a
                      href={`mailto:${BUSINESS.email}`}
                      className="text-primary underline underline-offset-4"
                    >
                      {BUSINESS.email}
                    </a>{" "}
                    or raised by phone on{" "}
                  </>
                )}
                <a
                  href={BUSINESS.phoneHref}
                  className="text-primary underline underline-offset-4"
                >
                  {BUSINESS.phoneDisplay}
                </a>
                . We will review the circumstances and explain the proposed
                resolution and any relevant next steps.
              </p>
            </section>
          </PageSection>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
