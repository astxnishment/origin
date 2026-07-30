import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/lib/constants";
import { PageContainer } from "@/components/layout/PageContainer";

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
      <main className="flex min-h-[72vh] items-center pb-20 pt-28">
        <PageContainer size="narrow" className="text-center">
          <div className="panel px-5 py-12 sm:px-12 sm:py-16">
          <p className="eyebrow mb-3 text-muted-foreground">
            Repair tracking
          </p>
          <h1 className="page-title mx-auto max-w-xl">
            Online tracking is not available yet.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-muted-foreground">
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
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
