import { afterEach, describe, expect, it, vi } from "vitest";
import { liveChatConfiguration, showLiveChatOnPath } from "@/lib/liveChat";
import { GET } from "@/app/support/chat/route";

afterEach(() => vi.unstubAllEnvs());

function configure() {
  vi.stubEnv("NEXT_PUBLIC_LIVE_CHAT_ENABLED", "true");
  vi.stubEnv("NEXT_PUBLIC_TAWK_PROPERTY_ID", "0123456789abcdef01234567");
  vi.stubEnv("NEXT_PUBLIC_TAWK_WIDGET_ID", "testwidget1");
}

describe("live chat boundaries", () => {
  it("does not load an unconfigured or disabled provider", async () => {
    vi.stubEnv("NEXT_PUBLIC_TAWK_PROPERTY_ID", undefined);
    vi.stubEnv("NEXT_PUBLIC_TAWK_WIDGET_ID", undefined);
    expect(liveChatConfiguration().scriptUrl).toBeNull();
    expect(GET().status).toBe(503);
    configure();
    vi.stubEnv("NEXT_PUBLIC_LIVE_CHAT_ENABLED", "false");
    expect(liveChatConfiguration().scriptUrl).toBeNull();
    const response = GET();
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("<script");
  });

  it.each(["https://evil.example/a", "../another/widget", '\"><script>alert(1)</script>', "widget?identity=private"])("rejects a widget identifier containing URL or HTML syntax: %s", async (widget) => {
    configure();
    vi.stubEnv("NEXT_PUBLIC_TAWK_WIDGET_ID", widget);
    expect(liveChatConfiguration().scriptUrl).toBeNull();
    expect(await GET().text()).not.toContain(widget);
  });

  it("rejects malformed property identifiers", () => {
    configure();
    vi.stubEnv("NEXT_PUBLIC_TAWK_PROPERTY_ID", "not-a-property");
    expect(liveChatConfiguration().scriptUrl).toBeNull();
  });

  it("uses a fixed provider host, fresh nonce and private frame-only response", async () => {
    configure();
    const response = GET();
    const html = await response.text();
    const policy = response.headers.get("Content-Security-Policy")!;
    const nonce = html.match(/<script nonce="([^"]+)"/)![1];
    expect(response.status).toBe(200);
    expect(html).toContain("https://embed.tawk.to/0123456789abcdef01234567/testwidget1");
    expect(html).not.toContain("Tawk_API.visitor");
    expect(html).not.toContain("setAttributes");
    expect(policy).toContain(`'nonce-${nonce}' 'strict-dynamic'`);
    expect(policy).toContain("frame-ancestors 'self'");
    expect(policy).not.toContain("'unsafe-eval'");
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(response.headers.get("X-Robots-Tag")).toContain("noindex");
    expect(response.headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
    expect((await GET().text()).match(/<script nonce="([^"]+)"/)![1]).not.toBe(nonce);
  });

  it.each(["/admin", "/admin/repairs", "/account/repairs", "/login", "/signup", "/forgot-password", "/track", "/book", "/support/chat"])("does not expose chat on %s", (path) => {
    expect(showLiveChatOnPath(path)).toBe(false);
  });

  it.each(["/", "/repairs", "/repairs/samsung", "/contact", "/quote"])("keeps chat available on the public page %s", (path) => {
    expect(showLiveChatOnPath(path)).toBe(true);
  });
});
