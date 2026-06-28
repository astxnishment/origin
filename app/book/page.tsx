import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "./BookingForm";
import { BUSINESS } from "@/lib/constants";
import {
  getDeviceById,
  slugToBrand,
  slugToRepairType,
  type Brand,
  type RepairType,
} from "@/lib/calculatorData";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Book a Repair — Leeds | Origin Repairs",
  description:
    "Book your device repair online at Origin Repairs, Leeds. Select your device, choose a time slot and we'll confirm within the hour. Walk-ins also welcome at 76 Cookridge Street.",
};

interface PageProps {
  searchParams: Promise<{ brand?: string; model?: string; repair?: string }>;
}

export default async function BookRepairPage({ searchParams }: PageProps) {
  // Read query params server-side — no useSearchParams needed, no Suspense needed
  const params = await searchParams;
  const prefillModel = params.model ? getDeviceById(params.model) : undefined;
  const prefillBrand: Brand | undefined =
    prefillModel?.brand ?? slugToBrand(params.brand ?? "") ?? undefined;
  const prefillRepair: RepairType | undefined =
    slugToRepairType(params.repair ?? "") ?? undefined;

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* ── Static header — always SSR'd, visible without JS ── */}
          <div className="pt-10 pb-10">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              Book a Repair
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
              Schedule your repair.
            </h1>
            <p className="text-[15px] text-muted-foreground max-w-md">
              Fill in the form and we&apos;ll confirm your slot by email within the hour.
              Walk-ins always welcome.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 lg:gap-16">
            {/* ── Client form ── */}
            <div>
              {/* No Suspense — BookingForm is SSR'd as a client component */}
              <BookingForm
                prefillBrand={prefillBrand}
                prefillModelId={prefillModel?.id}
                prefillRepair={prefillRepair}
              />

              {/* noscript fallback — visible only when JS is disabled */}
              <noscript>
                <div className="mt-8 p-6 rounded-xl border border-border bg-card text-center">
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
            <aside className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Visit us
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
              </div>

              <div className="rounded-xl border border-border bg-card p-6 space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  What to expect
                </p>
                {[
                  "Free assessment — no charge if you don't proceed",
                  "Fixed price confirmed before any work starts",
                  "12-month warranty on eligible repairs",
                  "Most screen & battery repairs completed same day",
                  "Walk-ins welcome — no appointment needed for most repairs",
                ].map((item) => (
                  <div key={item} className="flex gap-2.5 text-[13px] text-muted-foreground">
                    <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
