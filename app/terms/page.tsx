import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service | Origin Repairs",
  description: "Terms and conditions for repair services at Origin Repairs, Leeds.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-24">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <div className="pt-10 pb-10 border-b border-border mb-10">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">Legal</p>
            <h1 className="text-4xl font-semibold tracking-tight mb-4">Terms of Service</h1>
            <p className="text-[13px] text-muted-foreground">Last updated: June 2025</p>
          </div>

          <div className="space-y-8 text-[14px] text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">1. Agreement</h2>
              <p>
                By using our repair services or website, you agree to these terms. Origin Repairs operates from {BUSINESS.address}.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">2. Repair quotes</h2>
              <p>
                Online and in-store quotes are estimates based on the information provided. A fixed price is confirmed after free assessment of the device. No work begins until you approve the price. You are not obligated to proceed after an assessment.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">3. Payment</h2>
              <p>
                Payment is due on collection of your device. We accept cash and card. Devices will not be released until payment is made in full.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">4. Uncollected devices</h2>
              <p>
                Devices not collected within 90 days of repair completion, and where we have been unable to contact the customer, may be disposed of. We will make reasonable attempts to contact you before taking any action.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">5. Liability</h2>
              <p>
                We take care with every device. In the unlikely event that a device is damaged during repair, our liability is limited to the cost of the repair agreed. We strongly recommend backing up your data before any repair. We are not responsible for data loss.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">6. Warranty</h2>
              <p>
                Warranty cover applies only where our assessment confirms the fault was caused by our installation, workmanship, or a part supplied by us. It does not cover unrelated faults, accidental damage, liquid damage, misuse, normal wear and tear, or later third-party repair attempts. See our <a href="/warranty" className="text-primary hover:underline">Warranty Terms</a> for full details.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">7. Governing law</h2>
              <p>
                These terms are governed by the laws of England and Wales.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">8. Contact</h2>
              <p>
                Questions? Email <a href={`mailto:${BUSINESS.email}`} className="text-primary hover:underline">{BUSINESS.email}</a> or call <a href={`tel:${BUSINESS.phone}`} className="text-primary hover:underline">{BUSINESS.phoneDisplay}</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
