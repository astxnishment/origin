"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { REPAIR_STATUSES, REPAIR_STATUS_LABELS, type StaffRepair } from "@/lib/repairTracking";
const fieldClass = "mt-2 block min-h-11 w-full rounded-lg border border-border bg-card px-3 py-2 text-base";

export function UpdateRepairForm({ repair }: { repair: StaffRepair }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); setPending(true); setMessage(""); setError(false);
    try {
      const response = await fetch(`/api/admin/repairs/${encodeURIComponent(repair.reference)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: data.get("status"), customerNote: data.get("customerNote"), expectedUpdatedAt: repair.updatedAt }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "The update could not be saved.");
      form.reset(); setMessage("Update saved and visible to the customer."); router.refresh();
    } catch (error) { setError(true); setMessage(error instanceof Error ? error.message : "The update could not be saved."); }
    finally { setPending(false); }
  }
  return <form onSubmit={submit} className="mt-6 space-y-4 border-t border-border pt-5">
    <label className="block text-sm font-medium">Repair status<select name="status" defaultValue={repair.status} className={fieldClass}>{REPAIR_STATUSES.map((status) => <option key={status} value={status}>{REPAIR_STATUS_LABELS[status]}</option>)}</select></label>
    <label className="block text-sm font-medium">Message shown to the customer<textarea name="customerNote" maxLength={1000} rows={3} className={fieldClass} placeholder="Explain the update and any next step." /></label>
    <p className="text-xs text-muted-foreground">Status and message appear in the customer’s repair timeline. Do not include passwords or internal notes.</p>
    <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save customer update"}</Button>
    {message && <p role={error ? "alert" : "status"} className="text-sm">{message}</p>}
  </form>;
}

export function CreateRepairForm() {
  const router = useRouter();
  const [requestKey, setRequestKey] = useState(() => crypto.randomUUID());
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const data = Object.fromEntries(new FormData(form)); setPending(true); setMessage(""); setError(false);
    try {
      const response = await fetch("/api/admin/repairs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, requestKey }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "The repair could not be added.");
      form.reset(); setRequestKey(crypto.randomUUID()); setMessage(`Repair ${result.repair.reference} added. Ask the customer to sign in with the email recorded here.`); router.refresh();
    } catch (error) { setError(true); setMessage(error instanceof Error ? error.message : "The repair could not be added."); }
    finally { setPending(false); }
  }
  return <details className="panel my-7 p-5 sm:p-7"><summary className="cursor-pointer text-base font-semibold">Add a repair received by phone or in person</summary><form onSubmit={submit} className="mt-5 space-y-4">
    <div className="grid gap-4 sm:grid-cols-2">{[{ name:"customerName",label:"Customer name",type:"text",max:100 },{ name:"customerEmail",label:"Customer email",type:"email",max:254 },{ name:"customerPhone",label:"Customer phone",type:"tel",max:25 },{ name:"deviceLabel",label:"Device",type:"text",max:180 },{ name:"repairLabel",label:"Repair or assessment",type:"text",max:180 }].map((field) => <label key={field.name} className="block text-sm font-medium">{field.label}<input name={field.name} type={field.type} maxLength={field.max} required={field.name !== "customerPhone"} className={fieldClass} /></label>)}<label className="block text-sm font-medium">Service method<select name="serviceMethod" className={fieldClass}><option value="drop-off">Leeds drop-off</option><option value="mail-in">Mail-in</option></select></label></div>
    <label className="block text-sm font-medium">Issue description<textarea name="issue" maxLength={2000} rows={3} className={fieldClass} /></label>
    <label className="block text-sm font-medium">Return address (for mail-in)<textarea name="returnAddress" maxLength={500} rows={3} className={fieldClass} /></label>
    <p className="text-xs text-muted-foreground">The customer email controls access to this repair. Confirm it before saving. New entries show “Assessment required” until a quote is agreed with the customer.</p>
    <Button type="submit" disabled={pending}>{pending ? "Adding…" : "Add repair"}</Button>{message && <p role={error ? "alert" : "status"} className="text-sm">{message}</p>}
  </form></details>;
}
