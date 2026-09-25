import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { normaliseNextPath } from "@/lib/server/auth";
import { readJsonBody } from "@/lib/server/requestSecurity";
import { contactRequestSchema } from "@/lib/forms/schemas";

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.resetModules(); });

describe("launch regressions", () => {
  it.each(["https://evil.example", "//evil.example", "/\\evil.example", "/account/../../other", "/%2f%2fevil.example", "/contact"])("restricts account redirect %s", (next) => {
    expect(normaliseNextPath(next)).toBe("/account");
  });
  it("preserves an account destination", () => {
    expect(normaliseNextPath("/account/repairs?filter=open#latest")).toBe("/account/repairs?filter=open#latest");
  });
  it("accepts multiline contact messages", () => {
    expect(contactRequestSchema.safeParse({ name: "Test Customer", email: "test@example.com", issue: "The screen is damaged.\nCan you quote for a repair?", consentToContact: true, formStartedAt: Date.now() - 3000, idempotencyKey: "multiline_message_test_123" }).success).toBe(true);
  });
  it("bounds a body even without a content-length header", async () => {
    const request = new NextRequest("https://originrepairs.co.uk/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: "x".repeat(100) }) });
    await expect(readJsonBody(request, 20)).rejects.toMatchObject({ status: 413 });
  });
  it("rejects cross-site submissions", async () => {
    const request = new NextRequest("https://originrepairs.co.uk/api/contact", { method: "POST", headers: { "content-type": "application/json", "sec-fetch-site": "cross-site" }, body: "{}" });
    await expect(readJsonBody(request)).rejects.toMatchObject({ status: 403 });
  });
  it("passes stable idempotency keys to the delivery provider", async () => {
    vi.stubEnv("EMAILS_ENABLED", "true");
    vi.stubEnv("ALLOW_PREVIEW_EMAILS", "true");
    vi.stubEnv("RESEND_API_KEY", "test-only-key");
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { sendEmail } = await import("@/lib/server/email");
    const result = await sendEmail({ to: "test@example.com", subject: "Test", html: "Test", idempotencyKey: "contact/business/example" });
    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith("https://api.resend.com/emails", expect.objectContaining({ headers: expect.objectContaining({ "Idempotency-Key": "contact/business/example" }) }));
  });
  it("never contacts the provider when delivery is disabled", async () => {
    vi.stubEnv("EMAILS_ENABLED", "false");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { sendEmail } = await import("@/lib/server/email");
    expect(await sendEmail({ to: "test@example.com", subject: "Test", html: "Test" })).toEqual({ ok: false, reason: "disabled" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
