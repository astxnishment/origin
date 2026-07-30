import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BUSINESS } from "@/lib/constants";
import { WARRANTY_NOTICE } from "@/lib/warranty";

export const metadata: Metadata = {
  title: "Warranty Terms",
  description:
    "How repair-specific part and workmanship warranty terms are confirmed by Origin Repairs.",
};

export default function WarrantyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-24">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <div className="pt-10 pb-10 border-b border-border mb-10">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              Legal
            </p>
            <h1 className="text-4xl font-semibold tracking-tight mb-4">
              Warranty Terms
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Last updated: 29 July 2026
            </p>
          </div>

          <div className="prose prose-invert prose-sm max-w-none space-y-8 text-[14px] text-muted-foreground leading-relaxed">
            <section className="rounded-md border border-border bg-surface p-5">
              <p className="font-medium text-foreground">{WARRANTY_NOTICE}</p>
              <p className="mt-2 text-[12px]">
                Draft policy: these terms require review by a qualified UK
                legal professional before launch.
              </p>
            </section>

            <section>
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

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">
                2. Parts and workmanship
              </h2>
              <p>
                A supplied-part warranty concerns a defect in the specific part
                supplied by Origin Repairs. A workmanship warranty concerns the
                installation or repair work carried out by Origin Repairs. A
                claim applies only where our assessment confirms that the fault
                actually resulted from our installation, workmanship, or a part
                supplied by us.
              </p>
            </section>

            <section>
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
                  diagnostic findings and recovery outcomes are not warranted
                  unless a separate written term is provided.
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

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">
                4. Subsequent damage
              </h2>
              <p>
                New accidental damage, liquid ingress, impact, unauthorised
                work after collection, software changes, normal wear, and faults
                unrelated to the authorised repair are assessed separately.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">
                5. Making a claim
              </h2>
              <p>
                Contact us with the repair reference and a description of the
                fault. We will inspect the device and confirm whether the issue
                falls within the written warranty for that repair. Keep the
                receipt or accepted quote.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">
                6. Statutory rights
              </h2>
              <p>
                These warranty terms are intended to operate alongside, and not
                replace or restrict, applicable statutory consumer rights.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">
                7. Contact
              </h2>
              <p>
                Email{" "}
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="text-primary hover:underline"
                >
                  {BUSINESS.email}
                </a>{" "}
                or call{" "}
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
