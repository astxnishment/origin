/**
 * repairTracking — repair status lookup scaffold.
 *
 * Front-end only for now: `lookupRepair` resolves demo data after a short
 * delay so loading / error / empty states are all exercised. Swap the body
 * for a real API call (GET /api/repairs/:ref) without touching the UI.
 */

export const REPAIR_STAGES = [
  "Booking Confirmed",
  "Device Received",
  "Diagnosis in Progress",
  "Awaiting Customer Approval",
  "Parts Ordered",
  "Repair in Progress",
  "Quality Testing",
  "Ready for Collection",
  "Completed",
] as const;

export type RepairStage = (typeof REPAIR_STAGES)[number];

export interface StageEvent {
  stage: RepairStage;
  /** ISO timestamp — present once the stage is completed/entered */
  timestamp?: string;
  /** Optional estimate shown for the next upcoming stage */
  estimate?: string;
}

export interface RepairRecord {
  reference: string;
  customerName: string;
  deviceModel: string;
  repairType: string;
  dateReceived: string;
  estimatedCompletion: string;
  currentStage: RepairStage;
  stageHistory: StageEvent[];
  technicianNotes: string[];
  collection: string;
  amountPaid: number;
  balanceDue: number;
}

/** Reference format: OR-YYYY-NNNN (shown as placeholder in the UI) */
export const REFERENCE_PATTERN = /^OR-\d{4}-\d{3,5}$/i;

// ── Demo records (replace with API) ─────────────────────────────────────────
const DEMO_REPAIRS: Record<string, RepairRecord> = {
  "OR-2026-0117": {
    reference: "OR-2026-0117",
    customerName: "James T.",
    deviceModel: "iPhone 15 Pro",
    repairType: "Screen replacement",
    dateReceived: "2026-06-26",
    estimatedCompletion: "2026-06-29",
    currentStage: "Repair in Progress",
    stageHistory: [
      { stage: "Booking Confirmed", timestamp: "2026-06-25T14:32:00" },
      { stage: "Device Received", timestamp: "2026-06-26T09:15:00" },
      { stage: "Diagnosis in Progress", timestamp: "2026-06-26T10:05:00" },
      { stage: "Awaiting Customer Approval", timestamp: "2026-06-26T12:40:00" },
      { stage: "Parts Ordered", timestamp: "2026-06-27T08:30:00" },
      { stage: "Repair in Progress", timestamp: "2026-06-28T11:20:00" },
      { stage: "Quality Testing", estimate: "Expected later today" },
    ],
    technicianNotes: [
      "Front glass and OLED cracked; frame straight — clean replacement.",
      "Genuine-quality panel fitted. True Tone re-calibrated.",
    ],
    collection: "Collect in store — 76 Cookridge Street, Leeds LS2 8GL",
    amountPaid: 40,
    balanceDue: 89,
  },
};

export interface LookupInput {
  reference: string;
  /** email address or phone number */
  contact: string;
}

export type LookupResult =
  | { ok: true; repair: RepairRecord }
  | { ok: false; error: string };

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function lookupRepair({
  reference,
  contact,
}: LookupInput): Promise<LookupResult> {
  // TODO(backend): replace with fetch(`/api/repairs/${reference}?contact=…`)
  await delay(900);

  const ref = reference.trim().toUpperCase();
  const record = DEMO_REPAIRS[ref];

  if (!record || !contact.trim()) {
    return {
      ok: false,
      error:
        "We couldn't find a repair matching those details. Double-check your reference and the email or phone number used when booking — or call us on +44 7768 426754.",
    };
  }
  return { ok: true, repair: record };
}

export function stageIndex(stage: RepairStage): number {
  return REPAIR_STAGES.indexOf(stage);
}
