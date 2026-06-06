"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Zap } from "lucide-react";

export default function EmergencyBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="relative z-[60] w-full py-2.5 px-4"
      style={{
        background: "linear-gradient(90deg, rgba(37,99,235,0.95) 0%, rgba(59,130,246,0.9) 50%, rgba(37,99,235,0.95) 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Left spacer (mirrors close button width) */}
        <div className="w-7 flex-shrink-0 hidden sm:block" />

        {/* Centre content */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center text-white text-[12px] sm:text-[13px] font-medium">
          <span className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-white/90" />
            Same-Day Repairs Available
          </span>
          <span className="hidden sm:inline text-white/40">·</span>
          <span className="hidden sm:inline">Walk-ins Welcome</span>
          <span className="hidden sm:inline text-white/40">·</span>
          <Link
            href="/book"
            className="underline underline-offset-2 hover:no-underline transition-all font-semibold"
          >
            76 Cookridge Street, Leeds → Book Now
          </Link>
        </div>

        {/* Close button */}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss banner"
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-white/15 transition-colors"
        >
          <X className="h-3.5 w-3.5 text-white/80" />
        </button>
      </div>
    </div>
  );
}
