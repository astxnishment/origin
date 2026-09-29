import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("HOSTING_PROVIDER", "cloudflare");
  vi.stubEnv("VERCEL_ENV", undefined);
  vi.stubEnv("DEPLOYMENT_ENV", "production");
  vi.stubEnv("PRODUCTION_OPERATIONS_ENABLED", "true");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://originrepairs.com");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "test-server-key");
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "test-site-key");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetModules();
});

function request(headers: Record<string, string> = {}) {
  return new NextRequest("https://originrepairs.com/api/contact", { headers });
}

describe("explicit Cloudflare client IP trust", () => {
  it("keeps the same rate-limit identity despite spoofed forwarding headers", async () => {
    const { checkRateLimit } = await import("@/lib/server/requestSecurity");
    const incoming = (spoofed: string) => request({
      "cf-connecting-ip": "192.0.2.20",
      "x-vercel-forwarded-for": spoofed,
      "x-forwarded-for": spoofed,
    });
    expect(checkRateLimit(incoming("192.0.2.1"), "test", 1, 60_000)).toBe(true);
    expect(checkRateLimit(incoming("192.0.2.2"), "test", 1, 60_000)).toBe(false);
    expect(checkRateLimit(request({ "cf-connecting-ip": "192.0.2.21" }), "test", 1, 60_000)).toBe(true);
  });

  it.each([
    undefined, "", "not-an-ip", "192.0.2.1, 192.0.2.2", "192.0.2.1:443", "[2001:db8::1]",
  ])("rejects missing or malformed Cloudflare IPs without trusting a fallback: %s", async (address) => {
    const { checkRateLimit, verifyTurnstile } = await import("@/lib/server/requestSecurity");
    const provider = vi.fn();
    vi.stubGlobal("fetch", provider);
    const incoming = request({
      ...(address === undefined ? {} : { "cf-connecting-ip": address }),
      "x-vercel-forwarded-for": "192.0.2.1",
      "x-forwarded-for": "192.0.2.2",
    });
    expect(checkRateLimit(incoming, "test", 10, 60_000)).toBe(false);
    expect(await verifyTurnstile("test-token", incoming)).toBe(false);
    expect(provider).not.toHaveBeenCalled();
  });

  it.each(["192.0.2.20", "2001:db8::20"])("passes only the edge-provided IP to Siteverify: %s", async (address) => {
    const { verifyTurnstile } = await import("@/lib/server/requestSecurity");
    const provider = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ success: true, hostname: "originrepairs.com" })));
    vi.stubGlobal("fetch", provider);
    expect(await verifyTurnstile("test-token", request({
      "cf-connecting-ip": address,
      "x-vercel-forwarded-for": "192.0.2.1",
      "x-forwarded-for": "192.0.2.2",
    }))).toBe(true);
    const submitted = new URLSearchParams(String(provider.mock.calls[0][1]?.body));
    expect(submitted.get("remoteip")).toBe(address);
  });

  it("still rejects a missing Cloudflare IP during an offline preview", async () => {
    vi.stubEnv("DEPLOYMENT_ENV", "preview");
    vi.stubEnv("PRODUCTION_OPERATIONS_ENABLED", "false");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
    const { verifyTurnstile } = await import("@/lib/server/requestSecurity");
    expect(await verifyTurnstile("", request())).toBe(false);
    expect(await verifyTurnstile("", request({ "cf-connecting-ip": "192.0.2.20" }))).toBe(true);
  });

  it.each([undefined, "vercel", "generic"])("ignores Cloudflare IP headers without the explicit provider setting: %s", async (provider) => {
    vi.stubEnv("HOSTING_PROVIDER", provider);
    const { checkRateLimit } = await import("@/lib/server/requestSecurity");
    const incoming = (address: string) => request({
      "cf-connecting-ip": address,
      "x-vercel-forwarded-for": "192.0.2.1",
    });
    expect(checkRateLimit(incoming("192.0.2.20"), "test", 1, 60_000)).toBe(true);
    expect(checkRateLimit(incoming("192.0.2.21"), "test", 1, 60_000)).toBe(false);
  });
});
