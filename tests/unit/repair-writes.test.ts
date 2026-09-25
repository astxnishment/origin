import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ create: vi.fn(), update: vi.fn(), session: vi.fn(), email: vi.fn() }));
vi.mock("@/lib/server/repairStore", () => ({ createRepair: mocks.create, updateRepairStatus: mocks.update, RepairStoreError: class extends Error {} }));
vi.mock("@/lib/server/auth", () => ({ getCustomerSession: mocks.session }));
vi.mock("@/lib/server/email", () => ({ sendEmail: mocks.email }));
const reference = "OR-20260922-0123456789AB";

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
  vi.stubEnv("VERCEL_ENV", "preview");
  vi.stubEnv("DEPLOYMENT_ENV", undefined);
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://originrepairs.co.uk");
  vi.stubEnv("PRODUCTION_OPERATIONS_ENABLED", "false");
  vi.stubEnv("REPAIR_WRITES_ENABLED", "false");
  vi.stubEnv("ALLOW_PREVIEW_REPAIR_WRITES", "false");
  vi.stubEnv("NEXT_PUBLIC_TRACKING_ENABLED", "true");
  vi.stubEnv("NEXT_PUBLIC_BOOKING_ENABLED", "true");
  vi.stubEnv("NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED", "true");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
  vi.stubEnv("STAFF_EMAILS", "staff@example.com");
  mocks.create.mockResolvedValue({ repair: { reference }, created: true });
  mocks.update.mockResolvedValue({ reference, status: "received" });
  mocks.session.mockResolvedValue({ email: "staff@example.com", expiresAt: Date.now() + 60_000 });
  mocks.email.mockResolvedValue({ ok: true });
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.resetModules(); });

function request(path: string, body: unknown, method = "POST") {
  return new NextRequest(`https://originrepairs.co.uk${path}`, {
    method,
    headers: { "content-type": "application/json", origin: "https://originrepairs.co.uk", "sec-fetch-site": "same-origin", "x-forwarded-for": randomUUID() },
    body: JSON.stringify(body),
  });
}
async function mutateAll() {
  const [{ POST: booking }, { POST: manual }, { PATCH: update }] = await Promise.all([
    import("@/app/api/booking/route"), import("@/app/api/admin/repairs/route"), import("@/app/api/admin/repairs/[reference]/route"),
  ]);
  const date = new Date(); date.setUTCDate(date.getUTCDate() + 7); if (date.getUTCDay() === 0) date.setUTCDate(date.getUTCDate() + 1);
  return Promise.all([
    booking(request("/api/booking", { name: "Test Customer", email: "customer@example.com", phone: "07700900123", model: "PlayStation 5", deviceType: "console", repair: "HDMI port repair", serviceMethod: "drop-off", date: date.toISOString().slice(0, 10), time: "10:00am", consentToContact: true, idempotencyKey: randomUUID(), formStartedAt: Date.now() - 5000, turnstileToken: "token" })),
    manual(request("/api/admin/repairs", { customerName: "Test Customer", customerEmail: "customer@example.com", deviceLabel: "PlayStation 5", repairLabel: "HDMI port repair", serviceMethod: "drop-off", requestKey: randomUUID() })),
    update(request(`/api/admin/repairs/${reference}`, { status: "received", customerNote: "Received", expectedUpdatedAt: "2026-09-22T10:00:00.000Z" }, "PATCH"), { params: Promise.resolve({ reference }) }),
  ]);
}

describe("repair database write deployment policy", () => {
  it("blocks all mutation routes by default in preview even when tracking is enabled", async () => {
    const responses = await mutateAll();
    expect(responses.map((response) => response.status)).toEqual([503, 503, 503]);
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.email).not.toHaveBeenCalled();
  });

  it("allows explicitly opted-in local or staging integration checks", async () => {
    vi.stubEnv("ALLOW_PREVIEW_REPAIR_WRITES", "true");
    const responses = await mutateAll();
    expect(responses.map((response) => response.status)).toEqual([200, 201, 200]);
    expect(mocks.create).toHaveBeenCalledTimes(2);
    expect(mocks.update).toHaveBeenCalledTimes(1);
  });

  it.each([
    { approved: "false", enabled: "false", override: "true" },
    { approved: "false", enabled: "true", override: "true" },
    { approved: "true", enabled: "false", override: "true" },
  ])("never uses the preview override to bypass production approval: %j", async ({ approved, enabled, override }) => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("PRODUCTION_OPERATIONS_ENABLED", approved);
    vi.stubEnv("REPAIR_WRITES_ENABLED", enabled);
    vi.stubEnv("ALLOW_PREVIEW_REPAIR_WRITES", override);
    const responses = await mutateAll();
    expect(responses.map((response) => response.status)).toEqual([503, 503, 503]);
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it("never uses a preview override to bypass generic production approval", async () => {
    vi.stubEnv("VERCEL_ENV", undefined);
    vi.stubEnv("DEPLOYMENT_ENV", "production");
    vi.stubEnv("ALLOW_PREVIEW_REPAIR_WRITES", "true");
    vi.stubEnv("REPAIR_WRITES_ENABLED", "true");
    const responses = await mutateAll();
    expect(responses.map((response) => response.status)).toEqual([503, 503, 503]);
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it.each(["vercel", "generic"])("allows approved canonical production on %s with repair writes explicitly enabled", async (host) => {
    vi.stubEnv("VERCEL_ENV", host === "vercel" ? "production" : undefined);
    vi.stubEnv("DEPLOYMENT_ENV", host === "generic" ? "production" : undefined);
    vi.stubEnv("PRODUCTION_OPERATIONS_ENABLED", "true");
    vi.stubEnv("REPAIR_WRITES_ENABLED", "true");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "test-server-key");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "test-site-key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, hostname: "originrepairs.co.uk" }), { status: 200 })));
    const responses = await mutateAll();
    expect(responses.map((response) => response.status)).toEqual([200, 201, 200]);
    expect(mocks.create).toHaveBeenCalledTimes(2);
    expect(mocks.update).toHaveBeenCalledTimes(1);
  });

  it("does not approve a production deployment with a different canonical hostname", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://staging.example.com");
    vi.stubEnv("PRODUCTION_OPERATIONS_ENABLED", "true");
    vi.stubEnv("REPAIR_WRITES_ENABLED", "true");
    expect((await mutateAll()).map((response) => response.status)).toEqual([503, 503, 503]);
    expect(mocks.create).not.toHaveBeenCalled();
  });
});
