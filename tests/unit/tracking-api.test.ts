import { randomUUID } from "node:crypto";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { FEATURES } from "@/lib/constants";
import type { StaffRepair } from "@/lib/repairTracking";
import { getCustomerSession } from "@/lib/server/auth";
import { sendEmail } from "@/lib/server/email";
import { createRepair, updateRepairStatus, RepairStoreError } from "@/lib/server/repairStore";
import { getStaffSession, isStaffEmail } from "@/lib/server/staffAuth";
import { POST as booking } from "@/app/api/booking/route";
import { POST as manualRepair } from "@/app/api/admin/repairs/route";
import { PATCH as updateStatus } from "@/app/api/admin/repairs/[reference]/route";

vi.mock("@/lib/constants", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/constants")>();
  return { ...actual, FEATURES: { ...actual.FEATURES } };
});
vi.mock("@/lib/server/auth", () => ({ getCustomerSession: vi.fn() }));
vi.mock("@/lib/server/email", () => ({ sendEmail: vi.fn() }));
vi.mock("@/lib/server/repairStore", () => ({
  createRepair: vi.fn(),
  updateRepairStatus: vi.fn(),
  RepairStoreError: class extends Error {
    constructor(public readonly code: string, message: string) { super(message); }
  },
}));

const session = vi.mocked(getCustomerSession);
const email = vi.mocked(sendEmail);
const create = vi.mocked(createRepair);
const update = vi.mocked(updateRepairStatus);
const repair: StaffRepair = {
  id: "0e1aa695-10e8-43dd-81c1-34d2473c6af9",
  reference: "OR-20260922-0123456789AB",
  customerEmail: "customer@example.com",
  customerName: "Test Customer",
  customerPhone: "+44 7700 900123",
  returnAddress: "",
  deviceLabel: "PlayStation 5",
  repairLabel: "HDMI port repair",
  partLabel: "To be confirmed",
  priceLabel: "Assessment required",
  warranty: "Confirmed after assessment",
  serviceMethod: "drop-off",
  requestedDate: null,
  requestedTime: null,
  issue: "No HDMI output",
  status: "requested",
  createdAt: "2026-09-22T10:00:00.000Z",
  updatedAt: "2026-09-22T10:00:00.000Z",
  history: [{ status: "requested", customerNote: "Request received", createdAt: "2026-09-22T10:00:00.000Z" }],
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("STAFF_EMAILS", "staff@example.com");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
  vi.stubEnv("VERCEL_ENV", "preview");
  vi.stubEnv("ALLOW_PREVIEW_REPAIR_WRITES", "true");
  FEATURES.trackingEnabled = true;
  FEATURES.bookingEnabled = true;
  FEATURES.mailInEnabled = true;
  session.mockResolvedValue({ email: "staff@example.com", expiresAt: Date.now() + 60_000 });
  email.mockResolvedValue({ ok: true });
  create.mockResolvedValue({ repair, created: true });
  update.mockResolvedValue({ ...repair, status: "received", updatedAt: "2026-09-22T11:00:00.000Z" });
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

function request(path: string, body: unknown, method = "POST", headers: Record<string, string> = {}) {
  return new NextRequest(`https://originrepairs.co.uk${path}`, {
    method,
    headers: { "content-type": "application/json", origin: "https://originrepairs.co.uk", "sec-fetch-site": "same-origin", "x-forwarded-for": randomUUID(), ...headers },
    body: JSON.stringify(body),
  });
}
function bookingInput(extra: Record<string, unknown> = {}) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 7);
  if (date.getUTCDay() === 0) date.setUTCDate(date.getUTCDate() + 1);
  return {
    name: "Test Customer", email: "customer@example.com", phone: "+44 7700 900123",
    deviceType: "console", model: "PlayStation 5", repair: "HDMI port repair",
    serviceMethod: "drop-off", date: date.toISOString().slice(0, 10), time: "10:00am",
    issue: "No HDMI output", consentToContact: true, formStartedAt: Date.now() - 5000,
    idempotencyKey: randomUUID(), ...extra,
  };
}
function manualInput(extra: Record<string, unknown> = {}) {
  return {
    customerName: "Test Customer", customerEmail: "customer@example.com", customerPhone: "+44 7700 900123",
    deviceLabel: "PlayStation 5", repairLabel: "HDMI port repair", serviceMethod: "drop-off",
    issue: "No HDMI output", requestKey: randomUUID(), ...extra,
  };
}
function patchRequest(extra: Record<string, unknown> = {}, headers: Record<string, string> = {}) {
  return request(`/api/admin/repairs/${repair.reference}`, { status: "received", customerNote: "Your device has arrived.", expectedUpdatedAt: repair.updatedAt, ...extra }, "PATCH", headers);
}
const context = () => ({ params: Promise.resolve({ reference: repair.reference }) });

describe("staff authorization", () => {
  it("requires an explicit email allowlist with no business-email fallback", async () => {
    vi.stubEnv("STAFF_EMAILS", "");
    expect(isStaffEmail("staff@example.com")).toBe(false);
    expect(isStaffEmail("tech@originrepairs.co.uk")).toBe(false);
    expect(await getStaffSession()).toBeNull();
    vi.stubEnv("STAFF_EMAILS", " Manager@Example.com, staff@example.com ");
    expect(isStaffEmail("MANAGER@example.com")).toBe(true);
    expect(isStaffEmail("fake-staff@example.com")).toBe(false);
  });

  it("rejects unsigned and non-staff manual repair requests", async () => {
    session.mockResolvedValueOnce(null);
    expect((await manualRepair(request("/api/admin/repairs", manualInput()))).status).toBe(401);
    session.mockResolvedValueOnce({ email: "customer@example.com", expiresAt: Date.now() + 60_000 });
    expect((await manualRepair(request("/api/admin/repairs", manualInput()))).status).toBe(403);
    expect(create).not.toHaveBeenCalled();
  });

  it("protects status mutations even when a caller knows a repair reference", async () => {
    session.mockResolvedValueOnce({ email: "customer@example.com", expiresAt: Date.now() + 60_000 });
    expect((await updateStatus(patchRequest(), context())).status).toBe(403);
    expect(update).not.toHaveBeenCalled();
  });

  it.each<Record<string, string>>([
    { origin: "https://malicious.example" },
    { origin: "" },
    { "sec-fetch-site": "same-site" },
  ])("rejects cross-origin or missing-origin staff changes: %j", async (headers) => {
    expect((await manualRepair(request("/api/admin/repairs", manualInput(), "POST", headers))).status).toBe(403);
    expect((await updateStatus(patchRequest({}, headers), context())).status).toBe(403);
    expect(create).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });
});

describe("saved booking outcomes", () => {
  it("saves the resolved request before notifications and returns its tracking reference", async () => {
    const input = bookingInput();
    const response = await booking(request("/api/booking", input));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, reference: repair.reference, trackingUrl: `/track?reference=${repair.reference}`, confirmationEmailSent: true });
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ customerEmail: input.email, deviceLabel: "PlayStation 5", serviceMethod: "drop-off", requestedDate: input.date, requestedTime: input.time }), `booking_${input.idempotencyKey}`);
    expect(create.mock.invocationCallOrder[0]).toBeLessThan(email.mock.invocationCallOrder[0]);
    expect(email.mock.calls[1][0].html).toContain(repair.reference);
    expect(email.mock.calls[1][0].html).toContain("/track?reference=");
  });

  it("acknowledges a persisted request if both email notifications fail", async () => {
    email.mockResolvedValue({ ok: false, reason: "network" });
    const response = await booking(request("/api/booking", bookingInput()));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, reference: repair.reference, confirmationEmailSent: false });
    expect(email).toHaveBeenCalledTimes(2);
  });

  it("replays a saved request successfully without duplicate email", async () => {
    create.mockResolvedValue({ repair, created: false });
    const response = await booking(request("/api/booking", bookingInput()));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, reference: repair.reference });
    expect(email).not.toHaveBeenCalled();
  });

  it("does not claim receipt or send email when durable storage is unavailable", async () => {
    create.mockRejectedValue(new RepairStoreError("not-configured", "Private configuration detail"));
    const response = await booking(request("/api/booking", bookingInput()));
    expect(response.status).toBe(503);
    const result = await response.json();
    expect(result).not.toHaveProperty("ok", true);
    expect(JSON.stringify(result)).not.toContain("Private configuration detail");
    expect(email).not.toHaveBeenCalled();
  });

  it("rejects reused request keys with changed details", async () => {
    create.mockRejectedValue(new RepairStoreError("idempotency-conflict", "Mismatch"));
    expect((await booking(request("/api/booking", bookingInput()))).status).toBe(409);
    expect(email).not.toHaveBeenCalled();
  });

  it("retains email-backed failure behavior when tracking is disabled", async () => {
    FEATURES.trackingEnabled = false;
    email.mockResolvedValue({ ok: false, reason: "provider" });
    expect((await booking(request("/api/booking", bookingInput()))).status).toBe(503);
    expect(create).not.toHaveBeenCalled();
  });
});

describe("staff repair changes", () => {
  it("creates a manual repair with assessment wording and a namespaced request key", async () => {
    const input = manualInput();
    const response = await manualRepair(request("/api/admin/repairs", input));
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ ok: true, repair: { reference: repair.reference }, created: true });
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ priceLabel: "Assessment required", partLabel: "To be confirmed after assessment" }), `staff_${input.requestKey}`);
    expect(email).not.toHaveBeenCalled();
  });

  it("requires a return address for a manual mail-in repair", async () => {
    const response = await manualRepair(request("/api/admin/repairs", manualInput({ serviceMethod: "mail-in", returnAddress: "" })));
    expect(response.status).toBe(400);
    expect(create).not.toHaveBeenCalled();
  });

  it("attributes an update to the session and passes the concurrency precondition", async () => {
    const response = await updateStatus(patchRequest({ actorEmail: "forged@example.com" }), context());
    expect(response.status).toBe(200);
    expect(update).toHaveBeenCalledWith(repair.reference, "received", "Your device has arrived.", "staff@example.com", repair.updatedAt);
  });

  it("rejects invalid statuses and updates without a concurrency precondition", async () => {
    expect((await updateStatus(patchRequest({ status: "made-up" }), context())).status).toBe(400);
    expect((await updateStatus(patchRequest({ expectedUpdatedAt: "" }), context())).status).toBe(400);
    expect(update).not.toHaveBeenCalled();
  });

  it("returns a conflict when another staff member has updated the repair", async () => {
    update.mockRejectedValue(new RepairStoreError("stale-update", "Conflict"));
    const response = await updateStatus(patchRequest(), context());
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ error: expect.stringContaining("Refresh") });
  });

  it("returns a retryable failure without exposing database errors", async () => {
    update.mockRejectedValue(new Error("Private database connection details"));
    const response = await updateStatus(patchRequest(), context());
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("Private database");
  });
});
