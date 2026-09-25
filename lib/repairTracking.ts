export const REPAIR_STATUSES = [
  "requested",
  "received",
  "assessing",
  "awaiting-approval",
  "repairing",
  "ready",
  "returned",
  "cancelled",
] as const;

export type RepairStatus = (typeof REPAIR_STATUSES)[number];

export const REPAIR_STATUS_LABELS: Record<RepairStatus, string> = {
  requested: "Request received",
  received: "Device received",
  assessing: "Being assessed",
  "awaiting-approval": "Awaiting your approval",
  repairing: "Repair in progress",
  ready: "Ready for collection or return",
  returned: "Collected or returned",
  cancelled: "Cancelled",
};

export const TERMINAL_REPAIR_STATUSES: readonly RepairStatus[] = [
  "returned",
  "cancelled",
];

export type RepairHistoryEntry = {
  status: RepairStatus;
  customerNote: string;
  createdAt: string;
};

/** Safe to return to the authenticated customer who owns this repair. */
export type CustomerRepair = {
  reference: string;
  deviceLabel: string;
  repairLabel: string;
  partLabel: string;
  priceLabel: string;
  warranty: string;
  serviceMethod: "drop-off" | "mail-in";
  requestedDate: string | null;
  requestedTime: string | null;
  issue: string;
  status: RepairStatus;
  createdAt: string;
  updatedAt: string;
  history: RepairHistoryEntry[];
};

/** Contact details are only exposed by the staff storage methods. */
export type StaffRepair = CustomerRepair & {
  id: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  returnAddress: string;
};

export type CreateRepairInput = {
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  deviceLabel: string;
  repairLabel: string;
  partLabel?: string;
  priceLabel?: string;
  warranty?: string;
  serviceMethod?: "drop-off" | "mail-in";
  returnAddress?: string | null;
  requestedDate?: string | null;
  requestedTime?: string | null;
  issue?: string;
};
