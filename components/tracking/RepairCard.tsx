import { REPAIR_STATUS_LABELS, type CustomerRepair } from "@/lib/repairTracking";

export function repairDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/London" }).format(new Date(value));
}

export default function RepairCard({ repair }: { repair: CustomerRepair }) {
  return <article className="panel p-5 sm:p-7" aria-label={`Repair ${repair.reference}`}>
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
      <div><p className="font-mono text-xs text-muted-foreground">{repair.reference}</p><h2 className="mt-2 text-xl font-semibold">{repair.deviceLabel}</h2><p className="mt-1 text-sm text-muted-foreground">{repair.repairLabel}</p></div>
      <p className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium">{REPAIR_STATUS_LABELS[repair.status]}</p>
    </div>
    {repair.status === "requested" && <p className="mt-4 text-sm text-muted-foreground">Your request is recorded. The team will confirm availability and the quote before work begins.{repair.serviceMethod === "mail-in" ? " Please wait for shipping instructions before posting your device." : ""}</p>}
    <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-xs text-muted-foreground">Estimate</dt><dd className="mt-1">{repair.priceLabel}</dd></div><div><dt className="text-xs text-muted-foreground">Service</dt><dd className="mt-1">{repair.serviceMethod === "mail-in" ? "Mail-in repair" : "Leeds drop-off"}</dd></div><div><dt className="text-xs text-muted-foreground">Part option</dt><dd className="mt-1">{repair.partLabel}</dd></div><div><dt className="text-xs text-muted-foreground">Warranty</dt><dd className="mt-1">{repair.warranty}</dd></div></dl>
    <h3 className="mt-7 text-sm font-semibold">Repair updates</h3>
    <ol className="mt-4 space-y-4 border-l border-border pl-4">
      {[...repair.history].sort((a,b) => b.createdAt.localeCompare(a.createdAt)).map((entry, index) => <li key={`${entry.createdAt}-${index}`}>
        <p className="text-sm font-medium">{REPAIR_STATUS_LABELS[entry.status]}</p><time dateTime={entry.createdAt} className="mt-1 block text-xs text-muted-foreground">{repairDate(entry.createdAt)}</time>
        {entry.customerNote && <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">{entry.customerNote}</p>}
      </li>)}
    </ol>
  </article>;
}
