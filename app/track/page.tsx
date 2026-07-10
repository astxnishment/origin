"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BUSINESS } from "@/lib/constants";
import {
  REPAIR_STAGES,
  lookupRepair,
  stageIndex,
  type RepairRecord,
} from "@/lib/repairTracking";
import {
  AlertCircle,
  CalendarDays,
  Check,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  Phone,
  Search,
  Smartphone,
  StickyNote,
  UserRound,
  Wrench,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function gbp(n: number): string {
  return `£${n.toFixed(n % 1 === 0 ? 0 : 2)}`;
}

// ── Progress tracker ─────────────────────────────────────────────────────────

function ProgressTracker({ repair }: { repair: RepairRecord }) {
  const currentIdx = stageIndex(repair.currentStage);

  return (
    <ol className="relative" aria-label="Repair progress">
      {REPAIR_STAGES.map((stage, i) => {
        const done = i < currentIdx;
        const current = i === currentIdx;
        const event = repair.stageHistory.find((e) => e.stage === stage);
        const last = i === REPAIR_STAGES.length - 1;

        return (
          <li key={stage} className="relative flex gap-4 pb-0">
            {/* Connector line */}
            {!last && (
              <span
                aria-hidden="true"
                className={`absolute left-[13px] top-7 h-[calc(100%-16px)] w-px ${
                  done ? "bg-[color:var(--accent)]" : "bg-border"
                }`}
              />
            )}

            {/* Node */}
            <span
              aria-hidden="true"
              className={`relative z-10 mt-0.5 flex h-[27px] w-[27px] flex-shrink-0 items-center justify-center rounded-full border text-[11px] font-bold transition-colors ${
                done
                  ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-white"
                  : current
                  ? "border-[color:var(--accent)] bg-card text-[color:var(--accent)] ring-4 ring-[color:var(--accent)]/15"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>

            {/* Label + meta */}
            <div className={`min-w-0 flex-1 ${last ? "" : "pb-6"}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <p
                  className={`text-sm font-semibold ${
                    current
                      ? "text-[color:var(--accent)]"
                      : done
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {stage}
                  {current && (
                    <span className="ml-2 rounded-full bg-[color:var(--accent)]/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--accent)]">
                      Current
                    </span>
                  )}
                </p>
                {event?.timestamp && (
                  <p className="text-[12px] tabular-nums text-muted-foreground">
                    {formatTimestamp(event.timestamp)}
                  </p>
                )}
                {!event?.timestamp && event?.estimate && (
                  <p className="text-[12px] italic text-muted-foreground">{event.estimate}</p>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

// ── Result card ──────────────────────────────────────────────────────────────

function RepairResult({ repair }: { repair: RepairRecord }) {
  const details = [
    { icon: UserRound, label: "Customer", value: repair.customerName },
    { icon: Smartphone, label: "Device", value: repair.deviceModel },
    { icon: Wrench, label: "Repair", value: repair.repairType },
    { icon: CalendarDays, label: "Received", value: formatDate(repair.dateReceived) },
    { icon: Clock, label: "Est. completion", value: formatDate(repair.estimatedCompletion) },
    { icon: MapPin, label: "Collection", value: repair.collection },
  ];

  return (
    <div className="space-y-6" aria-live="polite">
      {/* Header card */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Repair reference
            </p>
            <p className="font-mono text-lg font-bold text-foreground">{repair.reference}</p>
          </div>
          <span className="rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 px-3 py-1.5 text-[12px] font-semibold text-[color:var(--accent)]">
            {repair.currentStage}
          </span>
        </div>

        <dl className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:[&>*:nth-child(n+3)]:border-t sm:[&>*:nth-child(even)]:border-t-0 sm:[&>*:nth-child(3)]:border-t sm:[&>*:nth-child(4)]:border-t">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 px-6 py-4">
              <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[color:var(--icon-fg)]" />
              <div className="min-w-0">
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-foreground">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      {/* Progress */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-[13px] font-semibold uppercase tracking-widest text-muted-foreground">
          Progress
        </h2>
        <ProgressTracker repair={repair} />
      </div>

      {/* Notes + payment */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-widest text-muted-foreground">
            <StickyNote className="h-4 w-4" />
            Technician notes
          </h2>
          {repair.technicianNotes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notes yet.</p>
          ) : (
            <ul className="space-y-3">
              {repair.technicianNotes.map((note) => (
                <li key={note} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[color:var(--accent)]" />
                  {note}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-widest text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            Payment
          </h2>
          <dl className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <dt className="text-muted-foreground">Amount paid</dt>
              <dd className="font-semibold text-foreground">{gbp(repair.amountPaid)}</dd>
            </div>
            <div className="flex items-center justify-between text-sm">
              <dt className="text-muted-foreground">Remaining balance</dt>
              <dd className={`font-semibold ${repair.balanceDue > 0 ? "text-foreground" : "text-[color:var(--accent)]"}`}>
                {repair.balanceDue > 0 ? gbp(repair.balanceDue) : "Paid in full"}
              </dd>
            </div>
            <div className="border-t border-border pt-3 text-[12px] leading-relaxed text-muted-foreground">
              Any balance is payable on collection. Questions? Call{" "}
              <a href={BUSINESS.phoneHref} className="font-medium text-foreground underline-offset-4 hover:underline">
                {BUSINESS.phoneDisplay}
              </a>
              .
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

function TrackForm() {
  const searchParams = useSearchParams();

  const [reference, setReference] = useState("");
  const [contact, setContact] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [lookupError, setLookupError] = useState("");
  const [repair, setRepair] = useState<RepairRecord | null>(null);

  // Prefill from the homepage quick-track strip (?ref=OR-…)
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setReference(ref.toUpperCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!reference.trim()) errs.reference = "Please enter your repair reference.";
    if (!contact.trim()) errs.contact = "Please enter the email or phone used when booking.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("loading");
    setLookupError("");
    setRepair(null);

    const result = await lookupRepair({ reference, contact });
    if (result.ok) {
      setRepair(result.repair);
    } else {
      setLookupError(result.error);
    }
    setStatus("done");
  }

  return (
    <>
      {/* Lookup form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-lg border border-border bg-card p-6 sm:p-8"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="reference" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Repair reference
            </label>
            <Input
              id="reference"
              name="reference"
              value={reference}
              onChange={(e) => {
                setReference(e.target.value.toUpperCase());
                setErrors((p) => ({ ...p, reference: "" }));
              }}
              placeholder="OR-2026-0117"
              autoComplete="off"
              className="h-11 rounded-xl border-border bg-background font-mono text-[13px] uppercase placeholder:normal-case placeholder:font-sans"
              aria-describedby={errors.reference ? "reference-error" : "reference-hint"}
              aria-invalid={errors.reference ? true : undefined}
            />
            {errors.reference ? (
              <p id="reference-error" role="alert" className="flex items-center gap-1 text-[12px] text-destructive">
                <AlertCircle className="h-3 w-3 flex-shrink-0" />
                {errors.reference}
              </p>
            ) : (
              <p id="reference-hint" className="text-[12px] text-muted-foreground">
                On your booking confirmation email or receipt.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Email or phone number
            </label>
            <Input
              id="contact"
              name="contact"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                setErrors((p) => ({ ...p, contact: "" }));
              }}
              placeholder="jane@example.com or 07xxx xxxxxx"
              autoComplete="email"
              className="h-11 rounded-xl border-border bg-background text-[13px]"
              aria-describedby={errors.contact ? "contact-error" : undefined}
              aria-invalid={errors.contact ? true : undefined}
            />
            {errors.contact && (
              <p id="contact-error" role="alert" className="flex items-center gap-1 text-[12px] text-destructive">
                <AlertCircle className="h-3 w-3 flex-shrink-0" />
                {errors.contact}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary mt-5 h-11 w-full text-[14px] font-semibold sm:w-auto sm:px-8"
        >
          {status === "loading" ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Track Repair
            </span>
          )}
        </Button>
      </form>

      {/* States */}
      <div className="mt-8">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card px-6 py-14 text-center" role="status">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Looking up your repair…</p>
          </div>
        )}

        {status === "done" && lookupError && (
          <div role="alert" className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-5">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
            <div>
              <p className="text-sm font-semibold text-destructive">Repair not found</p>
              <p className="mt-1 text-[13px] leading-relaxed text-destructive/90">{lookupError}</p>
            </div>
          </div>
        )}

        {status === "done" && repair && <RepairResult repair={repair} />}

        {status === "idle" && (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-14 text-center">
            <Search className="h-6 w-6 text-muted-foreground" />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Enter your repair reference and the email or phone number you booked with to see
              live status, technician notes and collection details.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default function TrackPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="pt-10 pb-10">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Repair status
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Track my repair.</h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Check where your device is in the repair process — updated by our technicians at
              every stage.
            </p>
          </div>

          <Suspense fallback={null}>
            <TrackForm />
          </Suspense>

          {/* Help footer */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-6 text-[13px] text-muted-foreground">
            <span>Can&apos;t find your reference?</span>
            <a href={BUSINESS.phoneHref} className="flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              {BUSINESS.phoneDisplay}
            </a>
            <a href={`mailto:${BUSINESS.email}`} className="font-medium text-foreground underline-offset-4 hover:underline">
              {BUSINESS.email}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
