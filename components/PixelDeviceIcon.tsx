/**
 * PixelDeviceIcon — inline SVG icons styled as Google Pixel devices.
 *
 * Each variant captures the key visual identity of that Pixel generation:
 * - pixel6: thick horizontal camera visor bar
 * - pixel7: aluminium visor bar, flat sides
 * - pixel8: rounded corners, compact visor
 * - pixel9 / pixel9pro: polished visor, round corners
 * - pixelfold: book-style foldable
 * - generic: clean generic Pixel-like phone
 */

import type { PixelVariant } from "@/lib/deviceImages/googlePixelDeviceImages";

interface Props {
  variant: PixelVariant;
  className?: string;
  size?: number;
}

export function PixelDeviceIcon({ variant, className = "", size = 120 }: Props) {
  switch (variant) {
    case "pixel6":    return <Pixel6Icon    size={size} className={className} />;
    case "pixel7":    return <Pixel7Icon    size={size} className={className} />;
    case "pixel8":    return <Pixel8Icon    size={size} className={className} />;
    case "pixel9":    return <Pixel9Icon    size={size} className={className} />;
    case "pixel9pro": return <Pixel9ProIcon size={size} className={className} />;
    case "pixelfold": return <PixelFoldIcon size={size} className={className} />;
    case "generic":
    default:          return <Pixel9Icon    size={size} className={className} />;
  }
}

// ── Shared gradients helper ───────────────────────────────────────────────────
// Each icon embeds its own defs with unique IDs to avoid conflicts.

// ── Pixel 6 / 6 Pro — thick camera visor band across the back (front view: wide pill camera) ──
function Pixel6Icon({ size, className }: { size: number; className: string }) {
  const w = size * 0.52, h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 52 100" fill="none" className={className}>
      <defs>
        <linearGradient id="p6-body" x1="0" y1="0" x2="52" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e2830"/>
          <stop offset="1" stopColor="#0a1018"/>
        </linearGradient>
        <linearGradient id="p6-screen" x1="0" y1="0" x2="52" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0c1822"/>
          <stop offset="1" stopColor="#040a0e"/>
        </linearGradient>
        <linearGradient id="p6-visor" x1="4" y1="8" x2="48" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0d1a20"/>
          <stop offset="1" stopColor="#060e14"/>
        </linearGradient>
      </defs>
      {/* Body */}
      <rect x="1" y="1" width="50" height="98" rx="11" fill="url(#p6-body)" stroke="rgba(255,255,255,0.13)" strokeWidth="1.2"/>
      {/* Screen */}
      <rect x="3.5" y="3.5" width="45" height="93" rx="9" fill="url(#p6-screen)"/>
      {/* Wide camera pill — Pixel 6 signature front camera */}
      <rect x="14" y="8" width="24" height="8" rx="4" fill="url(#p6-visor)"/>
      {/* Two camera dots inside pill */}
      <circle cx="21" cy="12" r="2.2" fill="rgba(10,10,20,0.8)"/>
      <circle cx="21" cy="12" r="1.2" fill="#161e28"/>
      <circle cx="31" cy="12" r="2.2" fill="rgba(10,10,20,0.8)"/>
      <circle cx="31" cy="12" r="1.2" fill="#161e28"/>
      {/* Buttons */}
      <rect x="51" y="30" width="2" height="18" rx="1" fill="rgba(255,255,255,0.22)"/>
      <rect x="-1" y="28" width="2" height="20" rx="1" fill="rgba(255,255,255,0.18)"/>
      {/* Google G hint — bottom center */}
      <circle cx="26" cy="88" r="3.5" fill="rgba(255,255,255,0.05)"/>
      {/* Home indicator */}
      <rect x="18" y="91" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.14)"/>
    </svg>
  );
}

// ── Pixel 7 / 7a — aluminium visor bar, flat sides ──────────────────────────
function Pixel7Icon({ size, className }: { size: number; className: string }) {
  const w = size * 0.51, h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 51 100" fill="none" className={className}>
      <defs>
        <linearGradient id="p7-body" x1="0" y1="0" x2="51" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1c2434"/>
          <stop offset="1" stopColor="#080e1a"/>
        </linearGradient>
        <linearGradient id="p7-screen" x1="0" y1="0" x2="51" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0b1520"/>
          <stop offset="1" stopColor="#03080e"/>
        </linearGradient>
        <linearGradient id="p7-visor" x1="4" y1="8" x2="47" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2a3040"/>
          <stop offset="1" stopColor="#181e2a"/>
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="49" height="98" rx="10" fill="url(#p7-body)" stroke="rgba(255,255,255,0.13)" strokeWidth="1.2"/>
      <rect x="3.5" y="3.5" width="44" height="93" rx="8.5" fill="url(#p7-screen)"/>
      {/* Aluminium visor bar — Pixel 7 style (slightly narrower pill) */}
      <rect x="12" y="9" width="27" height="7" rx="3.5" fill="url(#p7-visor)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
      {/* Dual camera + flash */}
      <circle cx="19" cy="12.5" r="2" fill="rgba(5,5,10,0.9)"/>
      <circle cx="19" cy="12.5" r="1.1" fill="#14202e"/>
      <circle cx="28" cy="12.5" r="2" fill="rgba(5,5,10,0.9)"/>
      <circle cx="28" cy="12.5" r="1.1" fill="#14202e"/>
      <circle cx="36" cy="12.5" r="1.2" fill="rgba(255,200,100,0.35)"/>
      <rect x="51" y="30" width="1.5" height="16" rx="0.75" fill="rgba(255,255,255,0.2)"/>
      <rect x="-0.5" y="28" width="1.5" height="18" rx="0.75" fill="rgba(255,255,255,0.18)"/>
      <rect x="17" y="91" width="17" height="3" rx="1.5" fill="rgba(255,255,255,0.13)"/>
    </svg>
  );
}

// ── Pixel 8 / 8a — compact with rounded body, refined visor ──────────────────
function Pixel8Icon({ size, className }: { size: number; className: string }) {
  const w = size * 0.50, h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 50 100" fill="none" className={className}>
      <defs>
        <linearGradient id="p8-body" x1="0" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#202838"/>
          <stop offset="1" stopColor="#0c1020"/>
        </linearGradient>
        <linearGradient id="p8-screen" x1="0" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0d1828"/>
          <stop offset="1" stopColor="#04080e"/>
        </linearGradient>
        <linearGradient id="p8-visor" x1="6" y1="8" x2="44" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#28303e"/>
          <stop offset="1" stopColor="#141820"/>
        </linearGradient>
      </defs>
      {/* More rounded corners — Pixel 8 design language */}
      <rect x="1" y="1" width="48" height="98" rx="14" fill="url(#p8-body)" stroke="rgba(255,255,255,0.13)" strokeWidth="1.2"/>
      <rect x="3.5" y="3.5" width="43" height="93" rx="12" fill="url(#p8-screen)"/>
      {/* Narrower, more refined visor pill */}
      <rect x="13" y="9.5" width="24" height="6" rx="3" fill="url(#p8-visor)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"/>
      <circle cx="20" cy="12.5" r="1.8" fill="rgba(5,5,10,0.9)"/>
      <circle cx="20" cy="12.5" r="1" fill="#141e2c"/>
      <circle cx="29" cy="12.5" r="1.8" fill="rgba(5,5,10,0.9)"/>
      <circle cx="29" cy="12.5" r="1" fill="#141e2c"/>
      {/* Temperature sensor dot — Pixel 8 Pro feature */}
      <circle cx="36" cy="12.5" r="1.1" fill="rgba(255,255,255,0.12)"/>
      <rect x="49" y="30" width="2" height="16" rx="1" fill="rgba(255,255,255,0.22)"/>
      <rect x="-1" y="28" width="2" height="18" rx="1" fill="rgba(255,255,255,0.18)"/>
      <rect x="17" y="91" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.13)"/>
    </svg>
  );
}

// ── Pixel 9 — polished visor, very round corners ─────────────────────────────
function Pixel9Icon({ size, className }: { size: number; className: string }) {
  const w = size * 0.49, h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 49 100" fill="none" className={className}>
      <defs>
        <linearGradient id="p9-body" x1="0" y1="0" x2="49" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e2638"/>
          <stop offset="1" stopColor="#0a0e1c"/>
        </linearGradient>
        <linearGradient id="p9-screen" x1="0" y1="0" x2="49" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0c1630"/>
          <stop offset="1" stopColor="#040810"/>
        </linearGradient>
        <linearGradient id="p9-visor" x1="6" y1="8" x2="43" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#303848"/>
          <stop offset="1" stopColor="#181e2c"/>
        </linearGradient>
      </defs>
      {/* Very round corners — Pixel 9 signature */}
      <rect x="1" y="1" width="47" height="98" rx="16" fill="url(#p9-body)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.2"/>
      <rect x="3.5" y="3.5" width="42" height="93" rx="14" fill="url(#p9-screen)"/>
      {/* Wide polished visor bar */}
      <rect x="9" y="9" width="31" height="7" rx="3.5" fill="url(#p9-visor)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6"/>
      {/* Triple camera dots */}
      <circle cx="17" cy="12.5" r="1.8" fill="rgba(4,5,10,0.9)"/>
      <circle cx="17" cy="12.5" r="1" fill="#14203a"/>
      <circle cx="24.5" cy="12.5" r="1.8" fill="rgba(4,5,10,0.9)"/>
      <circle cx="24.5" cy="12.5" r="1" fill="#14203a"/>
      <circle cx="32" cy="12.5" r="1.8" fill="rgba(4,5,10,0.9)"/>
      <circle cx="32" cy="12.5" r="1" fill="#14203a"/>
      {/* Buttons — flat sides */}
      <rect x="48" y="28" width="2" height="18" rx="1" fill="rgba(255,255,255,0.22)"/>
      <rect x="-1" y="26" width="2" height="20" rx="1" fill="rgba(255,255,255,0.18)"/>
      {/* Home indicator */}
      <rect x="16" y="91" width="17" height="3" rx="1.5" fill="rgba(255,255,255,0.15)"/>
      {/* Subtle screen status bar */}
      <rect x="8" y="6" width="14" height="2" rx="1" fill="rgba(255,255,255,0.07)"/>
      <rect x="35" y="6" width="6" height="2" rx="1" fill="rgba(255,255,255,0.06)"/>
    </svg>
  );
}

// ── Pixel 9 Pro / Pro XL — wider, premium feel ───────────────────────────────
function Pixel9ProIcon({ size, className }: { size: number; className: string }) {
  const w = size * 0.52, h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 52 100" fill="none" className={className}>
      <defs>
        <linearGradient id="p9p-body" x1="0" y1="0" x2="52" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#202a3e"/>
          <stop offset="1" stopColor="#0c1020"/>
        </linearGradient>
        <linearGradient id="p9p-screen" x1="0" y1="0" x2="52" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0e1832"/>
          <stop offset="1" stopColor="#050912"/>
        </linearGradient>
        <linearGradient id="p9p-visor" x1="8" y1="8" x2="44" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#343c50"/>
          <stop offset="1" stopColor="#1c2030"/>
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="50" height="98" rx="16" fill="url(#p9p-body)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.3"/>
      <rect x="3.5" y="3.5" width="45" height="93" rx="14" fill="url(#p9p-screen)"/>
      {/* Wider polished visor — Pro has wider bar */}
      <rect x="8" y="8.5" width="36" height="8.5" rx="4.25" fill="url(#p9p-visor)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.7"/>
      {/* Four sensor dots (Pro has extra sensors) */}
      <circle cx="16" cy="12.75" r="2" fill="rgba(4,5,10,0.9)"/>
      <circle cx="16" cy="12.75" r="1.1" fill="#14203e"/>
      <circle cx="23.5" cy="12.75" r="2" fill="rgba(4,5,10,0.9)"/>
      <circle cx="23.5" cy="12.75" r="1.1" fill="#14203e"/>
      <circle cx="31" cy="12.75" r="2" fill="rgba(4,5,10,0.9)"/>
      <circle cx="31" cy="12.75" r="1.1" fill="#14203e"/>
      <circle cx="38.5" cy="12.75" r="1.3" fill="rgba(255,200,80,0.4)"/>
      <rect x="51" y="27" width="2" height="20" rx="1" fill="rgba(255,255,255,0.22)"/>
      <rect x="-1" y="25" width="2" height="22" rx="1" fill="rgba(255,255,255,0.18)"/>
      <rect x="17" y="91" width="18" height="3" rx="1.5" fill="rgba(255,255,255,0.15)"/>
    </svg>
  );
}

// ── Pixel Fold — open book foldable ──────────────────────────────────────────
function PixelFoldIcon({ size, className }: { size: number; className: string }) {
  const w = size * 0.88, h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 88 100" fill="none" className={className}>
      <defs>
        <linearGradient id="pf-body" x1="0" y1="0" x2="88" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1c2430"/>
          <stop offset="1" stopColor="#080c16"/>
        </linearGradient>
        <linearGradient id="pf-left" x1="0" y1="0" x2="40" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0c1622"/>
          <stop offset="1" stopColor="#03070d"/>
        </linearGradient>
        <linearGradient id="pf-right" x1="46" y1="0" x2="88" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0e1828"/>
          <stop offset="1" stopColor="#050a12"/>
        </linearGradient>
        <linearGradient id="pf-visor" x1="48" y1="8" x2="86" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2c343e"/>
          <stop offset="1" stopColor="#161c22"/>
        </linearGradient>
      </defs>
      {/* Left panel */}
      <rect x="1" y="2" width="38" height="96" rx="8" fill="url(#pf-body)" stroke="rgba(255,255,255,0.13)" strokeWidth="1.2"/>
      <rect x="3" y="4" width="34" height="92" rx="6.5" fill="url(#pf-left)"/>
      {/* Right panel */}
      <rect x="49" y="2" width="38" height="96" rx="8" fill="url(#pf-body)" stroke="rgba(255,255,255,0.13)" strokeWidth="1.2"/>
      <rect x="51" y="4" width="34" height="92" rx="6.5" fill="url(#pf-right)"/>
      {/* Google Pixel visor on right panel */}
      <rect x="51" y="8" width="34" height="7" rx="3.5" fill="url(#pf-visor)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
      <circle cx="60" cy="11.5" r="1.8" fill="rgba(4,5,10,0.9)"/>
      <circle cx="60" cy="11.5" r="1" fill="#14202a"/>
      <circle cx="68" cy="11.5" r="1.8" fill="rgba(4,5,10,0.9)"/>
      <circle cx="68" cy="11.5" r="1" fill="#14202a"/>
      {/* Hinge */}
      <rect x="39" y="2" width="10" height="96" rx="1" fill="#06080f"/>
      <rect x="42.5" y="8" width="3" height="84" rx="1.5" fill="rgba(255,255,255,0.05)"/>
      {/* Screen content hints */}
      <rect x="7" y="20" width="26" height="4" rx="2" fill="rgba(255,255,255,0.07)"/>
      <rect x="7" y="28" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.05)"/>
      <rect x="55" y="20" width="26" height="4" rx="2" fill="rgba(255,255,255,0.07)"/>
      <rect x="55" y="28" width="18" height="3" rx="1.5" fill="rgba(255,255,255,0.05)"/>
      <rect x="87" y="30" width="2" height="18" rx="1" fill="rgba(255,255,255,0.2)"/>
      <rect x="-1" y="28" width="2" height="14" rx="1" fill="rgba(255,255,255,0.2)"/>
      <rect x="9" y="91" width="18" height="3" rx="1.5" fill="rgba(255,255,255,0.1)"/>
      <rect x="60" y="91" width="18" height="3" rx="1.5" fill="rgba(255,255,255,0.1)"/>
    </svg>
  );
}
