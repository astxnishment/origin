import Link from "next/link";

interface LogoProps {
  /** Subtitle under the wordmark */
  subtitle?: string;
  /** Render the circular O mark alongside the wordmark */
  showMark?: boolean;
  /** Size scale */
  size?: "sm" | "md" | "lg";
  className?: string;
  /** When false, renders a <div> instead of a Link (e.g. inside another link) */
  asLink?: boolean;
}

const SIZES = {
  sm: { mark: 28, word: "text-[15px]", sub: "text-[9px]", gap: "gap-2.5" },
  md: { mark: 34, word: "text-[19px]", sub: "text-[10px]", gap: "gap-3" },
  lg: { mark: 44, word: "text-[26px]", sub: "text-[12px]", gap: "gap-3.5" },
} as const;

/** Crisp vector "O" monogram — a precision ring, not an image. */
export function OriginMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Outer ring with gradient stroke */}
      <circle
        cx="20"
        cy="20"
        r="16"
        stroke="url(#originStroke)"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Inner accent arc — the "origin" tick */}
      <path
        d="M20 4 A16 16 0 0 1 36 20"
        stroke="url(#originAccent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Center dot — point of origin */}
      <circle cx="20" cy="20" r="2.5" fill="url(#originAccent)" />
      <defs>
        <linearGradient id="originStroke" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="originAccent" x1="20" y1="4" x2="36" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Logo({
  subtitle = "Device Care",
  showMark = true,
  size = "md",
  className = "",
  asLink = true,
}: LogoProps) {
  const s = SIZES[size];

  const inner = (
    <>
      {showMark && (
        <span className="text-foreground transition-opacity duration-200 group-hover:opacity-70">
          <OriginMark size={s.mark} />
        </span>
      )}
      <span className="flex flex-col justify-center leading-none">
        <span
          className={`font-bold ${s.word} text-foreground leading-none transition-opacity duration-200 group-hover:opacity-70`}
          style={{ letterSpacing: "0.18em" }}
        >
          ORIGIN
        </span>
        {subtitle && (
          <span
            className={`${s.sub} font-medium text-muted-foreground uppercase mt-1 leading-none transition-opacity duration-200 group-hover:opacity-70`}
            style={{ letterSpacing: "0.32em" }}
          >
            {subtitle}
          </span>
        )}
      </span>
    </>
  );

  if (!asLink) {
    return <div className={`group flex items-center ${s.gap} ${className}`}>{inner}</div>;
  }

  return (
    <Link href="/" className={`group flex items-center ${s.gap} shrink-0 ${className}`}>
      {inner}
    </Link>
  );
}
