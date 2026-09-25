"use client";
import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export default function RefreshRepairs({ automatic = true }: { automatic?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  useEffect(() => {
    if (!automatic) return;
    const interval = setInterval(() => { if (document.visibilityState === "visible") router.refresh(); }, 30_000);
    return () => clearInterval(interval);
  }, [router, automatic]);
  return <div className="flex flex-wrap items-center gap-3"><Button variant="outline" disabled={pending} onClick={() => startTransition(() => router.refresh())}>{pending ? "Refreshing…" : "Refresh updates"}</Button>{automatic && <p className="text-xs text-muted-foreground">Checks for updates every 30 seconds.</p>}</div>;
}
