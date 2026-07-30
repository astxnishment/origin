"use client";

import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-28">
      <div className="max-w-md text-center">
        <AlertCircle className="mx-auto h-6 w-6 text-muted-foreground" />
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">
          This page could not load.
        </h1>
        <p className="mt-4 text-[14px] leading-6 text-muted-foreground">
          No request has been marked as successful. Try the page again, or use
          the contact page if the problem continues.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={reset} className="h-10 rounded-md px-5">
            <RotateCcw className="h-4 w-4" />
            Try again
          </Button>
          <Button asChild variant="outline" className="h-10 rounded-md px-5">
            <Link href="/contact">Contact Origin Repairs</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
