"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search } from "lucide-react";

/** Homepage quick-track: enter a reference, jump to /track prefilled. */
export default function TrackRepairStrip() {
  const router = useRouter();
  const [reference, setReference] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ref = reference.trim();
    router.push(ref ? `/track?ref=${encodeURIComponent(ref.toUpperCase())}` : "/track");
  }

  return (
    <section className="section-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-border bg-surface">
            <Search className="h-5 w-5 text-[color:var(--icon-fg)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Already booked in?
            </h2>
            <p className="text-sm text-muted-foreground">
              Track your repair with the reference from your confirmation.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col gap-2.5 sm:flex-row"
        >
          <label htmlFor="home-track-ref" className="sr-only">
            Repair reference number
          </label>
          <Input
            id="home-track-ref"
            name="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value.toUpperCase())}
            placeholder="e.g. OR-2026-0117"
            autoComplete="off"
            className="h-11 flex-1 rounded-xl border-border bg-card font-mono text-[13px] uppercase placeholder:normal-case placeholder:font-sans"
          />
          <Button type="submit" className="btn-primary h-11 px-6 text-[13px] font-semibold">
            <span className="flex items-center gap-2">
              Track Repair
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        </form>
      </div>
      <p className="sr-only">
        Or visit the <Link href="/track">Track My Repair</Link> page.
      </p>
    </section>
  );
}
