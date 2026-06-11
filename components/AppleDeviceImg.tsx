"use client";

/**
 * AppleDeviceImg
 *
 * Renders a real Apple device image from img.appledb.dev.
 * Falls back to a local SVG silhouette if:
 *   - the model has no CDN entry, or
 *   - the CDN image fails to load (network error / 404)
 */

import { useState } from "react";
import Image from "next/image";
import { getAppleDeviceImageUrl } from "@/lib/appleDeviceImages";
import { serviceImages } from "@/lib/serviceImages";

interface Props {
  /** Device model name, e.g. "iPhone 15 Pro". Must match keys in appleDeviceImages.ts */
  modelName: string;
  /** Device category for the fallback SVG: "iphone" | "ipad" | "macbook" */
  fallbackKey?: keyof typeof serviceImages;
  /** 64 for dropdowns/search, 256 for cards */
  res?: 64 | 256;
  /** Pass true to prefer the _dark render when available */
  preferDark?: boolean;
  /** Tailwind classes applied to the <img> element */
  className?: string;
  /** Width/height for Next Image. Defaults to square based on res. */
  size?: number;
}

export default function AppleDeviceImg({
  modelName,
  fallbackKey = "iphone",
  res = 256,
  preferDark = true,
  className = "object-contain w-full h-full",
  size,
}: Props) {
  const cdnUrl = getAppleDeviceImageUrl(modelName, res, preferDark);
  const fallback = serviceImages[fallbackKey];
  const px = size ?? (res === 64 ? 64 : 256);

  const [src, setSrc] = useState<string>(cdnUrl ?? fallback.src);
  const [errored, setErrored] = useState(false);

  function handleError() {
    if (!errored && src !== fallback.src) {
      setErrored(true);
      setSrc(fallback.src);
    }
  }

  return (
    <Image
      src={src}
      alt={`${modelName} device`}
      width={px}
      height={px}
      loading="lazy"
      onError={handleError}
      className={className}
      unoptimized={src.startsWith("https://")} // CDN images bypass Next.js image optimisation
    />
  );
}
