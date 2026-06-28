"use client";

import Link from "next/link";
import { Phone, Calculator, CalendarCheck } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function MobileCTABar() {
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 md:hidden"
      style={{
        background: "var(--chrome-bg)",
        borderTop: "1px solid var(--chrome-border)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="flex divide-x divide-border">
        <a
          href={`tel:${BUSINESS.phone}`}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-center active:bg-surface transition-colors"
          aria-label={`Call Origin Repairs on ${BUSINESS.phoneDisplay}`}
        >
          <Phone className="h-5 w-5 text-[color:var(--icon-fg)]" />
          <span className="text-[11px] font-semibold text-foreground leading-none">Call</span>
          <span className="text-[10px] text-muted-foreground leading-none">{BUSINESS.phoneDisplay}</span>
        </a>

        <Link
          href="/quote"
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-center active:bg-surface transition-colors"
        >
          <Calculator className="h-5 w-5 text-[color:var(--icon-fg)]" />
          <span className="text-[11px] font-semibold text-foreground leading-none">Get Quote</span>
          <span className="text-[10px] text-muted-foreground leading-none">Instant price</span>
        </Link>

        <Link
          href="/book"
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-center active:bg-surface transition-colors"
          style={{ background: "var(--soft-bg-strong)" }}
        >
          <CalendarCheck className="h-5 w-5 text-[color:var(--icon-fg)]" />
          <span className="text-[11px] font-semibold text-foreground leading-none">Book Repair</span>
          <span className="text-[10px] text-muted-foreground leading-none">Same day</span>
        </Link>
      </div>
      {/* Safe area spacer for iOS home indicator */}
      <div className="h-safe-area-inset-bottom" style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
    </div>
  );
}
