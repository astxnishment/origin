import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BUSINESS } from "@/lib/constants";
import {
  PageContainer,
  PageIntro,
  PageSection,
} from "@/components/layout/PageContainer";

export const metadata: Metadata = pageMetadata("/privacy", {
  title: "Privacy Notice",
  description:
    "How Origin Repairs uses contact, repair and website data when handling enquiries and repair requests.",
});

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="pb-24 pt-24">
        <PageContainer size="narrow">
          <PageIntro
            eyebrow="Legal"
            title="Privacy Notice"
            description={
              <>
              Last updated: 25 September 2026
              </>
            }
            className="lg:grid-cols-1"
          />

          <PageSection bordered={false} className="space-y-10 text-[14px] leading-7 text-muted-foreground">
            <PolicySection title="Who controls the data">
              <p>
                {BUSINESS.name}, {BUSINESS.address}, is responsible for the
                personal data described in this notice. It covers enquiries,
                repair requests, mail-in repairs, customer accounts and repair
                tracking. Privacy requests can be sent to{" "}
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="text-primary underline underline-offset-4"
                >
                  {BUSINESS.email}
                </a>
                .
              </p>
            </PolicySection>

            <PolicySection title="Data collected">
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Your name, email address, phone number and messages to us.</li>
                <li>Live-chat messages, conversation history and any contact details you choose to provide in chat.</li>
                <li>Device make and model, fault description, selected repair, part and price information, warranty and your instructions.</li>
                <li>Preferred appointment, service method and return address for mail-in work.</li>
                <li>Repair references, status updates, customer-visible notes, timestamps and relevant staff activity.</li>
                <li>Email sign-in information and session records needed to provide account access.</li>
                <li>Technical security information, including IP addresses, browser information, request timestamps, anti-spam results and service logs.</li>
              </ul>
              <p className="mt-3">
                We receive this information from you, from staff handling your
                repair and from the website services you use. Required form
                fields identify information needed to respond or provide the
                requested service. Without it, we may need to contact you for
                details or be unable to process the request. Do not put passwords,
                payment-card details or unrelated sensitive information in forms.
              </p>
            </PolicySection>

            <PolicySection title="Purposes and lawful bases">
              <ul className="list-disc space-y-1.5 pl-5">
                <li><strong className="text-foreground">Contract:</strong> responding to your request, arranging and carrying out agreed work, returning devices and providing repair updates and account access.</li>
                <li><strong className="text-foreground">Legal obligations:</strong> keeping records required for tax, accounting and other applicable legal duties.</li>
                <li><strong className="text-foreground">Legitimate interests:</strong> protecting accounts and the website, preventing spam and fraud, managing warranty claims and resolving disputes. We balance these needs against your rights.</li>
                <li><strong className="text-foreground">Consent:</strong> where a separate optional use requires your consent, we explain it when asking. You may withdraw that consent without affecting earlier lawful processing.</li>
              </ul>
              <p className="mt-3">
                Repair emails concern your request or account. We do not use
                these details for advertising, and we do not make decisions with
                legal or similarly significant effects about you solely by
                automated means.
              </p>
            </PolicySection>

            <PolicySection title="Who receives the information">
              <p>
                Authorised staff and providers of website hosting, database
                storage, backups and technical support process information
                needed to run the service. Repair and customer records are
                stored in our service database. Resend handles transactional
                emails, including sign-in links and repair notifications.
                Cloudflare Turnstile checks form interactions for abuse.
                When you choose to start live chat, tawk.to handles the
                conversation and associated technical information, such as
                your IP address and browser details.
              </p>
              <p className="mt-3">
                Couriers receive the contact and delivery details needed for
                agreed shipping. If specialist repair or recovery work is
                needed, we discuss any referral with you first. We may disclose
                relevant records to professional advisers or public authorities
                when necessary for legal obligations or a claim. We do not sell
                personal information.
              </p>
              <p className="mt-3">
                Google receives technical information if you choose to load the
                map on our contact page. See the providers&apos; notices:{" "}
                <a href="https://resend.com/legal/privacy-policy" className="text-primary underline underline-offset-4">Resend</a>,{" "}
                <a href="https://www.cloudflare.com/privacypolicy/" className="text-primary underline underline-offset-4">Cloudflare</a>{" "}
                <a href="https://policies.google.com/privacy" className="text-primary underline underline-offset-4">Google</a>{" "}
                and <a href="https://www.tawk.to/privacy-policy/" className="text-primary underline underline-offset-4">tawk.to</a>.
              </p>
            </PolicySection>

            <PolicySection title="International processing">
              <p>
                Service providers may process information outside the UK.
                Where a transfer requires protection under UK data-protection
                law, we require an applicable adequacy arrangement or appropriate
                contractual safeguards. Contact us for information about the
                providers handling your records, processing locations and
                applicable safeguards, including how to obtain a copy.
              </p>
            </PolicySection>

            <PolicySection title="Analytics, storage and cookies">
              <p>
                This website does not use advertising or behavioural analytics.
                It uses the following storage to provide features you request:
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                <li><strong className="text-foreground">Sign-in cookie:</strong> keeps your account signed in for up to 30 days. Signing out removes it from that browser. Avoid staying signed in on a shared device.</li>
                <li><strong className="text-foreground">Theme preference:</strong> remembers your chosen light or dark display until you change it or clear browser storage.</li>
                <li><strong className="text-foreground">Repair-request draft:</strong> keeps device, repair and preferred-time selections in session storage while you complete the request. Contact details and fault descriptions are excluded. The draft is cleared after a successful request or when that browser session ends.</li>
                <li><strong className="text-foreground">Optional live chat:</strong> connects to tawk.to only after you select Start chat. The provider uses cookies and browser storage to operate and reconnect your conversation. Closing the chat disconnects the widget; it does not erase messages or existing chat cookies. You can use phone or email instead.</li>
              </ul>
              <p className="mt-3">
                Security checks help protect the forms and sign-in service.
                You can clear stored information using your browser settings;
                doing so can sign you out or reset your selections.
              </p>
            </PolicySection>

            <PolicySection title="Retention">
              <p>
                We keep information only while it is needed for its purpose.
                Enquiries are kept while we respond and resolve related
                questions. Repair and status records are retained for the work,
                return arrangements and relevant warranty or dispute period.
                Accounting records follow applicable legal requirements. A
                documented claim or legal obligation may require particular
                records to be kept longer.
              </p>
              <p className="mt-3">
                Account and security records are retained according to whether
                access is still needed and whether an incident needs investigation.
                We review records for deletion or anonymisation when these reasons
                end. Backup copies follow the backup replacement cycle rather
                than being used as a separate permanent record. Ask us for the
                retention criteria that apply to a particular repair.
              </p>
            </PolicySection>

            <PolicySection title="Your rights">
              <p>
                Depending on the circumstances, you can ask to access, correct,
                erase or restrict your data, object to processing based on
                legitimate interests, or receive portable data. These rights
                have legal conditions and exceptions. Contact us using the
                details above; we may need to verify your identity. We normally
                respond within one month and will explain any lawful extension.
              </p>
              <p className="mt-3">
                You can also complain to the{" "}
                <a
                  href="https://ico.org.uk/make-a-complaint/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  UK Information Commissioner&apos;s Office
                </a>
                .
              </p>
            </PolicySection>

            <PolicySection title="Device and recovery data">
              <p>
                Routine hardware repairs do not normally require access to
                personal files. If diagnostic or recovery work needs access,
                we agree the scope and instructions with you first and limit
                access to that work. Any temporary recovered copy is kept only
                for the agreed transfer and verification, then deleted when it
                is no longer needed. Back up your device where possible.
              </p>
            </PolicySection>

            <PolicySection title="Accounts and repair tracking">
              <p>
                Account access is verified through an email sign-in link.
                Sign in using the email from your repair request to see repairs
                linked to that account. A repair reference can filter the list.
                Keep your sign-in links private. Tracking shows
                the latest status and notes recorded by the team; it does not
                monitor your device&apos;s location. Staff access to repair
                management is restricted to authorised accounts.
              </p>
            </PolicySection>
          </PageSection>
        </PageContainer>
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
    <section className="border-b border-border pb-10 last:border-b-0">
      <h2 className="mb-3 text-[16px] font-semibold text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}
