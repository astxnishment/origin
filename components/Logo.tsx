interface LogoProps {
  /**
   * "dark"  -> warm white logo for dark backgrounds
   * "light" -> graphite logo for light backgrounds
   */
  variant?: "dark" | "light";
  /** Tailwind height class, e.g. "h-9" or "h-10". Width follows the SVG viewBox. */
  heightClass?: string;
  className?: string;
}

const LOGO_COLOR = {
  dark: "#f4f1ea",
  light: "#151412",
} as const;

export default function Logo({
  variant = "dark",
  heightClass = "h-9",
  className = "",
}: LogoProps) {
  return (
    <svg
      viewBox="0 0 342 86"
      role="img"
      aria-label="Origin Repairs"
      className={`${heightClass} w-auto ${className}`}
      style={{ color: LOGO_COLOR[variant] }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="34"
        cy="39"
        r="24"
        stroke="currentColor"
        strokeWidth="7"
      />
      <path
        d="M34 9V29"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <text
        x="78"
        y="45"
        fill="currentColor"
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
        fontSize="35"
        fontWeight="650"
        letterSpacing="0"
      >
        ORIGIN
      </text>
      <text
        x="80"
        y="68"
        fill="currentColor"
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
        fontSize="12"
        fontWeight="700"
        letterSpacing="0"
      >
        REPAIRS
      </text>
    </svg>
  );
}
