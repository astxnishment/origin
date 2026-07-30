"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, CalendarCheck } from "lucide-react";
import { FEATURES } from "@/lib/constants";

export default function MobileCTABar() {
  const pathname = usePathname();
  const visible =
    pathname === "/repairs" ||
    pathname.startsWith("/repairs/") ||
    pathname === "/pricing" ||
    pathname === "/about" ||
    pathname === "/faq";

  useEffect(() => {
    document.body.classList.toggle("mobile-cta-active", visible);
    return () => document.body.classList.remove("mobile-cta-active");
  }, [visible]);

  if (!visible) return null;

  return (
    <nav
      aria-label="Quick repair actions"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden"
      style={{
        background: "var(--chrome-bg)",
        borderTop: "1px solid var(--chrome-border)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="grid min-h-16 grid-cols-2 gap-2 p-2">
        <Link
          href="/quote"
          className="btn-primary flex h-12 items-center justify-center gap-2 px-3 text-sm"
        >
          <Calculator className="h-4 w-4" />
          <span>Get Quote</span>
        </Link>

        {FEATURES.bookingEnabled && (
          <Link
            href="/book"
            className="btn-secondary flex h-12 items-center justify-center gap-2 px-3 text-sm"
          >
            <CalendarCheck className="h-4 w-4" />
            <span>Book Repair</span>
          </Link>
        )}
      </div>
      {/* Safe area spacer for iOS home indicator */}
      <div className="h-safe-area-inset-bottom" style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
    </nav>
  );
}
