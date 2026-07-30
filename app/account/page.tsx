import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CircleUserRound,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";
import { BUSINESS, FEATURES } from "@/lib/constants";
import { getCustomerSession } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Your Account",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AccountPage() {
  if (!FEATURES.customerAccountsEnabled) redirect("/");

  const session = await getCustomerSession();
  if (!session) redirect("/login?next=/account");

  return (
    <>
      <Navbar />
      <main className="pb-20 pt-16 md:pt-[72px]">
        <PageContainer size="narrow" className="py-10 sm:py-14">
          <div className="flex flex-col justify-between gap-5 border-b border-border pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Customer account</p>
              <h1 className="page-title mt-3">Your repairs.</h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                Signed in securely as {session.email}
              </p>
            </div>
            <form action="/api/auth/logout" method="post">
              <Button type="submit" variant="outline" className="h-10 gap-2">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>

          <section id="repairs" className="py-9 sm:py-11">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">Current repairs</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Repairs connected to this email address
                </p>
              </div>
              <Wrench className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="panel flex flex-col items-start gap-6 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex gap-4">
                <div className="icon-circle">
                  <Wrench className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold">
                    No repairs are linked online yet
                  </h2>
                  <p className="mt-1.5 max-w-lg text-[13px] leading-5 text-muted-foreground">
                    When you contact us, use this account email so the team can
                    match your repair details.
                  </p>
                </div>
              </div>
              <Button asChild className="btn-primary h-10 w-full sm:w-auto">
                <Link href="/book">
                  Request repair
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>

          <section className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            <div className="bg-card p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <CircleUserRound className="h-4 w-4 text-[color:var(--icon-fg)]" />
                <h2 className="text-sm font-semibold">Account access</h2>
              </div>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Email</dt>
                  <dd className="mt-1 break-all font-medium">{session.email}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Security</dt>
                  <dd className="mt-1 flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified email link
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-card p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[color:var(--icon-fg)]" />
                <h2 className="text-sm font-semibold">Need an update?</h2>
              </div>
              <p className="mt-4 text-[13px] leading-5 text-muted-foreground">
                Include the reference on your receipt when contacting the team.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild variant="outline" className="h-9">
                  <Link href="/contact">Message us</Link>
                </Button>
                <Button asChild variant="ghost" className="h-9">
                  <a href={BUSINESS.phoneHref}>
                    <Phone className="h-3.5 w-3.5" />
                    {BUSINESS.phoneDisplay}
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
