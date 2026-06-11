/**
 * Samsung Generic Image Mapping
 *
 * Samsung has too many model variations to map individually.
 * Instead, each device TYPE maps to a visual category icon.
 * SVG variants are defined in components/SamsungCategoryIcon.tsx.
 */

export type SamsungVariant =
  | "galaxy-s"    // Galaxy S series — slim premium phone, punch-hole
  | "galaxy-a"    // Galaxy A series — mid-range phone, slightly rounder
  | "galaxy-fold" // Galaxy Z Fold — book-style foldable
  | "galaxy-flip" // Galaxy Z Flip — compact flip phone (closed)
  | "galaxy-tab"  // Galaxy Tab — tablet form factor
  | "galaxy-book" // Galaxy Book — laptop

/**
 * Maps Samsung device type IDs (from lib/deviceData.ts) to a visual category.
 * For Galaxy Z Fold/Flip (same type id "galaxy-z"), we distinguish by model name.
 */
export const SAMSUNG_TYPE_MAP: Record<string, SamsungVariant> = {
  "galaxy-s":    "galaxy-s",
  "galaxy-a":    "galaxy-a",
  "galaxy-z":    "galaxy-fold", // default — overridden for Flip models at runtime
  "galaxy-tab":  "galaxy-tab",
  "galaxy-book": "galaxy-book",
};

/**
 * Resolve the correct Samsung variant from a device type ID and optional model name.
 * Handles Galaxy Z series disambiguation (Fold vs Flip).
 */
export function getSamsungVariant(deviceTypeId: string, modelName?: string): SamsungVariant {
  if (deviceTypeId === "galaxy-z" && modelName) {
    const lower = modelName.toLowerCase();
    if (lower.includes("flip")) return "galaxy-flip";
    if (lower.includes("fold")) return "galaxy-fold";
  }
  return SAMSUNG_TYPE_MAP[deviceTypeId] ?? "galaxy-s";
}
