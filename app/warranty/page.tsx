import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Warranty Terms | Origin Repairs",
  description: "Origin Repairs 12-month warranty terms. What's covered, what's excluded, and how to make a claim.",
};

export default function WarrantyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-24">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <div className="pt-10 pb-10 border-b border-border mb-10">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">Legal</p>
            <h1 className="text-4xl font-semibold tracking-tight mb-4">Warranty Terms</h1>
            <p className="text-[13px] text-muted-foreground">Last updated: June 2025</p>
          </div>

          <div className="prose prose-invert prose-sm max-w-none space-y-8 text-[14px] text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">1. What is covered</h2>
              <p>
                Origin Repairs provides a <strong className="text-foreground">12-month warranty</strong> on eligible repairs. The warranty only applies where our assessment confirms the fault was caused by our installation, workmanship, or a part supplied by us. If the same fault returns due to our repair, we will fix it free of charge.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">2. What is not covered</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Accidental damage occurring after the repair (drops, liquid ingress, impact)</li>
                <li>Damage caused by unauthorised third-party repair attempts after our work</li>
                <li>Normal wear and tear on batteries (battery capacity naturally degrades over time)</li>
                <li>Pre-existing faults unrelated to the repair carried out</li>
                <li>Cosmetic damage not related to the repaired component</li>
                <li>Software issues, including iOS or Android updates that affect device function</li>
                <li>Water damage on devices that had prior liquid damage before our repair</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">3. Eligible repairs</h2>
              <p>
                The 12-month warranty applies to screen replacements, battery replacements, charging port repairs, camera repairs, and speaker/microphone repairs carried out using OEM-grade parts. Diagnostic services and water damage assessments are not covered under this warranty. Complex data recovery is subject to a separate service agreement.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">4. How to make a claim</h2>
              <p>
                Return to our workshop at {BUSINESS.address} with your device and proof of repair (receipt or booking confirmation). We will assess the fault and, if it falls within warranty, carry out the repair at no cost to you. We aim to resolve warranty repairs same day where possible.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">5. Your statutory rights</h2>
              <p>
                This warranty is in addition to your statutory rights under the Consumer Rights Act 2015 and does not affect them.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">6. Contact</h2>
              <p>
                Questions about your warranty? Email <a href={`mailto:${BUSINESS.email}`} className="text-primary hover:underline">{BUSINESS.email}</a> or call <a href={`tel:${BUSINESS.phone}`} className="text-primary hover:underline">{BUSINESS.phoneDisplay}</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
