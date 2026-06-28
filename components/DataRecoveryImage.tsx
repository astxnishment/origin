export default function DataRecoveryImage({ size = 280, className = "" }: { size?: number; className?: string }) {
  const w = size;
  const h = size * 0.72;
  return (
    <svg width={w} height={h} viewBox="0 0 280 202" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="dr-phone-body" x1="0" y1="0" x2="50" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2a2f3d"/>
          <stop offset="100%" stopColor="#0f1218"/>
        </linearGradient>
        <linearGradient id="dr-phone-screen" x1="0" y1="0" x2="50" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0d1828"/>
          <stop offset="100%" stopColor="#060a12"/>
        </linearGradient>
        <linearGradient id="dr-laptop-lid" x1="60" y1="5" x2="220" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#252830"/>
          <stop offset="100%" stopColor="#101218"/>
        </linearGradient>
        <linearGradient id="dr-laptop-screen" x1="65" y1="9" x2="215" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0a1422"/>
          <stop offset="100%" stopColor="#050810"/>
        </linearGradient>
        <linearGradient id="dr-laptop-wall" x1="65" y1="9" x2="215" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#121e38"/>
          <stop offset="60%" stopColor="#080e1c"/>
          <stop offset="100%" stopColor="#040810"/>
        </linearGradient>
        <linearGradient id="dr-laptop-base" x1="50" y1="95" x2="230" y2="115" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e2028"/>
          <stop offset="100%" stopColor="#0c0e14"/>
        </linearGradient>
        <linearGradient id="dr-hdd-body" x1="170" y1="100" x2="272" y2="195" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#222630"/>
          <stop offset="100%" stopColor="#0e1018"/>
        </linearGradient>
        <radialGradient id="dr-hdd-platter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2a3040"/>
          <stop offset="65%" stopColor="#141820"/>
          <stop offset="100%" stopColor="#0a0c12"/>
        </radialGradient>
        <radialGradient id="dr-orb-blue" cx="30%" cy="30%" r="60%">
          <stop offset="0%" stopColor="rgba(59,130,246,0.35)"/>
          <stop offset="100%" stopColor="rgba(59,130,246,0)"/>
        </radialGradient>
        <radialGradient id="dr-orb-purple" cx="70%" cy="60%" r="50%">
          <stop offset="0%" stopColor="rgba(139,92,246,0.2)"/>
          <stop offset="100%" stopColor="rgba(139,92,246,0)"/>
        </radialGradient>
        <filter id="dr-glow-blue" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="dr-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.6)"/>
        </filter>
        <clipPath id="dr-laptop-clip">
          <rect x="65" y="9" width="150" height="82" rx="3"/>
        </clipPath>
        <clipPath id="dr-phone-clip">
          <rect x="4" y="56" width="42" height="88" rx="5"/>
        </clipPath>
      </defs>

      {/* ── Laptop (centre, back) ── */}
      <g filter="url(#dr-shadow)">
        {/* Lid */}
        <rect x="60" y="5" width="160" height="92" rx="6" fill="url(#dr-laptop-lid)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75"/>
        <rect x="65" y="9" width="150" height="82" rx="3" fill="url(#dr-laptop-screen)"/>
        {/* Wallpaper */}
        <rect x="65" y="9" width="150" height="82" rx="3" fill="url(#dr-laptop-wall)" clipPath="url(#dr-laptop-clip)"/>
        <ellipse cx="110" cy="40" rx="60" ry="40" fill="url(#dr-orb-blue)" clipPath="url(#dr-laptop-clip)"/>
        <ellipse cx="190" cy="70" rx="45" ry="30" fill="url(#dr-orb-purple)" clipPath="url(#dr-laptop-clip)"/>

        {/* Screen content — recovery UI */}
        <text x="140" y="34" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="monospace" letterSpacing="1">DATA RECOVERY</text>
        {/* Progress bar track */}
        <rect x="90" y="40" width="100" height="5" rx="2.5" fill="rgba(255,255,255,0.06)"/>
        {/* Progress fill */}
        <rect x="90" y="40" width="62" height="5" rx="2.5" fill="rgba(59,130,246,0.85)"/>
        {/* % text */}
        <text x="140" y="54" textAnchor="middle" fill="rgba(59,130,246,0.9)" fontSize="6" fontFamily="monospace">62% · 14,832 files recovered</text>
        {/* File list rows */}
        {[0,1,2].map(i => (
          <g key={i}>
            <rect x="82" y={62+i*9} width="116" height="6" rx="1.5" fill="rgba(255,255,255,0.03)"/>
            <rect x="85" y={64+i*9} width={[55,40,70][i]} height="2" rx="1" fill="rgba(255,255,255,0.12)"/>
            <rect x={85+[57,42,72][i]} y={64+i*9} width={[20,25,14][i]} height="2" rx="1" fill="rgba(59,130,246,0.35)"/>
          </g>
        ))}
        {/* Camera dot */}
        <circle cx="140" cy="12" r="2" fill="rgba(255,255,255,0.1)"/>
        {/* Lid shine */}
        <rect x="60" y="5" width="160" height="92" rx="6" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
      </g>

      {/* Base / keyboard */}
      <rect x="48" y="97" width="184" height="14" rx="4" fill="url(#dr-laptop-base)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.75"/>
      {/* Hinge ridge */}
      <rect x="120" y="96" width="40" height="3" rx="1.5" fill="rgba(255,255,255,0.05)"/>
      {/* Trackpad */}
      <rect x="116" y="101" width="48" height="7" rx="2" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>

      {/* ── Phone (left, front) ── */}
      <g filter="url(#dr-shadow)">
        <rect x="2" y="54" width="48" height="94" rx="7" fill="url(#dr-phone-body)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.75"/>
        <rect x="5" y="57" width="42" height="88" rx="5" fill="url(#dr-phone-screen)"/>
        {/* Phone wallpaper */}
        <rect x="5" y="57" width="42" height="88" rx="5" fill="url(#dr-laptop-wall)" clipPath="url(#dr-phone-clip)"/>
        <ellipse cx="16" cy="78" rx="22" ry="18" fill="url(#dr-orb-blue)" clipPath="url(#dr-phone-clip)"/>

        {/* Punch-hole */}
        <circle cx="26" cy="63" r="3" fill="rgba(0,0,0,0.8)"/>
        <circle cx="26" cy="63" r="1.8" fill="#060a12"/>

        {/* Phone screen UI */}
        <text x="26" y="90" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="12" fontWeight="200" fontFamily="-apple-system, system-ui, sans-serif">12:47</text>
        <text x="26" y="99" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="4.5" fontFamily="-apple-system, system-ui, sans-serif">Recovering...</text>

        {/* Mini progress */}
        <rect x="12" y="106" width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.06)"/>
        <rect x="12" y="106" width="17" height="3" rx="1.5" fill="rgba(59,130,246,0.7)" filter="url(#dr-glow-blue)"/>
        <text x="26" y="117" textAnchor="middle" fill="rgba(59,130,246,0.7)" fontSize="4" fontFamily="monospace">62%</text>

        {/* Icons row */}
        {[0,1,2].map(i => (
          <rect key={i} x={10+i*12} y={122} width="9" height="9" rx="2.5" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
        ))}

        {/* Home bar */}
        <rect x="17" y="138" width="18" height="2.5" rx="1.25" fill="rgba(255,255,255,0.2)"/>

        {/* Buttons */}
        <rect x="1" y="72" width="2" height="11" rx="1" fill="rgba(80,85,100,0.8)"/>
        <rect x="1" y="87" width="2" height="11" rx="1" fill="rgba(80,85,100,0.8)"/>
        <rect x="49" y="76" width="2" height="16" rx="1" fill="rgba(80,85,100,0.8)"/>
      </g>

      {/* ── HDD (right, front) ── */}
      <g filter="url(#dr-shadow)">
        <rect x="168" y="108" width="108" height="82" rx="6" fill="url(#dr-hdd-body)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.75"/>

        {/* Drive platter disc */}
        <circle cx="216" cy="145" r="30" fill="rgba(0,0,0,0.4)"/>
        <circle cx="216" cy="145" r="28" fill="url(#dr-hdd-platter)"/>
        {/* Platter rings */}
        {[22,16,10,5].map((r, i) => (
          <circle key={i} cx="216" cy="145" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.75"/>
        ))}
        {/* Centre hub */}
        <circle cx="216" cy="145" r="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
        <circle cx="216" cy="145" r="2" fill="rgba(255,255,255,0.2)"/>
        {/* Read arm */}
        <line x1="216" y1="145" x2="237" y2="122" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="237" cy="122" r="2.5" fill="rgba(59,130,246,0.6)" filter="url(#dr-glow-blue)"/>

        {/* Activity LED */}
        <circle cx="180" cy="116" r="3" fill="rgba(59,130,246,0.7)" filter="url(#dr-glow-blue)"/>
        <circle cx="180" cy="116" r="1.5" fill="rgba(160,200,255,0.9)"/>

        {/* Label area */}
        <rect x="172" y="110" width="40" height="18" rx="2" fill="rgba(255,255,255,0.03)"/>
        <text x="192" y="120" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="5" fontFamily="monospace">RECOVERY</text>
        <text x="192" y="127" textAnchor="middle" fill="rgba(59,130,246,0.5)" fontSize="4" fontFamily="monospace">2TB · SATA</text>

        {/* Connectors */}
        <rect x="248" y="128" width="26" height="8" rx="2" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
        {[0,1,2,3,4,5,6].map(i => (
          <rect key={i} x={249+i*3.3} y={129} width="2.5" height="6" rx="0.5" fill="rgba(255,255,255,0.15)"/>
        ))}
        <rect x="248" y="140" width="26" height="5" rx="2" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"/>
        {[0,1,2].map(i => <rect key={i} x={250+i*8} y={141} width="5" height="3" rx="0.5" fill="rgba(255,255,255,0.12)"/>)}
      </g>

      {/* ── Data stream lines ── */}
      {/* Phone → Laptop */}
      <path d="M26 54 C26 42 80 30 90 20" stroke="rgba(59,130,246,0.3)" strokeWidth="1.2" fill="none" strokeDasharray="4 3"/>
      <path d="M30 54 C30 40 84 28 94 18" stroke="rgba(59,130,246,0.15)" strokeWidth="0.75" fill="none" strokeDasharray="2 5"/>
      {/* HDD → Laptop */}
      <path d="M216 108 C216 70 195 50 190 20" stroke="rgba(59,130,246,0.3)" strokeWidth="1.2" fill="none" strokeDasharray="4 3"/>
      <path d="M222 108 C222 68 200 48 196 18" stroke="rgba(59,130,246,0.15)" strokeWidth="0.75" fill="none" strokeDasharray="2 5"/>

      {/* Data particles */}
      {[[60,44,0.7],[72,38,0.5],[84,30,0.4],[170,55,0.6],[182,44,0.45],[194,30,0.35]].map(([x,y,o],i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill={`rgba(59,130,246,${o})`} filter="url(#dr-glow-blue)"/>
      ))}
    </svg>
  );
}
