import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "./BookingForm";
import {
  PageContainer,
  PageIntro,
} from "@/components/layout/PageContainer";
import { BUSINESS, FEATURES } from "@/lib/constants";
import { WARRANTY_NOTICE } from "@/lib/warranty";
import {
  getDeviceById,
  slugToBrand,
  slugToRepairType,
  type Brand,
  type RepairType,
} from "@/lib/calculatorData";
import { Phone, Mail, MapPin, Clock, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Request a Repair — Leeds | Origin Repairs",
  description:
    "Request a device repair assessment in Leeds. Select your device, preferred time and part option, and Origin Repairs will confirm availability.",
};

interface PageProps {
  searchParams: Promise<{
    brand?: string;
    model?: string;
    repair?: string;
    tier?: string;
    method?: string;
    device?: string;
    deviceName?: string;
    issue?: string;
  }>;
}

export default async function BookRepairPage({ searchParams }: PageProps) {
  if (!FEATURES.bookingEnabled) notFound();

  const params = await searchParams;
  const brandFromUrl = slugToBrand(params.brand ?? "") ?? undefined;
  const prefillModel = params.model
    ? getDeviceById(params.model, brandFromUrl)
    : undefined;
  const prefillBrand: Brand | undefined =
    prefillModel?.brand ?? brandFromUrl;
  const prefillRepair: RepairType | undefined =
    slugToRepairType(params.repair ?? "") ?? undefined;
  const prefillServiceMethod =
    FEATURES.mailInEnabled && params.method === "mail-in"
      ? "mail-in"
      : "drop-off";

  return (
    <>
      <Navbar />

      <main className="pb-20 pt-16 md:pb-28 md:pt-[72px]">
        <PageContainer>
          <PageIntro
            eyebrow="Repair request"
            title="Tell us what needs fixing."
            description="Choose your device, repair and preferred time. The team will check availability and contact you with the next step."
          />

          <div className="grid grid-cols-1 items-start gap-8 py-8 sm:py-12 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)] lg:gap-10">
            {/* ── Client form ── */}
            <div className="panel bg-card p-5 sm:p-8">
              {/* No Suspense — BookingForm is SSR'd as a client component */}
              <BookingForm
                prefillBrand={prefillBrand}
                prefillModelId={prefillModel?.id}
                prefillRepair={prefillRepair}
                prefillPartTierId={params.tier}
                prefillServiceMethod={prefillServiceMethod}
                prefillDeviceType={params.device}
                prefillDeviceName={params.deviceName}
                prefillIssue={params.issue}
              />

              {/* noscript fallback — visible only when JS is disabled */}
              <noscript>
                <div className="mt-8 border-t border-border p-6 text-center">
                  <p className="text-[14px] text-foreground font-semibold mb-2">
                    JavaScript is required to use the online booking form.
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    Please call{" "}
                    <a href={`tel:${BUSINESS.phone}`} className="text-primary underline">
                      {BUSINESS.phoneDisplay}
                    </a>{" "}
                    or email{" "}
                    <a href={`mailto:${BUSINESS.email}`} className="text-primary underline">
                      {BUSINESS.email}
                    </a>{" "}
                    to book your repair.
                  </p>
                </div>
              </noscript>
            </div>

            {/* ── Static info sidebar — always visible, no JS needed ── */}
            <aside className="panel-muted p-5 sm:p-6">
              <div className="space-y-5">
                <p className="eyebrow">
                  Contact details
                </p>

                <a
                  href={`tel:${BUSINESS.phone}`}
                  className="flex items-start gap-3 group"
                >
                  <Phone className="h-4 w-4 text-[color:var(--icon-fg)] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[12px] text-muted-foreground">Phone</p>
                    <p className="text-[14px] font-medium text-foreground group-hover:text-primary transition-colors">
                      {BUSINESS.phoneDisplay}
                    </p>
                  </div>
                </a>

                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="flex items-start gap-3 group"
                >
                  <Mail className="h-4 w-4 text-[color:var(--icon-fg)] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[12px] text-muted-foreground">Email</p>
                    <p className="text-[14px] font-medium text-foreground group-hover:text-primary transition-colors">
                      {BUSINESS.email}
                    </p>
                  </div>
                </a>

                <a
                  href={BUSINESS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3"
                >
                  <MapPin className="h-4 w-4 text-[color:var(--icon-fg)] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[12px] text-muted-foreground">Address</p>
                    <address className="not-italic text-[14px] font-medium text-foreground transition-colors group-hover:text-primary">
                      76 Cookridge Street
                      <br />
                      Leeds, LS2 8GL
                    </address>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-[color:var(--icon-fg)] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[12px] text-muted-foreground">Opening hours</p>
                    <p className="text-[14px] font-medium text-foreground">Mon–Fri: 9am–6pm</p>
                    <p className="text-[14px] font-medium text-foreground">Sat: 10am–4pm</p>
                  </div>
                </div>

                {FEATURES.mailInEnabled && (
                  <Link href="/mail-in" className="group flex items-start gap-3">
                    <Package className="h-4 w-4 text-[color:var(--icon-fg)] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[12px] text-muted-foreground">Mail-in repairs</p>
                      <p className="text-[14px] font-medium text-foreground transition-colors group-hover:text-primary">
                        View packing and postage guidance
                      </p>
                    </div>
                  </Link>
                )}
              </div>

              <div className="mt-7 space-y-3 border-t border-border pt-6">
                <p className="eyebrow">
                  What to expect
                </p>
                {[
                  "Your preferred time is a request until the team confirms it",
                  "The price is agreed before repair work begins",
                  "Repair time is estimated from the selected service",
                  WARRANTY_NOTICE,
                ].map((item) => (
                  <div key={item} className="flex gap-2.5 text-[13px] text-muted-foreground">
                    <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
}
