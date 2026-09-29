import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DirectContactPage } from "@/components/DirectContact";
import { CONTACT_ONLY_MODE } from "@/lib/business-config";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";
import { BUSINESS, FEATURES } from "@/lib/constants";
import { getCustomerSession } from "@/lib/server/auth";
import { isStaffEmail } from "@/lib/server/staffAuth";
import { getRepairForCustomer, listRepairsForCustomer } from "@/lib/server/repairStore";
import type { CustomerRepair } from "@/lib/repairTracking";
import RepairCard from "@/components/tracking/RepairCard";
import RefreshRepairs from "@/components/tracking/RefreshRepairs";

export const metadata: Metadata = { title: "Track your repair", robots: { index: false, follow: false } };

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  if (CONTACT_ONLY_MODE) return <DirectContactPage title="Ask for a repair update." description="Online repair tracking is not available yet. Call or message the team with your repair reference for an update." />;
  if (!FEATURES.trackingEnabled) notFound();
  const query = await searchParams;
  const reference = query.reference?.trim().toUpperCase().slice(0, 40) ?? "";
  const session = await getCustomerSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(reference ? `/track?reference=${reference}` : "/track")}`);
  let repairs: CustomerRepair[] = [];
  let unavailable = false;
  try {
    if (reference && /^OR-[0-9]{8}-[A-F0-9]{12}$/.test(reference)) {
      const repair = await getRepairForCustomer(reference, session.email);
      repairs = repair ? [repair] : [];
    } else if (!reference) repairs = await listRepairsForCustomer(session.email);
  } catch { unavailable = true; }
  return <><Navbar /><main id="main-content" tabIndex={-1} className="pb-20 pt-24"><PageContainer size="narrow" className="py-8 sm:py-12">
    <p className="eyebrow">Repair tracking</p><h1 className="page-title mt-3">Your repairs.</h1><p className="mt-4 text-sm text-muted-foreground">Signed in as <span className="break-all">{session.email}</span>. Only repairs linked to this email appear here.</p>
    <div className="mt-6 flex flex-wrap gap-3"><RefreshRepairs /><form action="/api/auth/logout" method="post"><Button variant="ghost" type="submit">Sign out</Button></form>{isStaffEmail(session.email) && <Button asChild variant="outline"><Link href="/admin/repairs">Staff dashboard</Link></Button>}</div>
    <form action="/track" className="my-8 flex flex-wrap items-end gap-3"><div className="min-w-0 flex-1"><label htmlFor="repair-reference" className="mb-2 block text-sm font-medium">Repair reference (optional)</label><input id="repair-reference" name="reference" defaultValue={reference} maxLength={40} placeholder="OR-…" className="h-11 w-full rounded-lg border border-border bg-card px-3 text-base" /></div><Button type="submit" className="h-11">Find repair</Button>{reference && <Link href="/track" className="py-3 text-sm underline underline-offset-4">Show all</Link>}</form>
    {unavailable ? <div role="status" className="panel p-6"><h2 className="text-lg font-semibold">Updates are temporarily unavailable.</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Please try again shortly, or contact the team with your repair reference.</p><a className="mt-3 inline-block text-sm underline" href={BUSINESS.phoneHref}>Call {BUSINESS.phoneDisplay}</a></div> : repairs.length ? <div className="space-y-5">{repairs.map((repair) => <RepairCard key={repair.reference} repair={repair} />)}</div> : <div className="panel p-6"><h2 className="text-lg font-semibold">{reference ? "No matching repair for this account." : "No repairs are linked to this email yet."}</h2><p className="mt-3 text-sm text-muted-foreground">Use the email address from your repair request. Contact the team if you need help finding an existing repair.</p><Button asChild className="mt-5"><Link href="/contact">Contact the team</Link></Button></div>}
  </PageContainer></main><Footer /></>;
}
