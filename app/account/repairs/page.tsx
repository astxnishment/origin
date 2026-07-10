"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { ArrowRight, Search, Wrench } from "lucide-react";

/**
 * My Repairs — lists the signed-in customer's repairs.
 * TODO(backend): fetch from GET /api/account/repairs; the empty state below
 * renders until repairs are linked to accounts.
 */
export default function MyRepairsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center pt-28 pb-24">
          <p className="text-sm text-muted-foreground" role="status">
            Loading your repairs…
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="pt-10 pb-10">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Account
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My repairs.</h1>
          </div>

          {/* Empty state — shown until repairs are linked to this account */}
          <div className="flex flex-col items-center gap-5 rounded-lg border border-border bg-card px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface">
              <Wrench className="h-6 w-6 text-[color:var(--icon-fg)]" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">No repairs yet.</p>
              <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Repairs you book with <span className="text-foreground">{user.email}</span> will
                appear here. Already have a repair with us? Track it with your reference number.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="btn-primary h-11 px-6 text-sm">
                <Link href="/book" className="flex items-center gap-2">
                  Book a repair
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 border-border px-6 text-sm">
                <Link href="/track" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Track a repair
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
