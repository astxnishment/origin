import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Repair Tracking Unavailable",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrackingUnavailablePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] pt-24">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Repair tracking
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Online tracking is not available yet.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            For an update on a device already with us, contact the team and
            include the reference shown on your receipt.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <a href={BUSINESS.phoneHref}>Call {BUSINESS.phoneDisplay}</a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Origin Repairs</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
