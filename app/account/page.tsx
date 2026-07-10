"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { CircleUserRound, LogOut, Search, Wrench } from "lucide-react";

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  // Signed-out visitors are sent to log in
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center pt-28 pb-24">
          <p className="text-sm text-muted-foreground" role="status">
            Loading your account…
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
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Account details.</h1>
          </div>

          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center gap-4 border-b border-border p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface">
                <CircleUserRound className="h-6 w-6 text-[color:var(--icon-fg)]" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground">{user.name}</p>
                <p className="truncate text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <dl className="divide-y divide-border">
              <div className="flex items-center justify-between gap-4 px-6 py-4">
                <dt className="text-sm text-muted-foreground">Name</dt>
                <dd className="text-sm font-medium text-foreground">{user.name}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 px-6 py-4">
                <dt className="text-sm text-muted-foreground">Email</dt>
                <dd className="text-sm font-medium text-foreground">{user.email}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 px-6 py-4">
                <dt className="text-sm text-muted-foreground">Password</dt>
                <dd>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Reset password
                  </Link>
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button asChild variant="outline" className="h-11 justify-start gap-2.5 border-border text-sm">
              <Link href="/account/repairs">
                <Wrench className="h-4 w-4" />
                My Repairs
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 justify-start gap-2.5 border-border text-sm">
              <Link href="/track">
                <Search className="h-4 w-4" />
                Track My Repair
              </Link>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => {
              signOut();
              router.push("/");
            }}
            className="mt-8 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
