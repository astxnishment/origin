/**
 * DataRecoveryImage — clean minimal illustration: phone + laptop + SSD
 * with subtle data-stream lines. Dark/transparent background.
 */
export default function DataRecoveryImage({
  size = 260,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size * 0.78}
      viewBox="0 0 260 203"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="dr-phone-body" x1="0" y1="0" x2="44" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#252b38" />
          <stop offset="100%" stopColor="#111520" />
        </linearGradient>
        <linearGradient id="dr-phone-screen" x1="0" y1="0" x2="44" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0d1525" />
          <stop offset="100%" stopColor="#060a14" />
        </linearGradient>
        <linearGradient id="dr-laptop-body" x1="0" y1="0" x2="130" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e2430" />
          <stop offset="100%" stopColor="#0e1218" />
        </linearGradient>
        <linearGradient id="dr-laptop-screen" x1="0" y1="0" x2="120" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0a1220" />
          <stop offset="100%" stopColor="#050810" />
        </linearGradient>
        <linearGradient id="dr-ssd-body" x1="0" y1="0" x2="60" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e2432" />
          <stop offset="100%" stopColor="#0e1220" />
        </linearGradient>
        <linearGradient id="dr-accent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(59,130,246,0)" />
          <stop offset="50%" stopColor="rgba(59,130,246,0.6)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </linearGradient>
        <linearGradient id="dr-accent-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(59,130,246,0)" />
          <stop offset="50%" stopColor="rgba(59,130,246,0.4)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </linearGradient>
        <filter id="dr-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Laptop (centre-back) ── */}
      {/* Screen lid */}
      <rect x="62" y="10" width="136" height="90" rx="6" fill="url(#dr-laptop-body)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <rect x="66" y="14" width="128" height="82" rx="4" fill="url(#dr-laptop-screen)" />
      {/* Laptop screen content — recovery progress bar */}
      <rect x="86" y="44" width="88" height="1.5" rx="1" fill="rgba(255,255,255,0.06)" />
      <rect x="86" y="44" width="55" height="1.5" rx="1" fill="rgba(59,130,246,0.7)" />
      <text x="130" y="38" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="monospace">RECOVERING DATA</text>
      <text x="130" y="52" textAnchor="middle" fill="rgba(59,130,246,0.8)" fontSize="5.5" fontFamily="monospace">62%  ████████████░░░░░░░░</text>
      <text x="130" y="62" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="5" fontFamily="monospace">14,832 files found</text>
      {/* Camera dot */}
      <circle cx="130" cy="18" r="1.5" fill="rgba(255,255,255,0.1)" />
      {/* Laptop base */}
      <rect x="54" y="100" width="152" height="10" rx="3" fill="url(#dr-laptop-body)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* Hinge */}
      <rect x="118" y="99" width="24" height="2" rx="1" fill="rgba(255,255,255,0.06)" />
      {/* Trackpad */}
      <rect x="112" y="103" width="36" height="5" rx="2" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

      {/* ── Phone (left-front) ── */}
      <rect x="26" y="68" width="44" height="88" rx="7" fill="url(#dr-phone-body)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <rect x="29" y="71" width="38" height="82" rx="5.5" fill="url(#dr-phone-screen)" />
      {/* Phone screen — file icon grid */}
      <circle cx="48" cy="79" r="2" fill="rgba(255,255,255,0.1)" />
      {[0,1,2].map(i => (
        <rect key={i} x="34" y={88 + i * 10} width="28" height="7" rx="2" fill="rgba(255,255,255,0.04)" />
      ))}
      {[0,1,2].map(i => (
        <rect key={i} x="36" y={90 + i * 10} width={[18, 22, 14][i]} height="1.5" rx="0.75" fill="rgba(59,130,246,0.4)" />
      ))}
      <rect x="34" y="143" width="28" height="3" rx="1.5" fill="rgba(59,130,246,0.3)" />
      <text x="48" y="145" textAnchor="middle" fill="rgba(59,130,246,0.8)" fontSize="3.5" fontFamily="monospace">SCAN</text>
      {/* Home bar */}
      <rect x="40" y="150" width="16" height="2" rx="1" fill="rgba(255,255,255,0.15)" />
      {/* Volume */}
      <rect x="25" y="82" width="1.5" height="9" rx="0.75" fill="rgba(255,255,255,0.15)" />
      <rect x="25" y="94" width="1.5" height="9" rx="0.75" fill="rgba(255,255,255,0.15)" />

      {/* ── SSD (right-front) ── */}
      <rect x="172" y="120" width="62" height="38" rx="5" fill="url(#dr-ssd-body)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      {/* SSD label area */}
      <rect x="176" y="124" width="38" height="14" rx="2" fill="rgba(255,255,255,0.03)" />
      <text x="195" y="133" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="5" fontFamily="monospace">SSD</text>
      {/* Connector ridge */}
      <rect x="228" y="128" width="6" height="10" rx="1.5" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      {[0,1,2,3].map(i => (
        <rect key={i} x="229" y={129.5 + i * 2.2} width="4" height="1" rx="0.5" fill="rgba(255,255,255,0.2)" />
      ))}
      {/* Activity LED */}
      <circle cx="181" cy="138" r="2" fill="rgba(59,130,246,0.6)" filter="url(#dr-glow)" />
      {/* Chip detail */}
      <rect x="184" y="140" width="20" height="13" rx="2" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      {[0,1,2].map(i => (
        <rect key={i} x="186" y={142 + i * 3.5} width={[14, 10, 12][i]} height="1.5" rx="0.75" fill="rgba(255,255,255,0.06)" />
      ))}

      {/* ── Data stream lines (connecting devices) ── */}
      {/* Phone → laptop */}
      <path d="M70 112 Q100 108 120 95" stroke="rgba(59,130,246,0.25)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
      <path d="M70 118 Q105 114 122 100" stroke="rgba(59,130,246,0.15)" strokeWidth="0.75" strokeDasharray="2 4" fill="none" />
      {/* SSD → laptop */}
      <path d="M190 120 Q185 112 180 110" stroke="rgba(59,130,246,0.25)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
      <path d="M196 120 Q190 112 185 108" stroke="rgba(59,130,246,0.15)" strokeWidth="0.75" strokeDasharray="2 4" fill="none" />

      {/* ── Floating data particles ── */}
      {[
        [100, 92, 0.6], [110, 88, 0.4], [88, 96, 0.3],
        [168, 106, 0.5], [176, 112, 0.35], [160, 116, 0.25],
      ].map(([x, y, o], i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill={`rgba(59,130,246,${o})`} />
      ))}
    </svg>
  );
}
