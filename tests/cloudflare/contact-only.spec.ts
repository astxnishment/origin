import { expect, test as base, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { cloudflareEnvironment } from "../../scripts/cloudflare-environment.mjs";

const canonicalOrigin = "https://originrepairs.com";
const chatConfigured = cloudflareEnvironment.NEXT_PUBLIC_LIVE_CHAT_ENABLED === "true"
  && /^[a-f0-9]{24}$/i.test(cloudflareEnvironment.NEXT_PUBLIC_TAWK_PROPERTY_ID)
  && /^[a-z0-9]{1,64}$/i.test(cloudflareEnvironment.NEXT_PUBLIC_TAWK_WIDGET_ID);
const chatScriptUrl = `https://embed.tawk.to/${cloudflareEnvironment.NEXT_PUBLIC_TAWK_PROPERTY_ID}/${cloudflareEnvironment.NEXT_PUBLIC_TAWK_WIDGET_ID}`;
const privateChatPaths = /^\/(?:admin|account|login|signup|forgot-password|track|book|mail-in|support)(?:\/|$)/;
const publicPages = [
  "/", "/repairs", "/repairs/phones", "/repairs/iphone", "/repairs/samsung",
  "/repairs/google-pixel", "/repairs/ipad", "/repairs/laptops", "/repairs/consoles",
  "/repairs/custom-pc", "/repairs/data-recovery", "/repairs/liquid-damage",
  "/pricing", "/quote", "/contact", "/book", "/mail-in", "/about", "/faq",
  "/privacy", "/terms", "/warranty",
];

const test = base.extend<{ auditBrowser: void }>({
  auditBrowser: [async ({ page, baseURL }, use) => {
    const externalRequests: string[] = [];
    const browserErrors: string[] = [];
    const origin = new URL(baseURL!).origin;
    // Public pages must not start third-party integrations automatically. Chat
    // tests override only the vendor script with a local fixture; nothing in
    // this suite may contact a provider or submit a real message.
    await page.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (/^https?:$/.test(url.protocol) && url.origin !== origin) {
        externalRequests.push(`${url.origin}${url.pathname}`);
        await route.abort();
      } else {
        await route.continue();
      }
    });
    page.on("pageerror", (error) => browserErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error" && /hydrati|content.security.policy|refused to (?:load|execute|apply)/i.test(message.text())) {
        browserErrors.push(message.text());
      }
    });
    await use();
    expect(externalRequests, "Unexpected third-party browser traffic").toEqual([]);
    expect(browserErrors, "Runtime, hydration or CSP errors").toEqual([]);
  }, { auto: true }],
});

async function expectNoOverflow(page: Page) {
  const size = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(size.content).toBeLessThanOrEqual(size.viewport + 1);
}

async function expectLoadedImages(page: Page) {
  for (const image of await page.locator("main img").all()) {
    if (!(await image.isVisible())) continue;
    // Scroll naturally so lazy loading is exercised without changing the DOM.
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty("complete", true);
    expect(await image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
}

async function mockChatProvider(page: Page, fail = false) {
  const requests: Array<{ url: string; frameUrl: string }> = [];
  // Keep the real /support/chat response, nonce and bridge. Only replace the
  // vendor script, so these checks also exercise the Worker's document CSP.
  await page.route("https://embed.tawk.to/**", (route) => {
    requests.push({ url: route.request().url(), frameUrl: route.request().frame().url() });
    if (fail) return route.abort("failed");
    return route.fulfill({
      contentType: "application/javascript",
      headers: { "Access-Control-Allow-Origin": "*" },
      body: `
        (function () {
        // Model the provider's embedded mode. Without a valid target, its
        // floating desktop panel is wider than the 320px mobile viewport.
        const target = typeof window.Tawk_API.embedded === "string"
          ? document.getElementById(window.Tawk_API.embedded) : null;
        const widget = document.createElement("section");
        widget.dataset.testChatWidget = "true";
        widget.style.cssText = target
          ? "width:100%;height:100%;box-sizing:border-box;display:flex;flex-direction:column"
          : "width:380px;height:600px";
        (target || document.body).appendChild(widget);
        window.Tawk_API.getStatus = function () { return "offline"; };
        window.Tawk_API.maximize = function () {
          document.documentElement.dataset.testChatMaximized = "true";
        };
        ["online", "away", "offline"].forEach(function (status) {
          const button = document.createElement("button");
          button.textContent = "Simulate " + status;
          button.onclick = function () { window.Tawk_API.onStatusChange(status); };
          widget.appendChild(button);
        });
        window.Tawk_API.onLoad();
        })();
      `,
    });
  });
  return requests;
}

test("public pages render with canonical metadata and working images", async ({ page }) => {
  test.setTimeout(180_000);
  for (const path of publicPages) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("main#main-content")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${canonicalOrigin}${path === "/" ? "" : path}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.getByRole("button", { name: "Chat with us" })).toHaveCount(chatConfigured && !privateChatPaths.test(path) ? 1 : 0);
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
    await expectLoadedImages(page);
    await expectNoOverflow(page);
  }
});

test("approved service artwork stays in its intended placements", async ({ page }) => {
  const placements = [
    ["/", "iphone-samsung-phones.webp", "macbook-pro-current.webp", "data-recovery-v2.webp", "liquid-damage-v5.webp"],
    ["/repairs", "ipad-directory-thumbnail.webp", "macbook-pro-open.webp", "data-recovery-thumbnail.webp", "liquid-damage-v5.webp"],
    ["/repairs/data-recovery", "data-recovery-v2.webp"],
    ["/repairs/liquid-damage", "liquid-damage-v5.webp"],
  ];
  for (const [path, ...files] of placements) {
    await page.goto(path);
    for (const file of files) {
      const image = page.locator(`main img[src*="${file}"]`).first();
      await image.scrollIntoViewIfNeeded();
      await expect(image).toBeVisible();
      await expect(image).toHaveJSProperty("complete", true);
      expect(await image.evaluate((element) => (element as HTMLImageElement).naturalWidth), file).toBeGreaterThan(0);
    }
  }
});

test("local fonts and favicon assets are served and fonts actually load", async ({ page, request }) => {
  for (const [path, signature] of [
    ["/fonts/geist-latin.woff2", "774f4632"],
    ["/fonts/geist-mono-latin.woff2", "774f4632"],
    ["/favicon.ico", "00000100"],
    ["/favicon-32.png?v=20260926", "89504e47"],
    ["/apple-touch-icon.png?v=20260926", "89504e47"],
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect((await response.body()).subarray(0, 4).toString("hex"), path).toBe(signature);
  }
  const icon = await request.get("/icon.svg?v=20260926");
  expect(icon.status()).toBe(200);
  expect(icon.headers()["content-type"]).toContain("image/svg+xml");
  expect(await icon.text()).toContain("<svg");

  await page.goto("/");
  await expect(page.locator('link[rel="icon"][href*="favicon-32.png"]').first()).toHaveAttribute("href", /favicon-32\.png/);
  await expect(page.locator('link[rel="icon"][href*="icon.svg"]').first()).toHaveAttribute("href", /icon\.svg/);
  const fonts = await page.evaluate(async () => {
    await document.fonts.ready;
    const styles = getComputedStyle(document.documentElement);
    const sans = styles.getPropertyValue("--font-geist-sans").trim();
    const mono = styles.getPropertyValue("--font-geist-mono").trim();
    const counts = await Promise.all([sans, mono].map(async (family) => family ? (await document.fonts.load(`16px ${family}`)).length : 0));
    return { sans, mono, counts };
  });
  expect(fonts.sans).not.toBe("");
  expect(fonts.mono).not.toBe("");
  for (const count of fonts.counts) {
    expect(count, "Both local font families must load, not silently fall back").toBeGreaterThan(0);
  }
});

test("theme and menu hydrate, navigate and preserve the selected theme", async ({ page, viewport, colorScheme }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", colorScheme!);
  const mobile = viewport!.width < 1280;
  if (mobile) await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: /Switch to (light|dark) mode/ }).click();
  const nextTheme = colorScheme === "light" ? "dark" : "light";
  await expect(page.locator("html")).toHaveAttribute("data-theme", nextTheme);
  if (mobile) {
    const navigation = page.getByRole("dialog", { name: "Site navigation" });
    await expect(navigation).toBeVisible();
    await navigation.getByRole("link", { name: "Repairs", exact: true }).click();
    await expect(navigation).toHaveCount(0);
  } else {
    await page.locator("header").getByRole("link", { name: "Repairs", exact: true }).click();
  }
  await expect(page).toHaveURL(/\/repairs$/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", nextTheme);
  await expectNoOverflow(page);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", nextTheme);
});

test("quote search and repair choices work and lead to direct contact", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Start with your device" })).toBeVisible();
  await expect(page.getByText("Estimated price", { exact: true })).toHaveCount(0);
  await page.goto("/quote");
  await page.getByRole("button", { name: /^Phone/ }).click();
  await page.getByRole("button", { name: /^iPhone/ }).click();
  const search = page.getByRole("searchbox", { name: "Search models" });
  await search.fill("no such model");
  await expect(page.getByText("No matching models. Try a shorter name or model number.")).toBeVisible();
  await search.fill("18 pro");
  await page.getByRole("button", { name: "iPhone 18 Pro", exact: true }).click();
  await page.getByRole("button", { name: "Screen replacement", exact: true }).click();
  await expect(page.getByText("Quote required", { exact: true }).first()).toBeVisible();
  await expect(page.locator('main a[href^="/book"]')).toHaveCount(0);
  await page.getByRole("link", { name: "Request a manual quote", exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("link", { name: "Message on WhatsApp" })).toBeVisible();
});

test("device quote links retain their prefilled selections", async ({ page }) => {
  for (const [device, model] of [
    ["ipad", "iPad Pro 11-inch M5"],
    ["macbook", "MacBook Neo A18 Pro"],
    ["galaxy-tab", "Galaxy Tab S11"],
    ["galaxy-book", "Galaxy Book6 Pro"],
  ]) {
    await page.goto("/repairs");
    await page.locator(`a[href="/quote?device=${device}"]`).click();
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
    await expect(page.getByRole("button", { name: model, exact: true })).toBeVisible();
  }
});

test("legacy repair links preserve the selection and disabled accounts redirect safely", async ({ page }) => {
  await page.goto("/repairs/iphone-15-battery-replacement-leeds?tier=compatible-battery");
  await expect(page).toHaveURL(/\/book\?.*model=iphone-15.*repair=battery-replacement.*tier=compatible-battery/);
  await expect(page.getByRole("link", { name: "Message on WhatsApp" })).toBeVisible();
  await expect(page.locator("main form")).toHaveCount(0);
  for (const route of ["/login", "/signup", "/forgot-password"]) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole("heading", { name: "Get in touch.", exact: true })).toBeVisible();
  }
  for (const route of ["/account", "/account/repairs"]) {
    await page.goto(route);
    await expect.poll(() => new URL(page.url()).pathname).toBe("/");
    await expect(page.getByRole("heading", { name: "Start with your device" })).toBeVisible();
  }
});

test("contact-only routes expose direct contact without online forms", async ({ page }) => {
  for (const path of ["/contact", "/book", "/mail-in", "/track"]) {
    await page.goto(path);
    await expect(page.locator("main form")).toHaveCount(0);
    await expect(page.locator('main a[href="tel:+447768426754"]').first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Message on WhatsApp" })).toHaveAttribute("href", "https://wa.me/447768426754");
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
    await expect(page.locator("iframe")).toHaveCount(0);
  }
});

test.describe("explicitly enabled chat in the contact-only release", () => {
  test.skip(!chatConfigured, "The shared Cloudflare release profile has not enabled valid chat settings.");

  test("chat opts in, boots inside its own document and closes accessibly", async ({ page, viewport }) => {
    const requests = await mockChatProvider(page);
    await page.goto("/repairs");
    const launcher = page.getByRole("button", { name: "Chat with us", exact: true });
    const dialog = page.getByRole("dialog", { name: "Talk to Origin Repairs", exact: true });
    const frame = page.getByTitle("Origin Repairs live chat", { exact: true });
    await expect(launcher).toBeVisible();
    if (viewport!.width < 768) {
      const actions = page.getByRole("navigation", { name: "Quick repair actions" });
      await expect(actions).toBeVisible();
      const launcherBox = await launcher.boundingBox();
      const actionsBox = await actions.boundingBox();
      expect(launcherBox!.y + launcherBox!.height).toBeLessThanOrEqual(actionsBox!.y);
      await actions.getByRole("link", { name: "Get Quote", exact: true }).click({ trial: true });
    }
    await launcher.click();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Start chat", exact: true })).toBeVisible();
    await expect(dialog.locator('a[href^="mailto:"]')).toHaveCount(0);
    await expect(dialog.getByRole("link", { name: "Contact options", exact: true })).toHaveAttribute("href", "/contact");
    await expect(frame).toHaveCount(0);
    const box = await dialog.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width + 1);
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height + 1);
    const accessibility = await new AxeBuilder({ page }).include('[role="dialog"]').analyze();
    expect(accessibility.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) }))).toEqual([]);
    expect(requests, "Opening the consent dialog must not load Tawk").toEqual([]);

    const responsePromise = page.waitForResponse((response) => new URL(response.url()).pathname === "/support/chat");
    await dialog.getByRole("button", { name: "Start chat", exact: true }).click();
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    await expect(frame).toBeVisible();
    await expect(dialog.getByRole("status")).toHaveText("The team is offline. Leave a message for a reply.");
    const chatDocument = page.frameLocator('iframe[title="Origin Repairs live chat"]');
    await expect(chatDocument.locator("html")).toHaveAttribute("data-test-chat-maximized", "true");
    await expect(chatDocument.locator("#loading")).toBeHidden();
    const embeddedWidget = chatDocument.locator('[data-test-chat-widget="true"]');
    await expect(embeddedWidget).toBeVisible();
    const widgetSize = await embeddedWidget.evaluate((widget) => {
      const bounds = widget.getBoundingClientRect();
      return {
        parentId: widget.parentElement?.id,
        x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height,
        viewportWidth: window.innerWidth, viewportHeight: window.innerHeight,
        contentWidth: document.documentElement.scrollWidth,
        contentHeight: document.documentElement.scrollHeight,
      };
    });
    expect(widgetSize.parentId, "The provider must mount into the declared embedded container").toBe("origin-tawk-container");
    expect(widgetSize.width).toBeGreaterThan(0);
    expect(widgetSize.height).toBeGreaterThan(0);
    expect(widgetSize.x).toBeCloseTo(0, 0);
    expect(widgetSize.y).toBeCloseTo(0, 0);
    expect(widgetSize.width).toBeCloseTo(widgetSize.viewportWidth, 0);
    expect(widgetSize.height).toBeCloseTo(widgetSize.viewportHeight, 0);
    expect(widgetSize.contentWidth).toBeLessThanOrEqual(widgetSize.viewportWidth + 1);
    expect(widgetSize.contentHeight).toBeLessThanOrEqual(widgetSize.viewportHeight + 1);
    const nonce = await chatDocument.locator("script[nonce]").evaluate((script) => (script as HTMLScriptElement).nonce);
    expect(nonce).not.toBe("");
    expect(response.headers()["content-security-policy"]).toContain(`'nonce-${nonce}'`);
    expect(response.headers()["content-security-policy"]).toContain("'strict-dynamic'");
    expect(requests).toHaveLength(1);
    expect(requests[0].url).toBe(chatScriptUrl);
    expect(new URL(requests[0].frameUrl).pathname).toBe("/support/chat");
    await expect(page.locator('script[src*="tawk.to"]')).toHaveCount(0);
    for (const status of ["online", "away", "offline"]) {
      await chatDocument.getByRole("button", { name: `Simulate ${status}`, exact: true }).click();
      await expect(dialog.getByRole("status")).toContainText(`The team is ${status}.`);
    }

    // Escape is handled by the first-party dialog, not the vendor document.
    await dialog.getByRole("button", { name: "Close chat", exact: true }).focus();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(frame).toHaveCount(0);
    await expect(launcher).toBeFocused();
    await launcher.click();
    await expect(dialog.getByRole("button", { name: "Start chat", exact: true })).toBeVisible();
    await expect(frame).toHaveCount(0);
    expect(requests).toHaveLength(1);
    await dialog.getByRole("button", { name: "Start chat", exact: true }).click();
    await expect(dialog.getByRole("status")).toContainText("The team is offline.");
    await dialog.getByRole("button", { name: "Close chat", exact: true }).click();
    await expect(frame).toHaveCount(0);
    await expect(launcher).toBeFocused();
    expect(requests).toHaveLength(2);
  });

  test("provider failure removes the iframe and offers working contact options", async ({ page }) => {
    const requests = await mockChatProvider(page, true);
    await page.goto("/");
    await page.getByRole("button", { name: "Chat with us", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Talk to Origin Repairs", exact: true });
    expect(requests).toEqual([]);
    await dialog.getByRole("button", { name: "Start chat", exact: true }).click();
    await expect(dialog.getByText("We couldn’t connect to chat. Try again, or contact the team below.")).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Try chat again", exact: true })).toBeVisible();
    await expect(page.getByTitle("Origin Repairs live chat", { exact: true })).toHaveCount(0);
    await expect(dialog.locator('a[href="tel:+447768426754"]')).toBeVisible();
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
    expect(requests).toHaveLength(1);
    expect(requests[0].url).toBe(chatScriptUrl);
    await dialog.getByRole("link", { name: "Contact options", exact: true }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Message on WhatsApp", exact: true })).toBeVisible();
    await expect(page.locator("main form")).toHaveCount(0);
  });

  test("navigation tears down chat and private service routes never launch it", async ({ page }) => {
    const requests = await mockChatProvider(page);
    await page.goto("/contact");
    await page.getByRole("banner").getByRole("link", { name: "Origin Repairs — home", exact: true }).click();
    await expect(page).toHaveURL(/\/$/);
    await page.getByRole("button", { name: "Chat with us", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Talk to Origin Repairs", exact: true });
    await dialog.getByRole("button", { name: "Start chat", exact: true }).click();
    await expect(dialog.getByRole("status")).toContainText("The team is offline.");
    await page.goBack();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(dialog).toHaveCount(0);
    await expect(page.locator("iframe")).toHaveCount(0);
    await page.getByRole("button", { name: "Chat with us", exact: true }).click();
    await expect(dialog.getByRole("button", { name: "Start chat", exact: true })).toBeVisible();
    await expect(page.locator("iframe")).toHaveCount(0);
    expect(requests).toHaveLength(1);
    await dialog.getByRole("button", { name: "Close chat", exact: true }).click();
    for (const path of ["/book", "/mail-in", "/track", "/admin", "/admin/repairs", "/support"]) {
      await page.goto(path);
      await expect.poll(() => new URL(page.url()).pathname).toBe(path);
      await expect(page.getByRole("button", { name: "Chat with us", exact: true })).toHaveCount(0);
      await expect(page.locator("iframe")).toHaveCount(0);
      await expect(page.locator('script[src*="tawk.to"]')).toHaveCount(0);
    }
    expect(requests, "Private routes must not initialize another provider instance").toHaveLength(1);
  });
});

test("disabled APIs reject empty probes without accepting messages or repair changes", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-dark", "One set of empty local API probes is sufficient.");
  for (const [method, path] of [
    ["POST", "/api/contact"], ["POST", "/api/booking"],
    ["POST", "/api/auth/magic-link"], ["POST", "/api/admin/repairs"],
    ["PATCH", "/api/admin/repairs/OR-00000000-000000000000"],
  ]) {
    const response = await request.fetch(path, { method, data: {} });
    expect(response.status(), path).toBe(503);
    const body = await response.json();
    expect(body.error, path).toEqual(expect.any(String));
    expect(body.ok, path).not.toBe(true);
  }
  const chat = await request.get("/support/chat");
  expect(chat.status()).toBe(chatConfigured ? 200 : 503);
  if (chatConfigured) {
    expect(await chat.text()).toContain(chatScriptUrl);
    expect(chat.headers()["content-security-policy"]).toContain("'strict-dynamic'");
    expect(chat.headers()["cache-control"]).toBe("private, no-store");
  } else {
    expect(await chat.text()).not.toContain("<script");
  }
  const login = await request.get("/api/auth/verify", { maxRedirects: 0 });
  expect(login.status()).toBe(307);
  expect(login.headers().location).toContain("/login?error=unavailable");
  expect(login.headers()["set-cookie"]).toBeUndefined();
});

test("security headers, non-indexing and real 404 responses survive the migration", async ({ page, request }) => {
  const home = await request.get("/");
  expect(home.headers()["content-security-policy"]).toContain("'strict-dynamic'");
  expect(home.headers()["x-content-type-options"]).toBe("nosniff");
  expect(home.headers()["x-frame-options"]).toBe("SAMEORIGIN");
  expect(home.headers()["x-robots-tag"]).toContain("noindex");
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Disallow: /");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).not.toContain("<loc>");
  const missing = await page.goto("/this-route-does-not-exist");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "This page could not be found." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to homepage" })).toBeVisible();
});

test("key public journeys remain keyboard accessible and pass automated accessibility checks", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  for (const path of ["/", "/repairs", "/quote", "/contact"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) })), path).toEqual([]);
  }
});
