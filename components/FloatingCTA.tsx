"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, X, ArrowRight, MessageCircle } from "lucide-react";

export default function FloatingCTA() {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  // Show after 3 seconds or first scroll
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    const onScroll = () => {
      if (window.scrollY > 200) setVisible(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.4))" }}
    >
      {/* Expanded panel */}
      {expanded && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(10,10,10,0.95)",
            border: "1px solid rgba(59,130,246,0.25)",
            boxShadow:
              "0 0 0 1px rgba(59,130,246,0.1), 0 20px 60px rgba(0,0,0,0.5)",
            backdropFilter: "blur(16px)",
            width: "240px",
          }}
        >
          <div className="px-5 pt-5 pb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-1">
              Need help?
            </p>
            <p className="text-sm font-semibold text-white">
              Origin Repairs Leeds
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Mon–Fri 9am–6pm · Sat 10am–4pm
            </p>
          </div>

          <div className="p-3 space-y-2">
            <a
              href="tel:07768426754"
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 hover:scale-[1.02]"
              style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}
            >
              <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white leading-tight">
                  Call Now
                </p>
                <p className="text-[11px] text-blue-400">07768 426754</p>
              </div>
            </a>

            <Link
              href="/quote"
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 hover:scale-[1.02]"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              onClick={() => setExpanded(false)}
            >
              <ArrowRight className="h-4 w-4 text-zinc-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white leading-tight">
                  Get Instant Quote
                </p>
                <p className="text-[11px] text-zinc-400">Free, no obligation</p>
              </div>
            </Link>
          </div>

          <div className="px-5 pb-4">
            <p className="text-[11px] text-zinc-500 text-center">
              76 Cookridge Street, Leeds LS2 8GL
            </p>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? "Close contact panel" : "Get help or quote"}
        className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xl"
        style={{
          background: expanded
            ? "rgba(30,30,30,0.95)"
            : "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
          border: expanded
            ? "1px solid rgba(255,255,255,0.12)"
            : "1px solid rgba(255,255,255,0.2)",
          boxShadow: expanded
            ? "0 4px 24px rgba(0,0,0,0.4)"
            : "0 4px 24px rgba(59,130,246,0.4), 0 0 0 1px rgba(59,130,246,0.3)",
        }}
      >
        {expanded ? (
          <X className="h-5 w-5 text-white" />
        ) : (
          <MessageCircle className="h-5 w-5 text-white" />
        )}
      </button>
    </div>
  );
}
