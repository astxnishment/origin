/**
 * Google Pixel Device Image Mapping
 *
 * Real photos from /public/GooglePixel/ are used where available.
 * Falls back to inline SVG icons per Pixel generation.
 *
 * SVG variant keys map to components/PixelDeviceIcon.tsx.
 */

/** Which Pixel SVG variant to render (used as fallback when no photo) */
export type PixelVariant =
  | "pixel6"    // Pixel 6 / 6a — iconic horizontal camera bar, curved sides
  | "pixel7"    // Pixel 7 / 7a — aluminium bar, flat sides
  | "pixel8"    // Pixel 8 / 8a — rounded back, narrower bar
  | "pixel9"    // Pixel 9 / 9a — round corners, polished bar
  | "pixel9pro" // Pixel 9 Pro / Pro XL — slightly wider, pro look
  | "pixelfold" // Pixel Fold — folded book form factor
  | "generic"   // Fallback for any unrecognised Pixel

export interface PixelDeviceImage {
  /** Public path to a real photo (starts with /). Undefined = SVG only. */
  photoSrc?: string;
  variant: PixelVariant;
}

export const PIXEL_IMAGES: Record<string, PixelDeviceImage> = {
  // ── Pixel 9 line ────────────────────────────────────────────────────────────
  "Pixel 9 Pro Fold": { photoSrc: "/GooglePixel/Pixel-9-pro-repair-in-Leeds.png",    variant: "pixelfold" },
  "Pixel 9 Pro XL":   { photoSrc: "/GooglePixel/Pixel-9-Pro-XL-repair-in-Leeds.png", variant: "pixel9pro" },
  "Pixel 9 Pro":      { photoSrc: "/GooglePixel/Pixel-9-pro-repair-in-Leeds.png",    variant: "pixel9pro" },
  "Pixel 9":          { photoSrc: "/GooglePixel/Pixel-9-repair-in-Leeds.png",         variant: "pixel9"    },
  "Pixel 9a":         { photoSrc: "/GooglePixel/Pixel-9a-repair-in-Leeds.png",        variant: "pixel9"    },

  // ── Pixel 8 line ─────────────────────────────────────────────────────────────
  "Pixel 8 Pro":      { photoSrc: "/GooglePixel/Pixel-8-Pro-repair-in-Leeds.png",    variant: "pixel8"    },
  "Pixel 8":          { photoSrc: "/GooglePixel/Pixel-8-repair-in-Leeds.png",         variant: "pixel8"    },
  "Pixel 8a":         { photoSrc: "/GooglePixel/Pixel-8a-repair-in-Leeds.png",        variant: "pixel8"    },

  // ── Pixel 7 line ─────────────────────────────────────────────────────────────
  "Pixel 7 Pro":      { photoSrc: "/GooglePixel/Pixel-7-Pro-repair-in-Leeds.png",    variant: "pixel7"    },
  "Pixel 7":          { photoSrc: "/GooglePixel/Pixel-7-repair-in-Leeds.png",         variant: "pixel7"    },
  "Pixel 7a":         { photoSrc: "/GooglePixel/Pixel-7a-repair-in-Leeds.png",        variant: "pixel7"    },

  // ── Pixel 6 line ─────────────────────────────────────────────────────────────
  "Pixel 6 Pro":      { photoSrc: "/GooglePixel/Pixel-6-Pro-repair-in-Leeds.png",    variant: "pixel6"    },
  "Pixel 6":          { photoSrc: "/GooglePixel/Pixel-6-Repair-in-Leeds.png",         variant: "pixel6"    },
  "Pixel 6a":         { photoSrc: "/GooglePixel/Pixel-6a-Repair-in-Leeds.png",        variant: "pixel6"    },

  // ── Older Pixel — SVG fallback only ─────────────────────────────────────────
  "Pixel 5":          { variant: "pixel8"   },
  "Pixel 4a":         { variant: "pixel8"   },
};

export function getPixelDeviceImage(modelName: string): PixelDeviceImage {
  return PIXEL_IMAGES[modelName] ?? { variant: "generic" };
}

/** Legacy helper — returns just the SVG variant */
export function getPixelVariant(modelName: string): PixelVariant {
  return PIXEL_IMAGES[modelName]?.variant ?? "generic";
}
