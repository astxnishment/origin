/**
 * deviceImageResolver — central source of truth for device image logic.
 *
 * Resolves to one of three image strategies:
 *   "apple-local"→ use a stable local device image
 *   "pixel-svg"  → render an inline Pixel SVG icon
 *   "samsung-svg"→ render an inline Samsung category SVG icon
 *   "generic-svg"→ render a generic DeviceIcon SVG fallback
 */

import { getPixelDeviceImage, type PixelVariant } from "@/lib/deviceImages/googlePixelDeviceImages";
import { getSamsungVariant, type SamsungVariant } from "@/lib/deviceImages/samsungGenericImages";
import type { DeviceType as DeviceIconType } from "@/components/DeviceIcon";

// ── Result types ──────────────────────────────────────────────────────────────

export type ResolvedImage =
  | {
      strategy: "apple-local";
      src: string;
      width: number;
      height: number;
    }
  | {
      strategy: "pixel-photo";
      /** Public path to real photo, e.g. /GooglePixel/Pixel-9-repair-in-Leeds.png */
      photoSrc: string;
      /** SVG fallback if photo fails to load */
      variant: PixelVariant;
    }
  | {
      strategy: "pixel-svg";
      variant: PixelVariant;
    }
  | {
      strategy: "samsung-svg";
      variant: SamsungVariant;
    }
  | {
      strategy: "generic-svg";
      /** DeviceIcon variant (from components/DeviceIcon.tsx) */
      iconType: DeviceIconType;
    };

// ── Main resolver ─────────────────────────────────────────────────────────────

export interface ResolverInput {
  brand: "Apple" | "Samsung" | "Google Pixel" | "Google";
  /** Model name exactly as used in deviceData, e.g. "iPhone 15 Pro", "Galaxy S24" */
  model: string;
  /** Device type ID from deviceData, e.g. "apple_iphone", "galaxy-s" */
  deviceTypeId?: string;
  /** Broad category for generic fallbacks */
  category?: "phone" | "tablet" | "laptop";
}

export function resolveDeviceImage({
  brand,
  model,
  deviceTypeId = "",
  category = "phone",
}: ResolverInput): ResolvedImage {

  // ── Apple ──────────────────────────────────────────────────────────────────
  if (brand === "Apple") {
    if (category === "tablet" || deviceTypeId === "ipad") {
      return {
        strategy: "apple-local",
        src: "/images/services/ipad.webp",
        width: 698,
        height: 800,
      };
    }
    if (category === "laptop" || deviceTypeId === "macbook") {
      return {
        strategy: "apple-local",
        src: "/images/services/macbook.webp",
        width: 1076,
        height: 658,
      };
    }
    return {
      strategy: "apple-local",
      src: "/images/services/iphone.webp",
      width: 969,
      height: 1200,
    };
  }

  // ── Samsung ────────────────────────────────────────────────────────────────
  if (brand === "Samsung") {
    const variant = getSamsungVariant(deviceTypeId, model);
    return { strategy: "samsung-svg", variant };
  }

  // ── Google Pixel ───────────────────────────────────────────────────────────
  if (brand === "Google Pixel" || brand === "Google") {
    const img = getPixelDeviceImage(model);
    if (img.photoSrc) {
      return { strategy: "pixel-photo", photoSrc: img.photoSrc, variant: img.variant };
    }
    return { strategy: "pixel-svg", variant: img.variant };
  }

  // ── Generic fallback ───────────────────────────────────────────────────────
  const iconType: DeviceIconType =
    category === "tablet"  ? "ipad"    :
    category === "laptop"  ? "laptop"  : "iphone";
  return { strategy: "generic-svg", iconType };
}
