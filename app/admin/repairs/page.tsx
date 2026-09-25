import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { getCustomerSession } from "@/lib/server/auth";
import { isStaffEmail } from "@/lib/server/staffAuth";
import { listRepairsForStaff } from "@/lib/server/repairStore";
import type { StaffRepair } from "@/lib/repairTracking";
import { FEATURES } from "@/lib/constants";
import { liveChatConfiguration } from "@/lib/liveChat";
import RepairCard from "@/components/tracking/RepairCard";
import { CreateRepairForm, UpdateRepairForm } from "@/components/tracking/StaffRepairForms";
import RefreshRepairs from "@/components/tracking/RefreshRepairs";
export const metadata: Metadata = { title: "Staff repair dashboard", robots: { index: false, follow: false } };
export default async function StaffRepairsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  if (!FEATURES.trackingEnabled) notFound();
  const session = await getCustomerSession();
  if (!session) redirect("/login?next=/admin/repairs");
  if (!isStaffEmail(session.email)) notFound();
  const query = (await searchParams).q?.trim().slice(0, 100) ?? "";
  const chatConfigured = Boolean(liveChatConfiguration().scriptUrl);
  let repairs: StaffRepair[] = []; let unavailable = false;
  try { repairs = await listRepairsForStaff(query); } catch { unavailable = true; }
  return <><Navbar /><main id="main-content" tabIndex={-1} className="pb-20 pt-24"><PageContainer size="narrow" className="py-8 sm:py-12">
    <p className="eyebrow">Staff only</p><h1 className="page-title mt-3">Repair dashboard.</h1><p className="mt-4 text-sm text-muted-foreground">Manage requests and share repair updates with customers.</p>
    <div className="mt-5 flex flex-wrap gap-3"><RefreshRepairs automatic={false} /><Button asChild variant="ghost"><Link href="/track">Customer view</Link></Button>{chatConfigured && <Button asChild variant="ghost"><a href="https://dashboard.tawk.to" target="_blank" rel="noreferrer">Open chat inbox ↗</a></Button>}<form action="/api/auth/logout" method="post"><Button type="submit" variant="ghost">Sign out</Button></form></div>
    {unavailable ? <div role="alert" className="panel mt-7 p-6"><h2 className="text-lg font-semibold">Repair records are unavailable.</h2><p className="mt-3 text-sm text-muted-foreground">Please retry shortly. The database connection must be working before accepting online tracking requests.</p></div> : <>
      <CreateRepairForm />
      <form action="/admin/repairs" className="mb-7 flex flex-wrap items-end gap-3"><div className="min-w-0 flex-1"><label htmlFor="staff-search" className="mb-2 block text-sm font-medium">Find a repair</label><input id="staff-search" name="q" defaultValue={query} maxLength={100} placeholder="Reference, customer email or device" className="h-11 w-full rounded-lg border border-border bg-card px-3 text-base" /></div><Button type="submit" className="h-11">Search</Button>{query && <Link href="/admin/repairs" className="py-3 text-sm underline">Clear search</Link>}</form>
      <p className="mb-5 text-xs text-muted-foreground">Most recent repairs are shown first. Search to find an older record.</p>
      <div className="space-y-8">{repairs.map((repair) => <section key={repair.reference}><RepairCard repair={repair} /><div className="rounded-b-lg border border-t-0 border-border p-5 sm:p-7">
        <h3 className="text-sm font-semibold">Customer details · staff only</h3><dl className="mt-3 grid gap-3 break-words text-sm sm:grid-cols-2"><div><dt className="text-xs text-muted-foreground">Name</dt><dd>{repair.customerName}</dd></div><div><dt className="text-xs text-muted-foreground">Email</dt><dd>{repair.customerEmail}</dd></div><div><dt className="text-xs text-muted-foreground">Phone</dt><dd>{repair.customerPhone || "Not provided"}</dd></div><div><dt className="text-xs text-muted-foreground">Requested date/time</dt><dd>{repair.requestedDate ? `${repair.requestedDate} ${repair.requestedTime ?? ""}` : "Not specified"}</dd></div>{repair.returnAddress && <div><dt className="text-xs text-muted-foreground">Return address</dt><dd className="whitespace-pre-wrap">{repair.returnAddress}</dd></div>}</dl>{repair.issue && <p className="mt-4 whitespace-pre-wrap break-words text-sm text-muted-foreground">Reported issue: {repair.issue}</p>}<UpdateRepairForm key={repair.updatedAt} repair={repair} />
      </div></section>)}{!repairs.length && <p className="panel p-6 text-sm">{query ? "No matching repairs." : "No repair requests yet."}</p>}</div>
    </>}
  </PageContainer></main><Footer /></>;
}
