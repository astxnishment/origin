import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BUSINESS, FEATURES } from "@/lib/constants";
import { WARRANTY_NOTICE } from "@/lib/warranty";

export const metadata: Metadata = {
  title: "Repair Terms | Origin Repairs",
  description:
    "Terms for estimates, assessments, repairs, data work and customer approvals at Origin Repairs.",
};

const sections = [
  {
    title: "Estimates, assessment and approval",
    body: "Website prices are estimates based on the selected device and repair record. The device may need inspection before the cause, part requirement and final price are known. Any diagnostic charge is explained before that work begins. Repair work does not begin until the customer approves the quoted scope and price.",
  },
  {
    title: "Parts and manufacturer messages",
    body: "The part description in the quote identifies whether an option is compatible aftermarket, refurbished original, pulled original or a genuine service part. Availability is checked before repair. Some devices may display a parts, calibration, battery-health or repair-history message after a third-party repair; any known limitation relevant to the selected option should be explained before approval.",
  },
  {
    title: "Customer-supplied parts",
    body: "Where Origin Repairs agrees to fit a customer-supplied part, the customer remains responsible for that part's suitability, condition and supplier warranty. Workmanship cover may still apply to the installation, but the supplied part itself is not covered by Origin Repairs.",
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
    body: "Origin Repairs will not treat a device as abandoned or dispose of it without reasonable contact attempts, appropriate notice and a process consistent with applicable law. The final notice period and procedure require owner and legal confirmation before launch.",
  },
  {
    title: "Warranty",
    body: `${WARRANTY_NOTICE} Cover applies only where assessment shows the reported fault was caused by Origin Repairs' installation, workmanship or a part supplied by Origin Repairs. See the repair warranty page for exclusions and claim steps.`,
  },
  {
    title: "Statutory rights",
    body: "Nothing in these terms excludes or restricts rights or remedies that cannot lawfully be excluded, including applicable UK consumer rights. These terms are intended to be governed by the law of England and Wales, subject to the customer's mandatory rights.",
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pb-24 pt-24">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <header className="mb-10 border-b border-border pb-10 pt-10">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
              Legal
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">
              Repair Terms
            </h1>
            <p className="mt-4 text-[13px] text-muted-foreground">
              Last updated: 29 July 2026
            </p>
          </header>

          <div className="mb-10 rounded-md border border-border bg-surface p-5 text-[12px] leading-6 text-muted-foreground">
            Draft launch terms. The business identity, payment, uncollected
            device procedure and final wording must be reviewed by a qualified
            UK legal professional before production use.
          </div>

          <div className="space-y-8 text-[14px] leading-relaxed text-muted-foreground">
            <section>
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
              <section key={section.title}>
                <h2 className="mb-3 text-[16px] font-semibold text-foreground">
                  {index + 2}. {section.title}
                </h2>
                <p>{section.body}</p>
                {section.title === "Warranty" && (
                  <Link
                    href="/warranty"
                    className="mt-2 inline-block text-primary hover:underline"
                  >
                    Read the repair warranty
                  </Link>
                )}
              </section>
            ))}

            {FEATURES.mailInEnabled && (
              <section>
                <h2 className="mb-3 text-[16px] font-semibold text-foreground">
                  Mail-in repairs
                </h2>
                <p>
                  A mail-in request must be accepted before dispatch. The
                  customer is responsible for appropriate packaging and for
                  the device while it is with the outbound carrier. Shipping,
                  insurance, return cost and return method are confirmed before
                  the device is sent or work is approved.
                </p>
              </section>
            )}

            <section>
              <h2 className="mb-3 text-[16px] font-semibold text-foreground">
                Contact
              </h2>
              <p>
                Questions can be sent to{" "}
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="text-primary hover:underline"
                >
                  {BUSINESS.email}
                </a>{" "}
                or raised by phone on{" "}
                <a
                  href={BUSINESS.phoneHref}
                  className="text-primary hover:underline"
                >
                  {BUSINESS.phoneDisplay}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
