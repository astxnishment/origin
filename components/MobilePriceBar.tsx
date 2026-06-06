"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface MobilePriceBarProps {
  show: boolean;
  deviceName: string;
  repairType: string;
  minPrice: number;
  maxPrice: number;
  bookHref: string;
}

/**
 * Mobile-only sticky bottom bar showing the live quote + Book CTA.
 * While visible it sets `body.price-bar-active`, which hides the
 * floating chat button on mobile (see globals.css) to avoid overlap.
 */
export default function MobilePriceBar({
  show,
  deviceName,
  repairType,
  minPrice,
  maxPrice,
  bookHref,
}: MobilePriceBarProps) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("price-bar-active", show);
    return () => {
      document.body.classList.remove("price-bar-active");
    };
  }, [show]);

  return (
    <div
      aria-hidden={!show}
      className={`lg:hidden fixed inset-x-0 bottom-0 z-[60] transition-transform duration-300 ease-out ${
        show ? "translate-y-0" : "translate-y-[120%]"
      }`}
      style={{
        background: "rgba(10,10,10,0.92)",
        backdropFilter: "blur(18px) saturate(160%)",
        WebkitBackdropFilter: "blur(18px) saturate(160%)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.5)",
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="flex items-center gap-3 px-4 pt-3">
        {/* Device + price */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-white leading-tight truncate">
            {deviceName} · {repairType}
          </p>
          <p className="text-[12px] text-blue-400 font-medium leading-tight mt-0.5">
            £{minPrice}–£{maxPrice}
            <span className="text-zinc-500"> · 12-mo warranty</span>
          </p>
        </div>

        {/* CTA */}
        <Link
          href={bookHref}
          className="flex-shrink-0 inline-flex items-center gap-1.5 h-11 px-5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 active:scale-[0.97] transition-transform"
          style={{ boxShadow: "0 6px 20px -6px rgba(59,130,246,0.6)" }}
        >
          Book Repair
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
