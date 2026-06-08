"use client";

import Link from "next/link";
import { Phone, Calculator, CalendarCheck } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function MobileCTABar() {
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 md:hidden"
      style={{
        background: "rgba(8,8,8,0.96)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="flex divide-x divide-white/10">
        <a
          href={`tel:${BUSINESS.phone}`}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-center active:bg-white/5 transition-colors"
          aria-label={`Call Origin Repairs on ${BUSINESS.phoneDisplay}`}
        >
          <Phone className="h-5 w-5 text-blue-400" />
          <span className="text-[11px] font-semibold text-white/80 leading-none">Call</span>
          <span className="text-[10px] text-white/40 leading-none">{BUSINESS.phoneDisplay}</span>
        </a>

        <Link
          href="/quote"
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-center active:bg-white/5 transition-colors"
        >
          <Calculator className="h-5 w-5 text-white/70" />
          <span className="text-[11px] font-semibold text-white/80 leading-none">Get Quote</span>
          <span className="text-[10px] text-white/40 leading-none">Instant price</span>
        </Link>

        <Link
          href="/book"
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-center active:bg-white/5 transition-colors"
          style={{ background: "rgba(37,99,235,0.2)" }}
        >
          <CalendarCheck className="h-5 w-5 text-blue-400" />
          <span className="text-[11px] font-semibold text-blue-300 leading-none">Book Repair</span>
          <span className="text-[10px] text-white/40 leading-none">Same day</span>
        </Link>
      </div>
      {/* Safe area spacer for iOS home indicator */}
      <div className="h-safe-area-inset-bottom" style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
    </div>
  );
}
