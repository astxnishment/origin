import type { RepairRow } from "@/lib/repairPricing";

export type WarrantyKind =
  | "diagnostic"
  | "not-applicable"
  | "fixed"
  | "supplied-parts"
  | "inspection";

export type WarrantyInfo = {
  kind: WarrantyKind;
  label: string;
  months?: number;
};

export const WARRANTY_NOTICE =
  "Warranty length depends on the repair and part selected. Your exact warranty is shown with your quote and confirmed before work begins.";

export function normaliseWarranty(
  value: string | number | null | undefined
): WarrantyInfo {
  if (typeof value === "number") {
    if (value <= 0) {
      return { kind: "diagnostic", label: "Diagnostic only" };
    }

    return {
      kind: "fixed",
      label: `${value} month${value === 1 ? "" : "s"}`,
      months: value,
    };
  }

  const label = value?.trim();
  if (!label) {
    return { kind: "inspection", label: "Confirmed after inspection" };
  }

  const lower = label.toLowerCase();
  if (lower === "n/a" || lower === "not applicable") {
    return { kind: "not-applicable", label: "Not applicable" };
  }
  if (lower.includes("diagnostic")) {
    return { kind: "diagnostic", label: "Diagnostic only" };
  }
  if (lower.includes("supplied parts")) {
    return { kind: "supplied-parts", label };
  }
  if (lower.includes("inspection") || lower.includes("confirmed")) {
    return { kind: "inspection", label: "Confirmed after inspection" };
  }

  const months = Number.parseInt(label, 10);
  return {
    kind: "fixed",
    label,
    months: Number.isFinite(months) ? months : undefined,
  };
}

export function warrantyForRepair(row: RepairRow): WarrantyInfo {
  if (
    row.partQuality.toLowerCase().includes("diagnostic") ||
    row.warrantyLabel.toLowerCase().includes("diagnostic")
  ) {
    return { kind: "diagnostic", label: "Diagnostic only" };
  }

  return normaliseWarranty(row.warrantyLabel || row.warrantyMonths);
}
