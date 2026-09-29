import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BUSINESS } from "@/lib/constants";
import { CONTACT_ONLY_MODE } from "@/lib/business-config";
import { WARRANTY_NOTICE } from "@/lib/warranty";
import {
  PageContainer,
  PageIntro,
  PageSection,
} from "@/components/layout/PageContainer";

export const metadata: Metadata = pageMetadata("/warranty", {
  title: "Warranty Terms",
  description:
    "How repair-specific part and workmanship warranty terms are confirmed by Origin Repairs.",
});

export default function WarrantyPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="pt-24 pb-24">
        <PageContainer size="narrow">
          <PageIntro
            eyebrow="Legal"
            title="Warranty Terms"
            description={
              <>
              Last updated: 22 September 2026
              </>
            }
            className="lg:grid-cols-1"
          />

          <PageSection bordered={false} className="space-y-10 text-[14px] leading-7 text-muted-foreground">
            <section className="panel-muted p-5">
              <p className="font-medium text-foreground">{WARRANTY_NOTICE}</p>
              <p className="mt-2 text-[12px]">
                Any repair warranty is additional to your statutory consumer
                rights. Those rights can apply even if no separate warranty is
                offered or its stated period has ended.
              </p>
            </section>

            <section className="border-b border-border pb-10">
              <h2 className="text-[16px] font-semibold text-foreground mb-3">
                1. Repair-specific term
              </h2>
              <p>
                The applicable warranty may be diagnostic only, not applicable,
                one month, three months, six months, twelve months, twelve
                months on supplied parts, or confirmed after inspection. The
                term shown in the accepted quote and repair record applies.
              </p>
            </section>

            <section className="border-b border-border pb-10">
              <h2 className="text-[16px] font-semibold text-foreground mb-3">
                2. Parts and workmanship
              </h2>
              <p>
                A supplied-part warranty concerns a defect in the specific part
                supplied by Origin Repairs. A workmanship warranty concerns the
                installation or repair work carried out by Origin Repairs. A
                claim concerns the part or work identified in the accepted
                quote. We assess the reported issue and explain our findings
                without limiting any statutory right or remedy.
              </p>
            </section>

            <section className="border-b border-border pb-10">
              <h2 className="text-[16px] font-semibold text-foreground mb-3">
                3. Repair categories
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-foreground">Batteries:</strong> the
                  term in the accepted quote applies; normal capacity reduction
                  and unrelated charging faults are not treated as a supplied
                  part defect.
                </li>
                <li>
                  <strong className="text-foreground">Liquid damage:</strong>{" "}
                  corrosion can continue after treatment, so coverage may be
                  limited or unavailable and must be confirmed in writing.
                </li>
                <li>
                  <strong className="text-foreground">Board-level work:</strong>{" "}
                  coverage is limited to the identified repair and does not
                  imply coverage for unrelated board faults.
                </li>
                <li>
                  <strong className="text-foreground">
                    Diagnostics and data recovery:
                  </strong>{" "}
                  a successful recovery is not guaranteed. Any additional
                  warranty is stated separately; our duty to use reasonable
                  care and skill still applies to the agreed service.
                </li>
                <li>
                  <strong className="text-foreground">
                    Customer-supplied parts:
                  </strong>{" "}
                  Origin Repairs does not provide a warranty for the part
                  itself. Any workmanship term must be stated in the quote.
                </li>
              </ul>
            </section>

            <section className="border-b border-border pb-10">
              <h2 className="text-[16px] font-semibold text-foreground mb-3">
                4. Subsequent damage
              </h2>
              <p>
                New accidental damage, liquid ingress, impact, normal wear or
                an unrelated fault is assessed separately. Later software
                changes or third-party work affect a claim only where relevant
                to the reported fault; they do not automatically remove your
                statutory rights.
              </p>
            </section>

            <section className="border-b border-border pb-10">
              <h2 className="text-[16px] font-semibold text-foreground mb-3">
                5. Making a claim
              </h2>
              <p>
                Contact us with the repair reference and a description of the
                fault. Keep the receipt, accepted quote or other proof of the
                repair. We will explain how to arrange an inspection and whether
                the issue falls within the warranty or your statutory rights.
                We discuss any separate charge before you agree to it. Where a
                remedy is due, we explain the repair, replacement, repeat
                performance or refund available in the circumstances.
              </p>
            </section>

            <section className="border-b border-border pb-10">
              <h2 className="text-[16px] font-semibold text-foreground mb-3">
                6. Statutory rights
              </h2>
              <p>
                These terms do not replace or restrict your statutory consumer
                rights. A description such as “diagnostic only”, “not applicable”
                or “confirmed after inspection” concerns the additional warranty;
                it does not exclude our legal responsibilities for the service
                or goods supplied.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">
                7. Contact
              </h2>
              <p>
                {CONTACT_ONLY_MODE ? "Call " : (
                  <>
                    Email{" "}
                    <a
                      href={`mailto:${BUSINESS.email}`}
                      className="text-primary underline underline-offset-4"
                    >
                      {BUSINESS.email}
                    </a>{" "}
                    or call{" "}
                  </>
                )}
                <a
                  href={BUSINESS.phoneHref}
                  className="text-primary underline underline-offset-4"
                >
                  {BUSINESS.phoneDisplay}
                </a>
                .
              </p>
            </section>
          </PageSection>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
