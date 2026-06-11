/**
 * SamsungCategoryIcon — distinct SVG icons per Samsung device category.
 *
 * Each variant is visually distinct so users immediately recognise
 * Galaxy S / A / Z Fold / Z Flip / Tab without needing real photos.
 */

import type { SamsungVariant } from "@/lib/deviceImages/samsungGenericImages";

interface Props {
  variant: SamsungVariant;
  className?: string;
  size?: number;
}

export function SamsungCategoryIcon({ variant, className = "", size = 120 }: Props) {
  switch (variant) {
    case "galaxy-s":    return <GalaxySIcon    size={size} className={className} />;
    case "galaxy-a":    return <GalaxyAIcon    size={size} className={className} />;
    case "galaxy-fold": return <GalaxyFoldIcon size={size} className={className} />;
    case "galaxy-flip": return <GalaxyFlipIcon size={size} className={className} />;
    case "galaxy-tab":  return <GalaxyTabIcon  size={size} className={className} />;
    case "galaxy-book": return <GalaxyBookIcon size={size} className={className} />;
    default:            return <GalaxySIcon    size={size} className={className} />;
  }
}

// ── Galaxy S Series — slim premium with punch-hole & thin bezels ─────────────
function GalaxySIcon({ size, className }: { size: number; className: string }) {
  const w = size * 0.50, h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 50 100" fill="none" className={className}>
      <defs>
        <linearGradient id="s-body" x1="0" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1f2a42"/>
          <stop offset="1" stopColor="#0b0f1e"/>
        </linearGradient>
        <linearGradient id="s-screen" x1="0" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0d1830"/>
          <stop offset="1" stopColor="#040812"/>
        </linearGradient>
      </defs>
      {/* Body — slim, slightly squared corners */}
      <rect x="1" y="1" width="48" height="98" rx="10" fill="url(#s-body)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.2"/>
      {/* Screen — very thin bezel */}
      <rect x="3" y="3" width="44" height="94" rx="8.5" fill="url(#s-screen)"/>
      {/* Punch-hole camera — centered */}
      <circle cx="25" cy="10" r="2.8" fill="rgba(0,0,0,0.7)"/>
      <circle cx="25" cy="10" r="1.5" fill="#1a2040"/>
      {/* Side buttons */}
      <rect x="49" y="28" width="2" height="18" rx="1" fill="rgba(255,255,255,0.22)"/>
      <rect x="-1" y="24" width="2" height="11" rx="1" fill="rgba(255,255,255,0.22)"/>
      <rect x="-1" y="39" width="2" height="11" rx="1" fill="rgba(255,255,255,0.22)"/>
      {/* Screen content hint — thin status bar */}
      <rect x="8" y="6" width="16" height="2" rx="1" fill="rgba(255,255,255,0.08)"/>
      <rect x="36" y="6" width="8" height="2" rx="1" fill="rgba(255,255,255,0.06)"/>
      {/* Home bar at bottom */}
      <rect x="17" y="90" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.15)"/>
    </svg>
  );
}

// ── Galaxy A Series — slightly wider with rounder body ───────────────────────
function GalaxyAIcon({ size, className }: { size: number; className: string }) {
  const w = size * 0.52, h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 52 100" fill="none" className={className}>
      <defs>
        <linearGradient id="a-body" x1="0" y1="0" x2="52" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1a2038"/>
          <stop offset="1" stopColor="#080c18"/>
        </linearGradient>
        <linearGradient id="a-screen" x1="0" y1="0" x2="52" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0a1228"/>
          <stop offset="1" stopColor="#030610"/>
        </linearGradient>
      </defs>
      {/* Body — slightly rounder than S-series */}
      <rect x="1" y="1" width="50" height="98" rx="13" fill="url(#a-body)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2"/>
      <rect x="3.5" y="3.5" width="45" height="93" rx="11" fill="url(#a-screen)"/>
      {/* Punch-hole — slightly larger than S */}
      <circle cx="26" cy="11" r="3.2" fill="rgba(0,0,0,0.65)"/>
      <circle cx="26" cy="11" r="1.7" fill="#141c30"/>
      {/* Buttons */}
      <rect x="51" y="30" width="2" height="16" rx="1" fill="rgba(255,255,255,0.2)"/>
      <rect x="-1" y="26" width="2" height="12" rx="1" fill="rgba(255,255,255,0.2)"/>
      <rect x="-1" y="42" width="2" height="12" rx="1" fill="rgba(255,255,255,0.2)"/>
      {/* Home indicator */}
      <rect x="18" y="91" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.12)"/>
    </svg>
  );
}

// ── Galaxy Z Fold — open book shape with two screens ────────────────────────
function GalaxyFoldIcon({ size, className }: { size: number; className: string }) {
  // Landscape closed/half-open book shape
  const w = size * 0.90, h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 90 100" fill="none" className={className}>
      <defs>
        <linearGradient id="fold-body" x1="0" y1="0" x2="90" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1c2438"/>
          <stop offset="1" stopColor="#090d1c"/>
        </linearGradient>
        <linearGradient id="fold-left" x1="0" y1="0" x2="42" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0c1428"/>
          <stop offset="1" stopColor="#040810"/>
        </linearGradient>
        <linearGradient id="fold-right" x1="48" y1="0" x2="90" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0e182e"/>
          <stop offset="1" stopColor="#060a16"/>
        </linearGradient>
      </defs>
      {/* Left panel */}
      <rect x="1" y="2" width="40" height="96" rx="9" fill="url(#fold-body)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.2"/>
      <rect x="3" y="4" width="36" height="92" rx="7" fill="url(#fold-left)"/>
      {/* Right panel */}
      <rect x="49" y="2" width="40" height="96" rx="9" fill="url(#fold-body)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.2"/>
      <rect x="51" y="4" width="36" height="92" rx="7" fill="url(#fold-right)"/>
      {/* Hinge — thin gap in middle */}
      <rect x="41" y="2" width="8" height="96" rx="2" fill="#0a0d18"/>
      <rect x="43.5" y="8" width="3" height="84" rx="1.5" fill="rgba(255,255,255,0.06)"/>
      {/* Punch-hole on right panel */}
      <circle cx="69" cy="11" r="2.5" fill="rgba(0,0,0,0.65)"/>
      <circle cx="69" cy="11" r="1.3" fill="#14203a"/>
      {/* Screen content hints */}
      <rect x="7" y="18" width="28" height="4" rx="2" fill="rgba(255,255,255,0.07)"/>
      <rect x="7" y="26" width="22" height="3" rx="1.5" fill="rgba(255,255,255,0.05)"/>
      <rect x="55" y="18" width="28" height="4" rx="2" fill="rgba(255,255,255,0.07)"/>
      <rect x="55" y="26" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.05)"/>
      {/* Side button */}
      <rect x="89" y="30" width="2" height="18" rx="1" fill="rgba(255,255,255,0.2)"/>
      <rect x="-1" y="28" width="2" height="14" rx="1" fill="rgba(255,255,255,0.2)"/>
      {/* Home indicators */}
      <rect x="12" y="91" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.1)"/>
      <rect x="61" y="91" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.1)"/>
    </svg>
  );
}

// ── Galaxy Z Flip — compact flip phone (closed, small and square-ish) ────────
function GalaxyFlipIcon({ size, className }: { size: number; className: string }) {
  // Closed flip: short and slightly wide
  const w = size * 0.50, h = size * 0.62;
  return (
    <svg width={w} height={h} viewBox="0 0 50 62" fill="none" className={className}>
      <defs>
        <linearGradient id="flip-body" x1="0" y1="0" x2="50" y2="62" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1a1e2e"/>
          <stop offset="1" stopColor="#090b14"/>
        </linearGradient>
        <linearGradient id="flip-screen" x1="0" y1="0" x2="50" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0a1220"/>
          <stop offset="1" stopColor="#04080e"/>
        </linearGradient>
      </defs>
      {/* Upper half */}
      <rect x="1" y="1" width="48" height="28" rx="9" fill="url(#flip-body)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2"/>
      <rect x="3" y="3" width="44" height="24" rx="7.5" fill="url(#flip-screen)"/>
      {/* Cover display content */}
      <rect x="15" y="8" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.12)"/>
      <rect x="18" y="14" width="14" height="7" rx="3" fill="rgba(255,255,255,0.06)"/>
      {/* Hinge line */}
      <rect x="0" y="29.5" width="50" height="3" rx="0" fill="#06080f"/>
      <rect x="8" y="30.5" width="34" height="1" rx="0.5" fill="rgba(255,255,255,0.08)"/>
      {/* Lower half */}
      <rect x="1" y="33" width="48" height="28" rx="9" fill="url(#flip-body)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2"/>
      {/* Camera bump — two circles on upper half */}
      <circle cx="16" cy="18" r="4" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
      <circle cx="16" cy="18" r="2.5" fill="#0d1220"/>
      <circle cx="27" cy="18" r="4" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
      <circle cx="27" cy="18" r="2.5" fill="#0d1220"/>
      {/* Side button */}
      <rect x="49" y="34" width="2" height="14" rx="1" fill="rgba(255,255,255,0.22)"/>
      <rect x="-1" y="36" width="2" height="10" rx="1" fill="rgba(255,255,255,0.18)"/>
      {/* Home indicator on lower */}
      <rect x="17" y="56" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.12)"/>
    </svg>
  );
}

// ── Galaxy Tab — portrait tablet ─────────────────────────────────────────────
function GalaxyTabIcon({ size, className }: { size: number; className: string }) {
  const w = size * 0.74, h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 74 100" fill="none" className={className}>
      <defs>
        <linearGradient id="tab-body" x1="0" y1="0" x2="74" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1c2438"/>
          <stop offset="1" stopColor="#090e1e"/>
        </linearGradient>
        <linearGradient id="tab-screen" x1="0" y1="0" x2="74" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0c1628"/>
          <stop offset="1" stopColor="#040910"/>
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="72" height="98" rx="10" fill="url(#tab-body)" stroke="rgba(255,255,255,0.13)" strokeWidth="1.2"/>
      <rect x="3.5" y="3.5" width="67" height="93" rx="8" fill="url(#tab-screen)"/>
      {/* Front camera — top center */}
      <circle cx="37" cy="8" r="2.5" fill="rgba(0,0,0,0.5)"/>
      <circle cx="37" cy="8" r="1.3" fill="#111822"/>
      {/* S Pen slot indicator — bottom edge */}
      <rect x="12" y="96.5" width="50" height="2" rx="1" fill="rgba(255,255,255,0.1)"/>
      {/* Side button */}
      <rect x="73" y="28" width="2" height="18" rx="1" fill="rgba(255,255,255,0.22)"/>
      <rect x="-1" y="26" width="2" height="12" rx="1" fill="rgba(255,255,255,0.2)"/>
      <rect x="-1" y="42" width="2" height="12" rx="1" fill="rgba(255,255,255,0.2)"/>
      {/* App grid hint */}
      {[0,1,2].map(col => [0,1,2,3].map(row => (
        <rect
          key={`${col}-${row}`}
          x={13 + col * 18} y={20 + row * 18}
          width="12" height="12" rx="3"
          fill="rgba(255,255,255,0.05)"
        />
      )))}
    </svg>
  );
}

// ── Galaxy Book — laptop ─────────────────────────────────────────────────────
function GalaxyBookIcon({ size, className }: { size: number; className: string }) {
  const w = size * 1.6, h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 160 100" fill="none" className={className}>
      <defs>
        <linearGradient id="book-lid" x1="8" y1="2" x2="152" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e2438"/>
          <stop offset="1" stopColor="#0c1020"/>
        </linearGradient>
        <linearGradient id="book-screen" x1="13" y1="6" x2="147" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0a1228"/>
          <stop offset="1" stopColor="#040810"/>
        </linearGradient>
        <linearGradient id="book-base" x1="0" y1="80" x2="160" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#161c2e"/>
          <stop offset="1" stopColor="#090c18"/>
        </linearGradient>
      </defs>
      {/* Lid */}
      <rect x="6" y="2" width="148" height="78" rx="6" fill="url(#book-lid)" stroke="rgba(255,255,255,0.13)" strokeWidth="1.2"/>
      <rect x="11" y="6" width="138" height="70" rx="4.5" fill="url(#book-screen)"/>
      {/* Webcam */}
      <circle cx="80" cy="9" r="2" fill="rgba(0,0,0,0.6)"/>
      <circle cx="80" cy="9" r="1" fill="#161e30"/>
      {/* Screen content hint */}
      <rect x="20" y="20" width="90" height="8" rx="3" fill="rgba(255,255,255,0.06)"/>
      <rect x="20" y="34" width="70" height="5" rx="2.5" fill="rgba(255,255,255,0.04)"/>
      <rect x="20" y="44" width="80" height="5" rx="2.5" fill="rgba(255,255,255,0.04)"/>
      {/* Base */}
      <path d="M0 82 L160 82 L158 98 C158 99.1 157.1 100 156 100 L4 100 C2.9 100 2 99.1 2 98 Z" fill="url(#book-base)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      {/* Keyboard */}
      <rect x="12" y="84" width="136" height="9" rx="3" fill="rgba(0,0,0,0.2)"/>
      {/* Trackpad — Samsung style, centered */}
      <rect x="54" y="85" width="52" height="7" rx="2" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.5"/>
    </svg>
  );
}
