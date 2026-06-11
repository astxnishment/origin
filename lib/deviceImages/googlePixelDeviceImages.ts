/**
 * Google Pixel Device Image Mapping
 *
 * No transparent-background CDN exists for Pixel devices (unlike Apple's img.appledb.dev),
 * so we use inline SVG icons styled to look like each Pixel generation.
 *
 * SVG variant keys map to components/PixelDeviceIcon.tsx.
 */

/** Which Pixel SVG variant to render */
export type PixelVariant =
  | "pixel6"   // Pixel 6 / 6a — iconic horizontal camera bar, curved sides
  | "pixel7"   // Pixel 7 / 7a — aluminium bar, flat sides
  | "pixel8"   // Pixel 8 / 8a — rounded back, narrower bar
  | "pixel9"   // Pixel 9 / 9a — round corners, polished bar
  | "pixel9pro" // Pixel 9 Pro / Pro XL — slightly wider, pro look
  | "pixelfold" // Pixel 9 Pro Fold — folded book form factor
  | "generic"  // Fallback for any unrecognised Pixel

export interface PixelDeviceImage {
  variant: PixelVariant;
}

export const PIXEL_IMAGES: Record<string, PixelDeviceImage> = {
  // ── Pixel 9 line (2024–2025) ─────────────────────────────────────────────
  "Pixel 9 Pro Fold": { variant: "pixelfold" },
  "Pixel 9 Pro XL":   { variant: "pixel9pro" },
  "Pixel 9 Pro":      { variant: "pixel9pro" },
  "Pixel 9a":         { variant: "pixel9"    },
  "Pixel 9":          { variant: "pixel9"    },

  // ── Pixel 8 line (2023) ───────────────────────────────────────────────────
  "Pixel 8 Pro":      { variant: "pixel8"    },
  "Pixel 8a":         { variant: "pixel8"    },
  "Pixel 8":          { variant: "pixel8"    },

  // ── Pixel 7 line (2022) ───────────────────────────────────────────────────
  "Pixel 7 Pro":      { variant: "pixel7"    },
  "Pixel 7a":         { variant: "pixel7"    },
  "Pixel 7":          { variant: "pixel7"    },
  "Pixel Fold":       { variant: "pixelfold" },

  // ── Pixel 6 line (2021) ───────────────────────────────────────────────────
  "Pixel 6 Pro":      { variant: "pixel6"    },
  "Pixel 6a":         { variant: "pixel6"    },
  "Pixel 6":          { variant: "pixel6"    },
};

export function getPixelVariant(modelName: string): PixelVariant {
  return PIXEL_IMAGES[modelName]?.variant ?? "generic";
}
