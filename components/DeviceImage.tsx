"use client";

/**
 * DeviceImage — unified device image component.
 *
 * Resolves the right image strategy per brand:
 *   Apple   → real photo from img.appledb.dev (+ SVG fallback on error)
 *   Samsung → clean category SVG (Galaxy S / A / Z Fold / Z Flip / Tab / Book)
 *   Google  → Pixel-styled inline SVG per generation
 *
 * Usage:
 *   <DeviceImage brand="Apple"   model="iPhone 15 Pro"  deviceTypeId="apple_iphone" />
 *   <DeviceImage brand="Samsung" model="Galaxy S24"     deviceTypeId="galaxy-s"     />
 *   <DeviceImage brand="Google"  model="Pixel 9 Pro"    category="phone"            />
 */

import { useState } from "react";
import Image from "next/image";
import { DeviceIcon } from "@/components/DeviceIcon";
import { SamsungCategoryIcon } from "@/components/SamsungCategoryIcon";
import { PixelDeviceIcon } from "@/components/PixelDeviceIcon";
import { resolveDeviceImage } from "@/lib/deviceImages/deviceImageResolver";

interface Props {
  brand: "Apple" | "Samsung" | "Google";
  model: string;
  deviceTypeId?: string;
  category?: "phone" | "tablet" | "laptop";
  /** px height for inline SVG icons (Apple uses res param instead) */
  size?: number;
  /** Tailwind classes for the wrapping element */
  className?: string;
  /** Tailwind classes for the <Image> element (Apple CDN only) */
  imgClassName?: string;
}

export default function DeviceImage({
  brand,
  model,
  deviceTypeId = "",
  category = "phone",
  size = 120,
  className = "flex items-center justify-center",
  imgClassName = "object-contain w-full h-full",
}: Props) {
  const resolved = resolveDeviceImage({ brand, model, deviceTypeId, category });
  const [cdnFailed, setCdnFailed] = useState(false);

  // ── Apple CDN photo ───────────────────────────────────────────────────────
  if (resolved.strategy === "apple-cdn") {
    if (cdnFailed) {
      // CDN failed at runtime — fall back to SVG silhouette
      return (
        <div className={className}>
          <DeviceIcon
            device={
              deviceTypeId === "apple_ipad"    ? "ipad"    :
              deviceTypeId === "apple_macbook" ? "macbook" : "iphone"
            }
            size={size}
          />
        </div>
      );
    }
    return (
      <div className={className}>
        <Image
          src={resolved.url256}
          alt={`${model} device`}
          width={256}
          height={256}
          loading="lazy"
          unoptimized
          onError={() => setCdnFailed(true)}
          className={imgClassName}
        />
      </div>
    );
  }

  // ── Samsung category SVG ──────────────────────────────────────────────────
  if (resolved.strategy === "samsung-svg") {
    return (
      <div className={className}>
        <SamsungCategoryIcon variant={resolved.variant} size={size} />
      </div>
    );
  }

  // ── Google Pixel SVG ──────────────────────────────────────────────────────
  if (resolved.strategy === "pixel-svg") {
    return (
      <div className={className}>
        <PixelDeviceIcon variant={resolved.variant} size={size} />
      </div>
    );
  }

  // ── Generic SVG fallback ──────────────────────────────────────────────────
  return (
    <div className={className}>
      <DeviceIcon device={resolved.iconType} size={size} />
    </div>
  );
}
