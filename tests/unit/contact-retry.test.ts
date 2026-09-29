import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as contact } from "@/app/api/contact/route";
import { sendEmail, type EmailResult } from "@/lib/server/email";
import {
  beginIdempotentRequest,
  completeIdempotentRequest,
  getIdempotentRequestState,
  releaseIdempotentRequest,
  requestPayloadFingerprint,
  verifyTurnstile,
} from "@/lib/server/requestSecurity";

vi.mock("@/lib/server/email", () => ({ sendEmail: vi.fn() }));
const email = vi.mocked(sendEmail);

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
  vi.stubEnv("VERCEL_ENV", "preview");
  vi.stubEnv("DEPLOYMENT_ENV", undefined);
  vi.stubEnv("PRODUCTION_OPERATIONS_ENABLED", "false");
  email.mockResolvedValue({ ok: true });
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function input(extra: Record<string, unknown> = {}) {
  return {
    name: "Test Customer", email: "customer@example.com", phone: "", device: "Phone",
    issue: "Please retain this message.\nIt has two lines.", consentToContact: true,
    formStartedAt: Date.now() - 5000, idempotencyKey: randomUUID(), turnstileToken: "first-token",
    ...extra,
  };
}
function request(body: unknown) {
  return new NextRequest("https://originrepairs.co.uk/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": randomUUID(), origin: "https://originrepairs.co.uk" },
    body: JSON.stringify(body),
  });
}

describe("contact response recovery", () => {
  it("returns the original successful result after a lost response, with no duplicate email", async () => {
    const original = input();
    const response = await contact(request(original));
    const body = await response.json();
    expect(response.status).toBe(200);
    const replay = await contact(request({ ...original, turnstileToken: "replacement-token", formStartedAt: Date.now() - 3 * 60 * 60 * 1000 }));
    expect(replay.status).toBe(200);
    expect(await replay.json()).toEqual(body);
    expect(replay.headers.get("cache-control")).toBe("no-store");
    expect(email).toHaveBeenCalledTimes(2);
  });

  it("normalizes trimmed fields, email casing and message line endings for replay", async () => {
    const original = input({ name: "  Test Customer  ", email: "CUSTOMER@EXAMPLE.COM", issue: "First line.\r\nSecond line." });
    expect((await contact(request(original))).status).toBe(200);
    expect((await contact(request({ ...original, name: "Test Customer", email: "customer@example.com", issue: "First line.\nSecond line.", turnstileToken: "new-token" }))).status).toBe(200);
    expect(email).toHaveBeenCalledTimes(2);
  });

  it("preserves an honest receipt-failure result on replay", async () => {
    email.mockResolvedValueOnce({ ok: true }).mockResolvedValueOnce({ ok: false, reason: "network" });
    const original = input();
    const first = await (await contact(request(original))).json();
    expect(first).toMatchObject({ ok: true, confirmationEmailSent: false });
    const replay = await contact(request({ ...original, turnstileToken: "new-token" }));
    expect(await replay.json()).toEqual(first);
    expect(email).toHaveBeenCalledTimes(2);
  });

  it.each(["name", "email", "device", "issue"])("rejects changed %s under a completed request key", async (field) => {
    const original = input();
    expect((await contact(request(original))).status).toBe(200);
    const response = await contact(request({ ...original, [field]: field === "email" ? "different@example.com" : "Different details" }));
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ error: expect.stringContaining("different details") });
    expect(email).toHaveBeenCalledTimes(2);
  });

  it("distinguishes a pending request from an acknowledged one", async () => {
    let deliver!: (result: EmailResult) => void;
    email.mockImplementationOnce(() => new Promise((resolve) => { deliver = resolve; }));
    const original = input();
    const pending = contact(request(original));
    await vi.waitFor(() => expect(email).toHaveBeenCalledTimes(1));
    try {
      const response = await contact(request({ ...original, turnstileToken: "next-token" }));
      expect(response.status).toBe(409);
      expect(await response.json()).toMatchObject({ error: expect.stringContaining("still being processed") });
      expect(email).toHaveBeenCalledTimes(1);
    } finally {
      deliver({ ok: true });
    }
    expect((await pending).status).toBe(200);
  });

  it("retries unchanged failed delivery but retains its payload identity", async () => {
    email.mockResolvedValueOnce({ ok: false, reason: "network" });
    const original = input();
    expect((await contact(request(original))).status).toBe(503);
    expect((await contact(request({ ...original, issue: "A different message" }))).status).toBe(409);
    expect((await contact(request({ ...original, turnstileToken: "new-token" }))).status).toBe(200);
    expect(email).toHaveBeenCalledTimes(3);
  });

  it("expires cached acknowledgements after fifteen minutes", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-22T10:00:00Z"));
    const original = input();
    expect((await contact(request(original))).status).toBe(200);
    vi.advanceTimersByTime(15 * 60 * 1000 + 1);
    expect((await contact(request({ ...original, formStartedAt: Date.now() - 5000, turnstileToken: "new-token" }))).status).toBe(200);
    expect(email).toHaveBeenCalledTimes(4);
  });

  it("stores only a hash and generic acknowledgement and preserves legacy helper calls", () => {
    const key = randomUUID();
    const payload = { email: "private@example.com", issue: "Private customer issue" };
    const fingerprint = requestPayloadFingerprint(payload);
    expect(fingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(requestPayloadFingerprint({ issue: payload.issue, email: payload.email })).toBe(fingerprint);
    expect(beginIdempotentRequest("contact-test", key, fingerprint)).toBe(true);
    completeIdempotentRequest("contact-test", key, { status: 200, body: { ok: true, confirmationEmailSent: true, message: "Message received." } });
    const replay = getIdempotentRequestState("contact-test", key, fingerprint);
    expect(replay.status).toBe("complete");
    expect(JSON.stringify(replay)).not.toContain(payload.email);
    expect(JSON.stringify(replay)).not.toContain(payload.issue);
    const legacyKey = randomUUID();
    expect(beginIdempotentRequest("booking", legacyKey)).toBe(true);
    completeIdempotentRequest("booking", legacyKey);
    expect(beginIdempotentRequest("booking", legacyKey)).toBe(false);
    releaseIdempotentRequest("booking", legacyKey);
    expect(beginIdempotentRequest("booking", legacyKey)).toBe(true);
  });
});

describe.each(["vercel", "generic"])("production Turnstile enforcement (%s)", (host) => {
  function productionHost() {
    vi.stubEnv("VERCEL_ENV", host === "vercel" ? "production" : undefined);
    vi.stubEnv("DEPLOYMENT_ENV", host === "generic" ? "production" : undefined);
  }
  it("allows a fully disabled offline preview without calling Cloudflare", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await verifyTurnstile("", request({}))).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ["", ""],
    ["server-key", ""],
    ["", "public-key"],
  ])("blocks approved production with incomplete key configuration (%s/%s)", async (secret, siteKey) => {
    productionHost();
    vi.stubEnv("PRODUCTION_OPERATIONS_ENABLED", "true");
    vi.stubEnv("TURNSTILE_SECRET_KEY", secret);
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", siteKey);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await verifyTurnstile("challenge-token", request({}))).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    { success: false, hostname: "originrepairs.co.uk" },
    { success: true, hostname: "different.example" },
    { success: true },
  ])("rejects provider key/token mismatches or a different widget hostname: %j", async (providerResult) => {
    productionHost();
    vi.stubEnv("PRODUCTION_OPERATIONS_ENABLED", "true");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "server-key");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "public-key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(providerResult), { status: 200 })));
    expect(await verifyTurnstile("challenge-token", request({}))).toBe(false);
  });

  it("accepts provider-verified tokens for the actual production hostname", async () => {
    productionHost();
    vi.stubEnv("PRODUCTION_OPERATIONS_ENABLED", "true");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "server-key");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "public-key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, hostname: "originrepairs.co.uk" }), { status: 200 })));
    expect(await verifyTurnstile("challenge-token", request({}))).toBe(true);
  });
});
