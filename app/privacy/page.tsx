import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Notice | Origin Repairs",
  description:
    "How Origin Repairs uses contact, repair and website data when handling enquiries and repair requests.",
};

export default function PrivacyPage() {
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
              Privacy Notice
            </h1>
            <p className="mt-4 text-[13px] text-muted-foreground">
              Last updated: 29 July 2026
            </p>
          </header>

          <div className="mb-10 rounded-md border border-border bg-surface p-5 text-[12px] leading-6 text-muted-foreground">
            Draft launch notice. The owner must confirm the legal data
            controller identity, retention schedule and processor agreements,
            then obtain qualified UK privacy review before production use.
          </div>

          <div className="space-y-8 text-[14px] leading-relaxed text-muted-foreground">
            <PolicySection title="Who controls the data">
              <p>
                {BUSINESS.name}, {BUSINESS.address}, is the contact point for
                personal data used to respond to enquiries and provide repair
                services. Privacy requests can be sent to{" "}
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="text-primary hover:underline"
                >
                  {BUSINESS.email}
                </a>
                . The owner must add the verified legal entity or sole-trader
                identity before launch.
              </p>
            </PolicySection>

            <PolicySection title="Data collected">
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Name, email address, phone number and contact consent.</li>
                <li>Device type, brand, model, fault description and selected repair.</li>
                <li>Preferred appointment date, time and service method.</li>
                <li>A return address only when an enabled mail-in service is selected.</li>
                <li>Technical request data used for security, such as IP-derived rate-limit state, timestamps and server logs.</li>
                <li>Device data accessed only where the agreed repair or recovery work requires it and the customer has consented.</li>
              </ul>
            </PolicySection>

            <PolicySection title="Purposes and lawful bases">
              <ul className="list-disc space-y-1.5 pl-5">
                <li>To respond to a requested quote or repair request and take steps before a service contract.</li>
                <li>To perform an approved repair contract and communicate about the device.</li>
                <li>To maintain necessary accounting, warranty and dispute records where required by law or legitimate business interests.</li>
                <li>To prevent spam, duplicate submissions and service abuse under legitimate interests.</li>
                <li>To access personal device data only with explicit customer instructions appropriate to the recovery or diagnostic work.</li>
              </ul>
            </PolicySection>

            <PolicySection title="Service providers and transfers">
              <p>
                The website is hosted by Vercel. Form notifications use Resend
                when production email delivery is enabled. The contact page can
                load a Google Maps embed after customer interaction. Cloudflare
                Turnstile may be enabled for spam protection. These providers
                may process technical or contact data outside the UK; the
                controller must verify the applicable contract and transfer
                safeguard before enabling production processing.
              </p>
            </PolicySection>

            <PolicySection title="Analytics, storage and cookies">
              <p>
                No advertising or behavioural analytics are configured in this
                repository. The site stores a light or dark theme preference in
                the browser. During a repair request it can also retain
                non-sensitive device, repair and preferred-time selections for
                the current browser session; contact details and fault
                descriptions are not included in that draft. A consent banner
                is not shown because no
                non-essential cookie or equivalent tracking is currently
                enabled. This notice and consent approach must be updated before
                adding analytics, advertising or other non-essential storage.
              </p>
            </PolicySection>

            <PolicySection title="Retention">
              <p>
                Enquiry, repair, accounting and warranty information must be
                kept only for the verified business, legal and service period,
                then deleted or anonymised. The production retention schedule
                has not been confirmed in the repository and must be completed
                by the owner before launch. Server and anti-spam logs should use
                the shortest operational period supported by the configured
                providers.
              </p>
            </PolicySection>

            <PolicySection title="Your rights">
              <p>
                Depending on the circumstances, UK data-protection law may give
                you rights to access, correct, erase or restrict personal data,
                object to processing, or receive portable data. You can raise a
                request using the email address above. Identity may need to be
                checked before information is released.
              </p>
              <p className="mt-3">
                You can also complain to the{" "}
                <a
                  href="https://ico.org.uk/make-a-complaint/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  UK Information Commissioner&apos;s Office
                </a>
                .
              </p>
            </PolicySection>

            <PolicySection title="Device and recovery data">
              <p>
                Back up a device before repair where possible. Routine hardware
                work does not normally require access to personal files.
                Diagnostics or recovery that does require access must be agreed
                with the customer. No recovery result or protection from
                pre-existing storage failure can be guaranteed.
              </p>
            </PolicySection>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-[16px] font-semibold text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}
