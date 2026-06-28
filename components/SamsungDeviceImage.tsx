export default function SamsungDeviceImage({ size = 240, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size * 0.46} height={size} viewBox="0 0 138 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="g-frame" x1="0" y1="0" x2="138" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3a3d45"/>
          <stop offset="45%" stopColor="#26282f"/>
          <stop offset="100%" stopColor="#16181d"/>
        </linearGradient>
        <linearGradient id="g-frame-side-l" x1="0" y1="0" x2="6" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4a4e5a"/>
          <stop offset="100%" stopColor="#2a2d35"/>
        </linearGradient>
        <linearGradient id="g-frame-side-r" x1="0" y1="0" x2="6" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2a2d35"/>
          <stop offset="100%" stopColor="#4a4e5a"/>
        </linearGradient>
        <linearGradient id="g-screen" x1="20" y1="20" x2="118" y2="280" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#141820"/>
          <stop offset="100%" stopColor="#070910"/>
        </linearGradient>
        <linearGradient id="g-wallpaper" x1="0" y1="0" x2="118" y2="260" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1a2240"/>
          <stop offset="60%" stopColor="#0c1028"/>
          <stop offset="100%" stopColor="#060812"/>
        </linearGradient>
        <radialGradient id="g-orb-1" cx="30%" cy="25%" r="45%">
          <stop offset="0%" stopColor="rgba(59,130,246,0.3)"/>
          <stop offset="100%" stopColor="rgba(59,130,246,0)"/>
        </radialGradient>
        <radialGradient id="g-orb-2" cx="75%" cy="70%" r="35%">
          <stop offset="0%" stopColor="rgba(139,92,246,0.2)"/>
          <stop offset="100%" stopColor="rgba(139,92,246,0)"/>
        </radialGradient>
        <linearGradient id="g-cam-island" x1="8" y1="10" x2="52" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e2028"/>
          <stop offset="100%" stopColor="#0e1018"/>
        </linearGradient>
        <radialGradient id="g-lens-1" cx="38%" cy="30%" r="55%">
          <stop offset="0%" stopColor="#374060"/>
          <stop offset="55%" stopColor="#111828"/>
          <stop offset="100%" stopColor="#050810"/>
        </radialGradient>
        <radialGradient id="g-lens-2" cx="38%" cy="30%" r="55%">
          <stop offset="0%" stopColor="#2a3450"/>
          <stop offset="55%" stopColor="#0d1422"/>
          <stop offset="100%" stopColor="#040710"/>
        </radialGradient>
        <radialGradient id="g-lens-flash" cx="38%" cy="30%" r="55%">
          <stop offset="0%" stopColor="#fffde0"/>
          <stop offset="60%" stopColor="#e8c840"/>
          <stop offset="100%" stopColor="#b89820"/>
        </radialGradient>
        <linearGradient id="g-sheen" x1="10" y1="15" x2="80" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.04)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </linearGradient>
        <linearGradient id="g-highlight-l" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.12)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </linearGradient>
        <clipPath id="c-screen">
          <rect x="6" y="6" width="126" height="288" rx="18"/>
        </clipPath>
        <filter id="f-lens-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="f-soft" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.8"/>
        </filter>
      </defs>

      {/* ── Outer titanium frame ── */}
      <rect x="0.5" y="0.5" width="137" height="299" rx="22" fill="url(#g-frame)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>

      {/* Left edge highlight */}
      <rect x="0.5" y="20" width="5" height="260" rx="2.5" fill="url(#g-frame-side-l)" opacity="0.6"/>
      {/* Right edge */}
      <rect x="132.5" y="20" width="5" height="260" rx="2.5" fill="url(#g-frame-side-r)" opacity="0.6"/>

      {/* ── Screen bezel ── */}
      <rect x="6" y="6" width="126" height="288" rx="18" fill="url(#g-screen)"/>

      {/* Wallpaper */}
      <rect x="6" y="6" width="126" height="288" rx="18" fill="url(#g-wallpaper)" clipPath="url(#c-screen)"/>
      <ellipse cx="40" cy="80" rx="65" ry="60" fill="url(#g-orb-1)" clipPath="url(#c-screen)"/>
      <ellipse cx="100" cy="210" rx="50" ry="45" fill="url(#g-orb-2)" clipPath="url(#c-screen)"/>

      {/* Screen sheen reflection */}
      <rect x="6" y="6" width="126" height="288" rx="18" fill="url(#g-sheen)" clipPath="url(#c-screen)"/>

      {/* ── Status bar ── */}
      <rect x="18" y="14" width="28" height="2" rx="1" fill="rgba(255,255,255,0.15)"/>
      <circle cx="112" cy="15" r="1.5" fill="rgba(255,255,255,0.2)"/>
      <rect x="100" y="14" width="8" height="2" rx="1" fill="rgba(255,255,255,0.12)"/>
      <rect x="90" y="14" width="7" height="2" rx="1" fill="rgba(255,255,255,0.1)"/>

      {/* ── Punch-hole selfie camera ── */}
      <circle cx="69" cy="20" r="4.5" fill="#030508"/>
      <circle cx="69" cy="20" r="2.8" fill="#0a0e18"/>
      <circle cx="67.8" cy="18.8" r="0.9" fill="rgba(255,255,255,0.18)"/>

      {/* ── Lock screen UI ── */}
      {/* Time */}
      <text x="69" y="110" textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="36" fontWeight="200" fontFamily="-apple-system, system-ui, sans-serif" letterSpacing="-1">12:47</text>
      <text x="69" y="126" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="-apple-system, system-ui, sans-serif" fontWeight="300">Thursday, 26 June</text>

      {/* Notification pill */}
      <rect x="22" y="148" width="94" height="24" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75"/>
      <circle cx="36" cy="160" r="5" fill="rgba(59,130,246,0.4)"/>
      <rect x="46" y="156" width="36" height="2.5" rx="1.25" fill="rgba(255,255,255,0.2)"/>
      <rect x="46" y="161" width="24" height="2" rx="1" fill="rgba(255,255,255,0.1)"/>

      {/* Bottom quick-access icons */}
      <circle cx="46" cy="245" r="11" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.75"/>
      <circle cx="92" cy="245" r="11" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.75"/>
      {/* Flashlight icon */}
      <rect x="43" y="239" width="6" height="9" rx="1.5" fill="rgba(255,255,255,0.35)"/>
      <rect x="44.5" y="238" width="3" height="2" rx="0.75" fill="rgba(255,255,255,0.2)"/>
      {/* Camera icon */}
      <circle cx="92" cy="245" r="5" fill="rgba(255,255,255,0)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2"/>
      <circle cx="92" cy="245" r="2.5" fill="rgba(255,255,255,0.25)"/>

      {/* Home bar */}
      <rect x="50" y="278" width="38" height="4" rx="2" fill="rgba(255,255,255,0.25)"/>

      {/* ── Camera island — raised bump top-left ── */}
      {/* Shadow behind island */}
      <rect x="8" y="10" width="54" height="82" rx="14" fill="rgba(0,0,0,0.5)" filter="url(#f-soft)"/>
      {/* Island body */}
      <rect x="9" y="11" width="52" height="80" rx="13" fill="url(#g-cam-island)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75"/>

      {/* ── Camera lenses ── */}
      {/* Main wide — top-left, largest */}
      <circle cx="30" cy="32" r="13.5" fill="rgba(0,0,0,0.7)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.75"/>
      <circle cx="30" cy="32" r="11.5" fill="url(#g-lens-1)"/>
      <circle cx="30" cy="32" r="8.5" fill="rgba(8,12,28,0.95)"/>
      <circle cx="30" cy="32" r="6" fill="rgba(15,22,45,0.9)"/>
      <circle cx="27.5" cy="29.5" r="1.8" fill="rgba(255,255,255,0.12)"/>
      <circle cx="30" cy="32" r="2.5" fill="rgba(30,40,80,0.8)"/>
      {/* Lens ring shine */}
      <path d="M20 26 A12 12 0 0 1 38 24" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" fill="none"/>

      {/* Periscope tele — top-right */}
      <circle cx="52" cy="32" r="10.5" fill="rgba(0,0,0,0.7)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.75"/>
      <circle cx="52" cy="32" r="8.5" fill="url(#g-lens-2)"/>
      <circle cx="52" cy="32" r="6" fill="rgba(8,12,28,0.95)"/>
      <circle cx="52" cy="32" r="4" fill="rgba(15,22,42,0.9)"/>
      <circle cx="50" cy="30" r="1.2" fill="rgba(255,255,255,0.1)"/>
      {/* Periscope indicator ring */}
      <rect x="49" y="29" width="6" height="6" rx="3" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6"/>

      {/* Ultra-wide — bottom-left */}
      <circle cx="30" cy="66" r="9.5" fill="rgba(0,0,0,0.7)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.75"/>
      <circle cx="30" cy="66" r="7.5" fill="url(#g-lens-2)"/>
      <circle cx="30" cy="66" r="5.5" fill="rgba(8,10,22,0.95)"/>
      <circle cx="28.5" cy="64.5" r="1" fill="rgba(255,255,255,0.1)"/>

      {/* 5x tele — bottom-right */}
      <circle cx="50" cy="62" r="8" fill="rgba(0,0,0,0.7)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.75"/>
      <circle cx="50" cy="62" r="6" fill="url(#g-lens-1)"/>
      <circle cx="50" cy="62" r="4" fill="rgba(8,10,22,0.95)"/>
      <circle cx="48.5" cy="60.5" r="0.9" fill="rgba(255,255,255,0.1)"/>

      {/* Flash — bottom right of island */}
      <circle cx="55" cy="78" r="4.5" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
      <circle cx="55" cy="78" r="3" fill="url(#g-lens-flash)" opacity="0.6" filter="url(#f-lens-glow)"/>
      <circle cx="55" cy="78" r="1.5" fill="rgba(255,255,255,0.8)"/>

      {/* Laser AF dot */}
      <circle cx="18" cy="78" r="2" fill="rgba(255,80,80,0.5)" stroke="rgba(255,80,80,0.2)" strokeWidth="0.5"/>
      <circle cx="18" cy="78" r="1" fill="rgba(255,100,100,0.7)"/>

      {/* ── Physical buttons ── */}
      {/* Power right */}
      <rect x="136" y="80" width="2.5" height="28" rx="1.25" fill="rgba(60,65,78,0.9)"/>
      <rect x="136.2" y="80.5" width="1" height="27" rx="0.5" fill="rgba(255,255,255,0.15)"/>
      {/* Volume up left */}
      <rect x="-0.5" y="72" width="2.5" height="20" rx="1.25" fill="rgba(60,65,78,0.9)"/>
      <rect x="-0.3" y="72.5" width="1" height="19" rx="0.5" fill="rgba(255,255,255,0.15)"/>
      {/* Volume down left */}
      <rect x="-0.5" y="98" width="2.5" height="20" rx="1.25" fill="rgba(60,65,78,0.9)"/>
      <rect x="-0.3" y="98.5" width="1" height="19" rx="0.5" fill="rgba(255,255,255,0.15)"/>

      {/* ── S Pen slot — bottom right ── */}
      <rect x="130" y="264" width="3.5" height="24" rx="1.75" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
      <rect x="131" y="265" width="1.5" height="22" rx="0.75" fill="rgba(255,255,255,0.12)"/>

      {/* ── USB-C port bottom center ── */}
      <rect x="54" y="296" width="30" height="5" rx="2.5" fill="rgba(0,0,0,0.6)"/>
      <rect x="56" y="297" width="26" height="3" rx="1.5" fill="rgba(255,255,255,0.06)"/>

      {/* Speaker grille left of USB-C */}
      {[0,1,2,3].map(i => <circle key={i} cx={34+i*4} cy={299} r="0.8" fill="rgba(255,255,255,0.12)"/>)}
      {/* Speaker grille right of USB-C */}
      {[0,1,2,3].map(i => <circle key={i} cx={90+i*4} cy={299} r="0.8" fill="rgba(255,255,255,0.12)"/>)}

      {/* ── Frame left-edge highlight ── */}
      <rect x="0.5" y="0.5" width="137" height="299" rx="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.75"/>
    </svg>
  );
}
