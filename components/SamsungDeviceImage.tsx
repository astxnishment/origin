/**
 * SamsungDeviceImage — photorealistic-style Samsung Galaxy S24 Ultra SVG.
 * Dark colourway, titanium frame, quad-camera bump, S Pen slot.
 */
export default function SamsungDeviceImage({
  size = 220,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const w = size * 0.48;
  const h = size;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 96 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Body gradient — titanium grey */}
        <linearGradient id="sd-body" x1="0" y1="0" x2="96" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2e3340" />
          <stop offset="40%" stopColor="#1a1e28" />
          <stop offset="100%" stopColor="#0d1018" />
        </linearGradient>
        {/* Edge highlight — titanium rim */}
        <linearGradient id="sd-rim" x1="0" y1="0" x2="96" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4a5060" />
          <stop offset="50%" stopColor="#6a7080" />
          <stop offset="100%" stopColor="#3a4050" />
        </linearGradient>
        {/* Screen gradient */}
        <linearGradient id="sd-screen" x1="0" y1="0" x2="96" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f1520" />
          <stop offset="100%" stopColor="#050810" />
        </linearGradient>
        {/* Screen sheen */}
        <linearGradient id="sd-sheen" x1="0" y1="0" x2="60" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        {/* Camera island gradient */}
        <linearGradient id="sd-cam-bg" x1="0" y1="0" x2="30" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e232e" />
          <stop offset="100%" stopColor="#131720" />
        </linearGradient>
        {/* Lens gradient */}
        <radialGradient id="sd-lens-main" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#2a3550" />
          <stop offset="60%" stopColor="#0d1220" />
          <stop offset="100%" stopColor="#060810" />
        </radialGradient>
        <radialGradient id="sd-lens-sm" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#1e2838" />
          <stop offset="100%" stopColor="#080c14" />
        </radialGradient>
        {/* Wallpaper gradient */}
        <linearGradient id="sd-wall" x1="0" y1="0" x2="80" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1a2240" />
          <stop offset="50%" stopColor="#0a0f20" />
          <stop offset="100%" stopColor="#050810" />
        </linearGradient>
        <linearGradient id="sd-wall-accent" x1="0" y1="0" x2="80" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(37,99,235,0.25)" />
          <stop offset="100%" stopColor="rgba(37,99,235,0)" />
        </linearGradient>
        <clipPath id="sd-screen-clip">
          <rect x="4" y="4" width="88" height="192" rx="11" />
        </clipPath>
      </defs>

      {/* ── Outer body (titanium frame) ── */}
      <rect x="0.6" y="0.6" width="94.8" height="198.8" rx="14.4" fill="url(#sd-body)" stroke="url(#sd-rim)" strokeWidth="1.2" />

      {/* ── Screen area ── */}
      <rect x="4" y="4" width="88" height="192" rx="11" fill="url(#sd-screen)" />

      {/* Wallpaper base */}
      <rect x="4" y="4" width="88" height="192" rx="11" fill="url(#sd-wall)" clipPath="url(#sd-screen-clip)" />
      {/* Blue accent orb */}
      <ellipse cx="20" cy="60" rx="40" ry="35" fill="url(#sd-wall-accent)" clipPath="url(#sd-screen-clip)" />

      {/* Screen sheen (reflection) */}
      <rect x="4" y="4" width="88" height="192" rx="11" fill="url(#sd-sheen)" />

      {/* ── Status bar ── */}
      <rect x="14" y="10" width="20" height="2" rx="1" fill="rgba(255,255,255,0.12)" />
      <rect x="66" y="10" width="6" height="2" rx="1" fill="rgba(255,255,255,0.08)" />
      <rect x="74" y="10" width="4" height="2" rx="1" fill="rgba(255,255,255,0.08)" />
      <rect x="80" y="10" width="6" height="2" rx="1" fill="rgba(255,255,255,0.08)" />

      {/* ── Punch-hole selfie camera ── */}
      <circle cx="48" cy="16" r="3.5" fill="#050810" />
      <circle cx="48" cy="16" r="2.2" fill="#0a1025" />
      <circle cx="47" cy="15" r="0.7" fill="rgba(255,255,255,0.15)" />

      {/* ── Minimal UI hint on screen ── */}
      {/* Clock */}
      <text x="48" y="72" textAnchor="middle" fill="rgba(255,255,255,0.82)" fontSize="18" fontFamily="system-ui, sans-serif" fontWeight="300" letterSpacing="-0.5">12:47</text>
      <text x="48" y="82" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="5" fontFamily="system-ui, sans-serif">Thursday, 26 June</text>

      {/* App grid dots */}
      {[0,1,2,3].map(col => (
        [0,1,2].map(row => (
          <circle
            key={`${col}-${row}`}
            cx={28 + col * 14}
            cy={100 + row * 14}
            r="4.5"
            fill="rgba(255,255,255,0.06)"
          />
        ))
      ))}

      {/* Home bar */}
      <rect x="33" y="187" width="30" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />

      {/* ── Camera island (raised, squared with slight rounding) ── */}
      <rect x="5" y="8" width="32" height="46" rx="8" fill="url(#sd-cam-bg)" opacity="0" />
      {/* Camera bump on the back visible on left side (slight protrusion effect) */}

      {/* ── S Pen slot — bottom right edge indicator ── */}
      <rect x="93" y="168" width="3" height="18" rx="1.5" fill="rgba(255,255,255,0.08)" />

      {/* ── Physical buttons ── */}
      {/* Power button right */}
      <rect x="93.5" y="62" width="2.5" height="22" rx="1.2" fill="rgba(90,100,120,0.8)" />
      {/* Volume up left */}
      <rect x="0" y="54" width="2.5" height="16" rx="1.2" fill="rgba(90,100,120,0.8)" />
      {/* Volume down left */}
      <rect x="0" y="74" width="2.5" height="16" rx="1.2" fill="rgba(90,100,120,0.8)" />

      {/* ── Subtle edge glow ── */}
      <rect x="0.6" y="0.6" width="94.8" height="198.8" rx="14.4" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
    </svg>
  );
}
