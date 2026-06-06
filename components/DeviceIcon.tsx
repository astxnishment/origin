// Premium SVG device silhouettes — no image files required

export type DeviceType = "iphone" | "samsung" | "pixel" | "ipad" | "macbook" | "laptop" | "console";

interface Props {
  device: DeviceType;
  className?: string;
  size?: number;
}

export function DeviceIcon({ device, className = "", size = 120 }: Props) {
  switch (device) {
    case "iphone":
      return <IPhoneIcon size={size} className={className} />;
    case "samsung":
      return <SamsungIcon size={size} className={className} />;
    case "pixel":
      return <PixelIcon size={size} className={className} />;
    case "ipad":
      return <IPadIcon size={size} className={className} />;
    case "macbook":
      return <MacBookIcon size={size} className={className} />;
    case "laptop":
      return <LaptopIcon size={size} className={className} />;
    case "console":
      return <ConsoleIcon size={size} className={className} />;
  }
}

// ── iPhone (Dynamic Island pill top, slim bezels) ───────────────
function IPhoneIcon({ size, className }: { size: number; className: string }) {
  const w = size * 0.52;
  const h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 52 100" fill="none" className={className}>
      {/* Body */}
      <rect x="1" y="1" width="50" height="98" rx="11" fill="url(#iphoneBody)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      {/* Screen */}
      <rect x="4" y="4" width="44" height="92" rx="9" fill="url(#iphoneScreen)" />
      {/* Dynamic Island */}
      <rect x="17" y="9" width="18" height="7" rx="3.5" fill="rgba(0,0,0,0.7)" />
      {/* Side button */}
      <rect x="51" y="28" width="2" height="16" rx="1" fill="rgba(255,255,255,0.3)" />
      {/* Volume buttons */}
      <rect x="-1" y="24" width="2" height="10" rx="1" fill="rgba(255,255,255,0.3)" />
      <rect x="-1" y="38" width="2" height="10" rx="1" fill="rgba(255,255,255,0.3)" />
      <defs>
        <linearGradient id="iphoneBody" x1="0" y1="0" x2="52" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(40,40,45,1)" />
          <stop offset="1" stopColor="rgba(20,20,22,1)" />
        </linearGradient>
        <linearGradient id="iphoneScreen" x1="4" y1="4" x2="48" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(15,20,40,1)" />
          <stop offset="1" stopColor="rgba(5,8,20,1)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Samsung (flatter Dynamic Island row, slightly wider) ─────────
function SamsungIcon({ size, className }: { size: number; className: string }) {
  const w = size * 0.54;
  const h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 54 100" fill="none" className={className}>
      <rect x="1" y="1" width="52" height="98" rx="12" fill="url(#samsungBody)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <rect x="4.5" y="4.5" width="45" height="91" rx="10" fill="url(#samsungScreen)" />
      {/* Punch hole camera */}
      <circle cx="27" cy="12" r="3" fill="rgba(0,0,0,0.6)" />
      <circle cx="27" cy="12" r="1.5" fill="rgba(30,30,50,1)" />
      {/* Side buttons */}
      <rect x="53" y="30" width="2" height="18" rx="1" fill="rgba(255,255,255,0.25)" />
      <rect x="-1" y="26" width="2" height="12" rx="1" fill="rgba(255,255,255,0.25)" />
      <rect x="-1" y="42" width="2" height="12" rx="1" fill="rgba(255,255,255,0.25)" />
      <defs>
        <linearGradient id="samsungBody" x1="0" y1="0" x2="54" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(28,35,55,1)" />
          <stop offset="1" stopColor="rgba(10,15,28,1)" />
        </linearGradient>
        <linearGradient id="samsungScreen" x1="4" y1="4" x2="50" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(10,18,45,1)" />
          <stop offset="1" stopColor="rgba(4,8,20,1)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Google Pixel (horizontal bar camera) ────────────────────────
function PixelIcon({ size, className }: { size: number; className: string }) {
  const w = size * 0.52;
  const h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 52 100" fill="none" className={className}>
      <rect x="1" y="1" width="50" height="98" rx="11" fill="url(#pixelBody)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <rect x="4" y="4" width="44" height="92" rx="9" fill="url(#pixelScreen)" />
      {/* Pill camera */}
      <rect x="14" y="8" width="24" height="7" rx="3.5" fill="rgba(0,0,0,0.65)" />
      <circle cx="21" cy="11.5" r="2" fill="rgba(20,20,30,1)" />
      <circle cx="31" cy="11.5" r="2" fill="rgba(20,20,30,1)" />
      <rect x="51" y="28" width="2" height="14" rx="1" fill="rgba(255,255,255,0.25)" />
      <rect x="-1" y="26" width="2" height="20" rx="1" fill="rgba(255,255,255,0.25)" />
      <defs>
        <linearGradient id="pixelBody" x1="0" y1="0" x2="52" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(30,38,32,1)" />
          <stop offset="1" stopColor="rgba(12,18,14,1)" />
        </linearGradient>
        <linearGradient id="pixelScreen" x1="4" y1="4" x2="48" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(10,20,15,1)" />
          <stop offset="1" stopColor="rgba(4,9,6,1)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── iPad ────────────────────────────────────────────────────────
function IPadIcon({ size, className }: { size: number; className: string }) {
  const w = size * 0.74;
  const h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 74 100" fill="none" className={className}>
      <rect x="1" y="1" width="72" height="98" rx="10" fill="url(#ipadBody)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <rect x="4" y="4" width="66" height="92" rx="8" fill="url(#ipadScreen)" />
      {/* Front camera */}
      <circle cx="37" cy="8" r="2.5" fill="rgba(0,0,0,0.5)" />
      {/* Side button */}
      <rect x="73" y="30" width="2" height="16" rx="1" fill="rgba(255,255,255,0.25)" />
      <rect x="-1" y="28" width="2" height="12" rx="1" fill="rgba(255,255,255,0.25)" />
      <defs>
        <linearGradient id="ipadBody" x1="0" y1="0" x2="74" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(40,40,48,1)" />
          <stop offset="1" stopColor="rgba(18,18,24,1)" />
        </linearGradient>
        <linearGradient id="ipadScreen" x1="4" y1="4" x2="70" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(12,18,35,1)" />
          <stop offset="1" stopColor="rgba(5,8,18,1)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── MacBook ─────────────────────────────────────────────────────
function MacBookIcon({ size, className }: { size: number; className: string }) {
  const w = size * 1.6;
  const h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 160 100" fill="none" className={className}>
      {/* Lid */}
      <rect x="8" y="2" width="144" height="78" rx="6" fill="url(#macbookLid)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
      {/* Screen bezel inner */}
      <rect x="13" y="6" width="134" height="70" rx="4" fill="url(#macbookScreen)" />
      {/* Notch */}
      <rect x="71" y="6" width="18" height="6" rx="3" fill="rgba(20,20,25,0.9)" />
      {/* Base */}
      <path d="M2 82 C2 80.9 2.9 80 4 80 L156 80 C157.1 80 158 80.9 158 82 L160 98 C160 99.1 159.1 100 158 100 L2 100 C0.9 100 0 99.1 0 98 L2 82Z" fill="url(#macbookBase)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      {/* Keyboard area */}
      <rect x="10" y="84" width="140" height="8" rx="3" fill="rgba(0,0,0,0.2)" />
      {/* Trackpad */}
      <rect x="56" y="84" width="48" height="7" rx="2" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      {/* Apple logo hint */}
      <circle cx="80" cy="40" r="6" fill="rgba(255,255,255,0.04)" />
      <defs>
        <linearGradient id="macbookLid" x1="8" y1="2" x2="152" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(38,38,42,1)" />
          <stop offset="1" stopColor="rgba(22,22,26,1)" />
        </linearGradient>
        <linearGradient id="macbookScreen" x1="13" y1="6" x2="147" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(10,15,30,1)" />
          <stop offset="1" stopColor="rgba(4,6,14,1)" />
        </linearGradient>
        <linearGradient id="macbookBase" x1="0" y1="80" x2="160" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(32,32,36,1)" />
          <stop offset="1" stopColor="rgba(18,18,22,1)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Generic Laptop ───────────────────────────────────────────────
function LaptopIcon({ size, className }: { size: number; className: string }) {
  const w = size * 1.6;
  const h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 160 100" fill="none" className={className}>
      <rect x="8" y="2" width="144" height="78" rx="5" fill="url(#laptopLid)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" />
      <rect x="14" y="7" width="132" height="69" rx="3" fill="url(#laptopScreen)" />
      {/* Webcam */}
      <circle cx="80" cy="10" r="2" fill="rgba(0,0,0,0.5)" />
      <path d="M2 82 C2 80.9 2.9 80 4 80 L156 80 C157.1 80 158 80.9 158 82 L160 98 C160 99.1 159.1 100 158 100 L2 100 C0.9 100 0 99.1 0 98 L2 82Z" fill="url(#laptopBase)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <rect x="55" y="85" width="50" height="6" rx="2" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
      <defs>
        <linearGradient id="laptopLid" x1="8" y1="2" x2="152" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(35,38,45,1)" />
          <stop offset="1" stopColor="rgba(18,20,26,1)" />
        </linearGradient>
        <linearGradient id="laptopScreen" x1="14" y1="7" x2="146" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(8,12,25,1)" />
          <stop offset="1" stopColor="rgba(3,5,12,1)" />
        </linearGradient>
        <linearGradient id="laptopBase" x1="0" y1="80" x2="160" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(28,30,38,1)" />
          <stop offset="1" stopColor="rgba(15,16,22,1)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Console controller ──────────────────────────────────────────
function ConsoleIcon({ size, className }: { size: number; className: string }) {
  const w = size * 1.4;
  const h = size * 0.76;
  return (
    <svg width={w} height={h} viewBox="0 0 140 76" fill="none" className={className}>
      {/* Main body */}
      <path d="M20 20 C20 10 30 4 40 4 L100 4 C110 4 120 10 120 20 L130 60 C132 70 124 72 118 72 L22 72 C16 72 8 70 10 60 Z" fill="url(#consoleBody)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
      {/* Grips */}
      <ellipse cx="28" cy="62" rx="20" ry="14" fill="url(#consoleGrip)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <ellipse cx="112" cy="62" rx="20" ry="14" fill="url(#consoleGrip)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* Screen/touchpad */}
      <rect x="48" y="18" width="44" height="28" rx="4" fill="url(#consoleScreen)" />
      {/* D-pad */}
      <rect x="28" y="30" width="16" height="5" rx="1.5" fill="rgba(255,255,255,0.2)" />
      <rect x="33.5" y="24.5" width="5" height="16" rx="1.5" fill="rgba(255,255,255,0.2)" />
      {/* ABXY buttons */}
      <circle cx="96" cy="27" r="3.5" fill="rgba(255,100,100,0.6)" />
      <circle cx="104" cy="35" r="3.5" fill="rgba(100,100,255,0.6)" />
      <circle cx="96" cy="43" r="3.5" fill="rgba(100,200,100,0.6)" />
      <circle cx="88" cy="35" r="3.5" fill="rgba(255,200,50,0.6)" />
      <defs>
        <linearGradient id="consoleBody" x1="10" y1="4" x2="130" y2="72" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(35,35,42,1)" />
          <stop offset="1" stopColor="rgba(18,18,24,1)" />
        </linearGradient>
        <linearGradient id="consoleGrip" x1="8" y1="48" x2="132" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(28,28,34,1)" />
          <stop offset="1" stopColor="rgba(14,14,18,1)" />
        </linearGradient>
        <linearGradient id="consoleScreen" x1="48" y1="18" x2="92" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(10,15,35,1)" />
          <stop offset="1" stopColor="rgba(4,6,15,1)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
