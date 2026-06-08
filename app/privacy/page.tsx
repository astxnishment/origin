import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy | Origin Repairs",
  description: "How Origin Repairs collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-24">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <div className="pt-10 pb-10 border-b border-border mb-10">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">Legal</p>
            <h1 className="text-4xl font-semibold tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-[13px] text-muted-foreground">Last updated: June 2025</p>
          </div>

          <div className="space-y-8 text-[14px] text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">1. Who we are</h2>
              <p>
                Origin Repairs, {BUSINESS.address}. We repair electronic devices. This policy explains how we handle personal data collected via our website and in-store.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">2. What data we collect</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong className="text-foreground">Contact details</strong> — name, email address, phone number (collected when you book or contact us)</li>
                <li><strong className="text-foreground">Device information</strong> — brand, model, and description of the fault (to process your repair)</li>
                <li><strong className="text-foreground">Booking details</strong> — preferred date and time</li>
                <li><strong className="text-foreground">Website usage</strong> — standard server logs and anonymous analytics (no tracking cookies beyond what is necessary)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">3. How we use your data</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>To confirm your booking and send repair status updates</li>
                <li>To contact you about your device</li>
                <li>To manage our repair records</li>
                <li>We do <strong className="text-foreground">not</strong> sell your data, share it with advertisers, or use it for automated decision-making</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">4. Device data safety</h2>
              <p>
                We do not access the personal files, photos, or accounts on your device during repair. For laptop and data recovery work, we advise customers to back up before dropping off. Where data recovery is the purpose of the repair, a separate consent process applies.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">5. Data retention</h2>
              <p>
                Booking and repair records are retained for up to 3 years for warranty and accounting purposes, then securely deleted. You can request deletion at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">6. Your rights</h2>
              <p>
                Under UK GDPR you have the right to access, correct, or delete your personal data. To exercise these rights, email <a href={`mailto:${BUSINESS.email}`} className="text-primary hover:underline">{BUSINESS.email}</a>.
              </p>
            </section>

            <section>
              <h2 className="text-[16px] font-semibold text-foreground mb-3">7. Contact</h2>
              <p>
                For privacy questions: <a href={`mailto:${BUSINESS.email}`} className="text-primary hover:underline">{BUSINESS.email}</a> or {BUSINESS.address}.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
