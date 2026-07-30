import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home } from "lucide-react";
import { FEATURES } from "@/lib/constants";
import { PageContainer } from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "Page Not Found | Origin Repairs",
  description: "The page you're looking for doesn't exist. Return to Origin Repairs Leeds for phone, tablet, laptop and console repairs.",
};

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="flex min-h-[76vh] items-center pb-20 pt-28">
        <PageContainer size="narrow" className="text-center">
          <p className="eyebrow mb-4 text-muted-foreground">
            Error 404
          </p>

          <p aria-hidden="true" className="mb-5 text-7xl font-semibold leading-none text-border sm:text-8xl">
            404
          </p>
          <h1 className="page-title mb-4">
            This page could not be found.
          </h1>
          <p className="mx-auto mb-9 max-w-md text-base leading-7 text-muted-foreground">
            The address may have changed. Return home or continue to the repair
            request to find the right service.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="btn-primary h-11 px-7 text-sm">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Back to homepage
              </Link>
            </Button>
            {FEATURES.bookingEnabled && (
              <Button asChild variant="outline" className="h-11 px-7 text-sm border-border hover:bg-surface">
                <Link href="/book" className="flex items-center gap-2">
                  Request a repair
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
}
