import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.stubEnv(
    "AUTH_SECRET",
    "test-auth-secret-with-at-least-thirty-two-characters"
  );
});

afterEach(() => {
  vi.doUnmock("next/headers");
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("customer authentication tokens", () => {
  it("loads request cookies only when reading a customer session", async () => {
    let cookieValue = "";
    const cookies = vi.fn(async () => ({
      get: (name: string) => name === "origin_customer_session" ? { value: cookieValue } : undefined,
    }));
    const loadHeaders = vi.fn(() => ({ cookies }));
    vi.doMock("next/headers", loadHeaders);
    const { createSessionToken, verifySessionToken, getCustomerSession } = await import("@/lib/server/auth");
    cookieValue = createSessionToken("customer@example.com");
    expect(verifySessionToken(cookieValue)?.email).toBe("customer@example.com");
    expect(loadHeaders).not.toHaveBeenCalled();
    expect(cookies).not.toHaveBeenCalled();

    await expect(getCustomerSession()).resolves.toMatchObject({ email: "customer@example.com" });
    expect(loadHeaders).toHaveBeenCalledTimes(1);
    expect(cookies).toHaveBeenCalledTimes(1);
  });

  it("verifies a short-lived login token for the requested account route", async () => {
    const { createLoginToken, verifyLoginToken } = await import(
      "@/lib/server/auth"
    );
    const now = Date.now();
    const token = createLoginToken(
      "Customer@Example.com",
      "/account/repairs",
      now
    );

    expect(verifyLoginToken(token, now + 1_000)).toMatchObject({
      email: "customer@example.com",
      next: "/account/repairs",
    });
  });

  it("rejects expired and modified login tokens", async () => {
    const { createLoginToken, verifyLoginToken } = await import(
      "@/lib/server/auth"
    );
    const now = Date.now();
    const token = createLoginToken("customer@example.com", "/account", now);
    const tampered = Buffer.from(token, "base64url");
    tampered[tampered.length - 1] ^= 1;

    expect(verifyLoginToken(token, now + 16 * 60 * 1_000)).toBeNull();
    expect(verifyLoginToken(tampered.toString("base64url"), now + 1_000)).toBeNull();
  });

  it("does not accept a login token as a customer session", async () => {
    const { createLoginToken, verifySessionToken } = await import(
      "@/lib/server/auth"
    );
    const token = createLoginToken("customer@example.com");
    expect(verifySessionToken(token)).toBeNull();
  });

  it("can use the private email credential when a dedicated secret is absent", async () => {
    vi.stubEnv("AUTH_SECRET", "");
    vi.stubEnv(
      "RESEND_API_KEY",
      "test-private-email-key-with-at-least-thirty-two-characters"
    );
    vi.resetModules();
    const { createSessionToken, verifySessionToken } = await import(
      "@/lib/server/auth"
    );
    const token = createSessionToken("customer@example.com");

    expect(verifySessionToken(token)?.email).toBe("customer@example.com");
  });
});
