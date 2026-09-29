import { NextRequest } from "next/server";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { readStaffJsonBody } from "@/lib/server/staffAuth";
import { verifyTurnstile } from "@/lib/server/requestSecurity";

beforeEach(() => { vi.stubEnv("VERCEL_ENV", "preview"); vi.stubEnv("DEPLOYMENT_ENV", undefined); });
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

function request(url: string, headers: Record<string, string> = {}) {
  return new NextRequest(url, { method: "POST", headers: { "content-type": "application/json", "sec-fetch-site": "same-origin", ...headers }, body: JSON.stringify({ status: "received" }) });
}

describe("staff request origin through NextURL normalization", () => {
  it.each(["127.0.0.1", "[::1]", "localhost"])("accepts the browser's exact loopback origin at %s", async (hostname) => {
    const origin = `http://${hostname}:3108`;
    const incoming = request(`${origin}/api/admin/repairs`, { host: `${hostname}:3108`, origin });
    expect(incoming.nextUrl.hostname).toBe("localhost");
    await expect(readStaffJsonBody(incoming)).resolves.toEqual({ status: "received" });
  });

  it.each<Record<string, string>>([
    { origin: "http://localhost:3108" },
    { origin: "http://127.0.0.1:3107" },
    { origin: "https://127.0.0.1:3108" },
    { origin: "http://malicious.example:3108", "x-forwarded-host": "malicious.example:3108" },
    { origin: "http://127.0.0.1:3108", "sec-fetch-site": "same-site" },
    { origin: "" },
  ])("rejects a different origin or untrusted forwarding override: %j", async (headers) => {
    const incoming = request("http://127.0.0.1:3108/api/admin/repairs", { host: "127.0.0.1:3108", ...headers });
    await expect(readStaffJsonBody(incoming)).rejects.toMatchObject({ status: 403 });
  });

  it.each(["malicious.example:3108", "127.0.0.1:3107", "malicious.example@127.0.0.1:3108", "127.0.0.1:3108/untrusted"])("does not trust arbitrary Host values on an internal request: %s", async (host) => {
    const incoming = request("http://127.0.0.1:3108/api/admin/repairs", { host, origin: "http://localhost:3108" });
    await expect(readStaffJsonBody(incoming)).rejects.toMatchObject({ status: 403 });
  });

  it("does not trust a forwarded-host override on a non-loopback preview", async () => {
    const incoming = request("https://preview.example.com/api/admin/repairs", { origin: "https://malicious.example", "x-forwarded-host": "malicious.example" });
    await expect(readStaffJsonBody(incoming)).rejects.toMatchObject({ status: 403 });
  });

  it.each(["vercel", "generic"])("accepts the configured production HTTPS origin behind an internal proxy URL on %s", async (host) => {
    vi.stubEnv("VERCEL_ENV", host === "vercel" ? "production" : undefined);
    vi.stubEnv("DEPLOYMENT_ENV", host === "generic" ? "production" : undefined);
    const incoming = request("http://127.0.0.1:3108/api/admin/repairs", { host: "originrepairs.com", origin: "https://originrepairs.com" });
    await expect(readStaffJsonBody(incoming)).resolves.toEqual({ status: "received" });
  });

  it.each(["http://originrepairs.com", "https://www.originrepairs.com", "https://malicious.example", "http://localhost:3108"])("requires the exact configured production HTTPS origin: %s", async (origin) => {
    vi.stubEnv("VERCEL_ENV", "production");
    const incoming = request("http://127.0.0.1:3108/api/admin/repairs", { host: "originrepairs.com", origin, "x-forwarded-host": new URL(origin).host });
    await expect(readStaffJsonBody(incoming)).rejects.toMatchObject({ status: 403 });
  });

  it("rejects an arbitrary forwarded origin on a generic production host", async () => {
    vi.stubEnv("VERCEL_ENV", undefined);
    vi.stubEnv("DEPLOYMENT_ENV", "production");
    const incoming = request("http://127.0.0.1:3108/api/admin/repairs", { host: "malicious.example", origin: "https://malicious.example", "x-forwarded-host": "malicious.example" });
    await expect(readStaffJsonBody(incoming)).rejects.toMatchObject({ status: 403 });
  });

  it.each(["vercel", "generic"])("validates production Turnstile against the configured domain on %s", async (host) => {
    vi.stubEnv("VERCEL_ENV", host === "vercel" ? "production" : undefined);
    vi.stubEnv("DEPLOYMENT_ENV", host === "generic" ? "production" : undefined);
    vi.stubEnv("PRODUCTION_OPERATIONS_ENABLED", "true");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "test-server-key");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "test-site-key");
    const provider = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, hostname: "originrepairs.com" }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, hostname: "malicious.example" }), { status: 200 }));
    vi.stubGlobal("fetch", provider);
    const incoming = request("http://127.0.0.1:3108/api/booking", { host: "originrepairs.com", origin: "https://malicious.example", "x-forwarded-host": "malicious.example" });
    expect(await verifyTurnstile("test-token", incoming)).toBe(true);
    expect(await verifyTurnstile("test-token", incoming)).toBe(false);
  });
});
