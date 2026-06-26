import Image from "next/image";

interface LogoProps {
  /**
   * "dark"  → white logo, designed for dark/navy backgrounds (navbar, footer, dark sections)
   * "light" → dark navy logo, designed for white/light backgrounds (OG images, light modals)
   */
  variant?: "dark" | "light";
  /** Tailwind height class, e.g. "h-9" or "h-10". Width is always auto. */
  heightClass?: string;
  className?: string;
}

const LOGOS = {
  /** White logo — use on dark backgrounds */
  dark:  { src: "/logos/origin-logo-dark.png",  width: 1093, height: 660 },
  /** Dark charcoal logo — use on light backgrounds */
  light: { src: "/logos/origin-logo-light.png", width: 1093, height: 660 },
} as const;

export default function Logo({
  variant = "dark",
  heightClass = "h-9",
  className = "",
}: LogoProps) {
  const { src, width, height } = LOGOS[variant];

  return (
    <Image
      src={src}
      alt="Origin Repairs logo"
      width={width}
      height={height}
      sizes="(max-width: 640px) 140px, 180px"
      className={`${heightClass} w-auto object-contain ${className}`}
      unoptimized
      priority
    />
  );
}
