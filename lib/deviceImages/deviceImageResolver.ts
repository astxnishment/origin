/**
 * deviceImageResolver — central source of truth for device image logic.
 *
 * Resolves to one of three image strategies:
 *   "apple-cdn"  → fetch real photo from img.appledb.dev
 *   "pixel-svg"  → render an inline Pixel SVG icon
 *   "samsung-svg"→ render an inline Samsung category SVG icon
 *   "generic-svg"→ render a generic DeviceIcon SVG fallback
 */

import { getAppleDeviceImage, appleImageUrl } from "@/lib/deviceImages/appleDeviceImages";
import { getPixelDeviceImage, type PixelVariant } from "@/lib/deviceImages/googlePixelDeviceImages";
import { getSamsungVariant, type SamsungVariant } from "@/lib/deviceImages/samsungGenericImages";
import type { DeviceType as DeviceIconType } from "@/components/DeviceIcon";

// ── Result types ──────────────────────────────────────────────────────────────

export type ResolvedImage =
  | {
      strategy: "apple-cdn";
      url256: string; // high-res for cards
      url64:  string; // small for dropdowns
      fallbackSrc: string; // local SVG if CDN fails
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

// ── Fallback SVG paths per Apple device category ──────────────────────────────

const APPLE_FALLBACKS: Record<string, string> = {
  apple_iphone:  "/images/services/iphone-device.svg",
  apple_ipad:    "/images/services/ipad-device.svg",
  apple_macbook: "/images/services/macbook-device.svg",
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
    const device = getAppleDeviceImage(model);
    if (device) {
      return {
        strategy: "apple-cdn",
        url256: appleImageUrl(device, 256, true),
        url64:  appleImageUrl(device, 64, true),
        fallbackSrc: APPLE_FALLBACKS[deviceTypeId] ?? "/images/services/iphone-device.svg",
      };
    }
    // Apple device found in pricing but not in image map → generic SVG.
    // Key off the broad category (reliable) rather than deviceTypeId strings.
    const iconType: DeviceIconType =
      category === "tablet" || deviceTypeId === "ipad"    ? "ipad"    :
      category === "laptop" || deviceTypeId === "macbook" ? "macbook" : "iphone";
    return { strategy: "generic-svg", iconType };
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
