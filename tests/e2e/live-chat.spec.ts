import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

// The configured suite uses local iframe fixtures. Never connect to Tawk or
// send a message to a real support agent, including when real IDs are present.
const chatConfigured = process.env.NEXT_PUBLIC_LIVE_CHAT_ENABLED !== "false"
  && /^[a-f\d]{24}$/i.test(process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID?.trim() ?? "")
  && /^[a-z\d]{1,64}$/i.test(process.env.NEXT_PUBLIC_TAWK_WIDGET_ID?.trim() ?? "");

const launcherName = "Chat with us";
const dialogName = "Talk to Origin Repairs";
const frameTitle = "Origin Repairs live chat";

test.beforeEach(() => {
  test.skip(process.env.NEXT_PUBLIC_LIVE_CHAT_ENABLED === "false", "Chat is explicitly disabled for this build.");
});

async function blockExternalRequests(page: Page, baseURL: string | undefined) {
  const origin = new URL(baseURL ?? "http://127.0.0.1:3108").origin;
  const attempted: string[] = [];
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (/^https?:$/.test(url.protocol) && url.origin !== origin) {
      attempted.push(url.href);
      return route.abort("blockedbyclient");
    }
    return route.fallback();
  });
  return attempted;
}

async function openChat(page: Page) {
  await page.getByRole("button", { name: launcherName, exact: true }).click();
  const dialog = page.getByRole("dialog", { name: dialogName });
  await expect(dialog).toBeVisible();
  return dialog;
}

async function mockChatFrame(page: Page) {
  let loads = 0;
  await page.route("**/support/chat", (route) => {
    loads += 1;
    return route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><html lang="en"><head><title>Local chat fixture</title></head>
        <body>
          <button type="button" data-status="online">Simulate online</button>
          <button type="button" data-status="away">Simulate away</button>
          <button type="button" data-status="offline">Simulate offline</button>
          <button type="button" data-error="true">Simulate failure</button>
          <script>
            document.addEventListener("click", (event) => {
              const button = event.target.closest("button");
              if (!button) return;
              parent.postMessage(button.dataset.error
                ? { type: "origin-chat", event: "error" }
                : { type: "origin-chat", event: "ready", status: button.dataset.status },
                location.origin);
            });
          </script>
        </body></html>`,
    });
  });
  return () => loads;
}

test("unconfigured chat offers contact options without loading a third party", async ({ page, baseURL }) => {
  test.skip(chatConfigured, "This case covers a build without live chat credentials.");
  const externalRequests = await blockExternalRequests(page, baseURL);
  await page.goto("/");
  const dialog = await openChat(page);

  await expect(dialog.getByText("Live chat is unavailable right now.", { exact: false })).toBeVisible();
  await expect(dialog.locator('a[href^="tel:"]')).toBeVisible();
  await expect(dialog.locator('a[href^="mailto:"]')).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Send a message", exact: true })).toHaveAttribute("href", "/contact");
  await expect(dialog.getByRole("button", { name: "Start chat", exact: true })).toHaveCount(0);
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.locator('script[src*="tawk"]')).toHaveCount(0);
  expect(externalRequests).toEqual([]);
});

test("keyboard users can open and dismiss chat with focus restored", async ({ page, baseURL }) => {
  const externalRequests = await blockExternalRequests(page, baseURL);
  await page.goto("/");
  const launcher = page.getByRole("button", { name: launcherName, exact: true });
  await launcher.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: dialogName });
  await expect(dialog).toBeVisible();
  await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(launcher).toBeFocused();
  await expect(page.getByTitle(frameTitle, { exact: true })).toHaveCount(0);
  expect(externalRequests).toEqual([]);
});

test("private and repair-request routes do not expose the chat launcher", async ({ page, baseURL }) => {
  const externalRequests = await blockExternalRequests(page, baseURL);
  const accountsEnabled = process.env.NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED !== "false";
  const trackingEnabled = process.env.NEXT_PUBLIC_TRACKING_ENABLED !== "false";
  const authPaths = accountsEnabled ? ["/account", "/login", "/signup", "/forgot-password"] : [];
  // Disabled account routes redirect to the public homepage, where the chat
  // launcher is expected. Exercise the private routes present in this build.
  const trackingPaths = accountsEnabled || !trackingEnabled ? ["/track"] : [];
  for (const path of ["/admin", ...authPaths, ...trackingPaths, "/book", "/support"]) {
    await page.goto(path);
    if (authPaths.includes(path) || (path === "/track" && trackingEnabled)) {
      // /account can stream two redirects before the login form is rendered.
      // Wait for its actual destination before starting the next navigation.
      await expect(page).toHaveURL(/\/login(?:\?|$)/);
      await expect(page.getByLabel("Email address", { exact: true })).toBeVisible();
    } else {
      await expect(page.locator("body")).toBeVisible();
    }
    await expect(page.getByRole("button", { name: launcherName, exact: true }), path).toHaveCount(0);
    await expect(page.getByTitle(frameTitle, { exact: true }), path).toHaveCount(0);
  }
  expect(externalRequests.filter((url) => /tawk/i.test(url))).toEqual([]);
});

for (const theme of ["light", "dark"] as const) {
  test(`the first-party chat dialog meets accessibility checks in ${theme} mode`, async ({ page, baseURL }, testInfo) => {
    const externalRequests = await blockExternalRequests(page, baseURL);
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await openChat(page);
    await expect(page.getByTitle(frameTitle, { exact: true })).toHaveCount(0);

    if (testInfo.project.name === "desktop" || page.viewportSize()?.width === 390) {
      const directory = "/tmp/origin-chat-review";
      await mkdir(directory, { recursive: true });
      const filename = `${chatConfigured ? "configured" : "default"}-${testInfo.project.name}-${theme}.png`;
      await page.screenshot({ path: `${directory}/${filename}` });
    }

    const results = await new AxeBuilder({ page }).include('[role="dialog"]').analyze();
    expect(results.violations.map(({ id, nodes }) => ({
      id,
      nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
    }))).toEqual([]);
    expect(externalRequests).toEqual([]);
  });
}

test("mobile chat leaves the fixed repair actions accessible", async ({ page, baseURL }) => {
  test.skip((page.viewportSize()?.width ?? 1440) >= 768, "Checks the mobile repair action bar.");
  const externalRequests = await blockExternalRequests(page, baseURL);
  await page.goto("/repairs");
  const launcher = page.getByRole("button", { name: launcherName, exact: true });
  const actions = page.getByRole("navigation", { name: "Quick repair actions" });
  await expect(launcher).toBeVisible();
  await expect(actions).toBeVisible();
  const launcherBox = await launcher.boundingBox();
  const actionsBox = await actions.boundingBox();
  expect(launcherBox).not.toBeNull();
  expect(actionsBox).not.toBeNull();
  expect(launcherBox!.y + launcherBox!.height).toBeLessThanOrEqual(actionsBox!.y);
  // A trial click checks visibility, pointer interception and reachability,
  // without navigating away or submitting anything.
  await actions.getByRole("link", { name: "Get Quote", exact: true }).click({ trial: true });

  const dialog = await openChat(page);
  const dialogBox = await dialog.boundingBox();
  const viewport = page.viewportSize()!;
  expect(dialogBox).not.toBeNull();
  expect(dialogBox!.x).toBeGreaterThanOrEqual(0);
  expect(dialogBox!.y).toBeGreaterThanOrEqual(0);
  expect(dialogBox!.x + dialogBox!.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(dialogBox!.y + dialogBox!.height).toBeLessThanOrEqual(viewport.height + 1);
  expect(externalRequests).toEqual([]);
});

test.describe("configured live chat with a local provider fixture", () => {
  test.skip(!chatConfigured, "Requires an enabled build with valid-looking public test Tawk IDs.");

  test("the real isolated document boots its provider script under its own CSP", async ({ page, baseURL }) => {
    const externalRequests = await blockExternalRequests(page, baseURL);
    const embedRequests: Array<{ url: string; frameUrl: string }> = [];
    await page.route("https://embed.tawk.to/**", (route) => {
      embedRequests.push({ url: route.request().url(), frameUrl: route.request().frame().url() });
      return route.fulfill({
        contentType: "application/javascript",
        headers: { "Access-Control-Allow-Origin": "*" },
        body: `
          window.Tawk_API.getStatus = function () { return "offline"; };
          window.Tawk_API.maximize = function () {
            document.documentElement.dataset.testChatMaximized = "true";
          };
          window.Tawk_API.onLoad();
        `,
      });
    });
    await page.goto("/");
    const dialog = await openChat(page);
    expect(embedRequests).toEqual([]);
    await expect(page.getByTitle(frameTitle, { exact: true })).toHaveCount(0);

    const documentResponse = page.waitForResponse((response) => new URL(response.url()).pathname === "/support/chat");
    await dialog.getByRole("button", { name: "Start chat", exact: true }).click();
    const response = await documentResponse;
    expect(response.status()).toBe(200);
    await expect(dialog.getByRole("status")).toContainText("The team is offline.");
    const chatFrame = page.frameLocator(`iframe[title="${frameTitle}"]`);
    await expect(chatFrame.locator("html")).toHaveAttribute("data-test-chat-maximized", "true");
    await expect(chatFrame.locator("#loading")).toBeHidden();
    const nonce = await chatFrame.locator("script[nonce]").evaluate((element) => (element as HTMLScriptElement).nonce);
    expect(nonce).not.toBe("");
    expect(response.headers()["content-security-policy"]).toContain(`'nonce-${nonce}'`);
    expect(response.headers()["content-security-policy"]).toContain("'strict-dynamic'");
    expect(embedRequests).toHaveLength(1);
    expect(new URL(embedRequests[0].frameUrl).pathname).toBe("/support/chat");
    await expect(page.locator('script[src*="tawk"]')).toHaveCount(0);
    expect(externalRequests).toEqual([]);
  });

  test("a blocked provider script triggers the real document's failure bridge", async ({ page, baseURL }) => {
    const externalRequests = await blockExternalRequests(page, baseURL);
    const embedRequests: string[] = [];
    await page.route("https://embed.tawk.to/**", (route) => {
      embedRequests.push(route.request().url());
      return route.abort("blockedbyclient");
    });
    await page.goto("/");
    const dialog = await openChat(page);
    expect(embedRequests).toEqual([]);
    await dialog.getByRole("button", { name: "Start chat", exact: true }).click();

    await expect(dialog.getByText("We couldn’t connect to chat.", { exact: false })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Try chat again", exact: true })).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Send a message", exact: true })).toHaveAttribute("href", "/contact");
    await expect(dialog.locator('a[href^="tel:"]')).toBeVisible();
    await expect(page.getByTitle(frameTitle, { exact: true })).toHaveCount(0);
    await expect(page.locator('script[src*="tawk"]')).toHaveCount(0);
    expect(embedRequests).toHaveLength(1);
    expect(externalRequests).toEqual([]);
  });

  test("loads only after Start chat and removes the iframe on dismissal", async ({ page, baseURL }) => {
    const externalRequests = await blockExternalRequests(page, baseURL);
    const frameLoads = await mockChatFrame(page);
    await page.goto("/");
    const dialog = await openChat(page);
    await expect(dialog.getByRole("button", { name: "Start chat", exact: true })).toBeVisible();
    await expect(page.getByTitle(frameTitle, { exact: true })).toHaveCount(0);
    expect(frameLoads()).toBe(0);

    await dialog.getByRole("button", { name: "Start chat", exact: true }).click();
    const frame = page.getByTitle(frameTitle, { exact: true });
    await expect(frame).toHaveAttribute("src", "/support/chat");
    await expect.poll(frameLoads).toBe(1);
    await expect(page.locator('script[src*="tawk"]')).toHaveCount(0);
    await page.frameLocator(`iframe[title="${frameTitle}"]`).getByRole("button", { name: "Simulate online", exact: true }).click();
    await expect(dialog.getByRole("status")).toContainText(/online/i);

    // Browser key events inside a provider iframe cannot bubble to Radix.
    // The close control remains in the parent document and keyboard reachable.
    await dialog.getByRole("button", { name: "Close chat", exact: true }).focus();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(frame).toHaveCount(0);
    await expect(page.getByRole("button", { name: launcherName, exact: true })).toBeFocused();
    await openChat(page);
    await expect(frame).toHaveCount(0);
    await expect(dialog.getByRole("button", { name: "Start chat", exact: true })).toBeVisible();
    expect(frameLoads()).toBe(1);
    await dialog.getByRole("button", { name: "Start chat", exact: true }).click();
    await expect.poll(frameLoads).toBe(2);
    await dialog.getByRole("button", { name: "Close chat", exact: true }).click();
    await expect(frame).toHaveCount(0);
    await expect(page.getByRole("button", { name: launcherName, exact: true })).toBeFocused();
    expect(externalRequests).toEqual([]);
  });

  test("shows away and offline provider status without claiming the team is online", async ({ page, baseURL }) => {
    const externalRequests = await blockExternalRequests(page, baseURL);
    await mockChatFrame(page);
    await page.goto("/");
    const dialog = await openChat(page);
    await dialog.getByRole("button", { name: "Start chat", exact: true }).click();
    const frame = page.frameLocator(`iframe[title="${frameTitle}"]`);
    await frame.getByRole("button", { name: "Simulate away", exact: true }).click();
    await expect(dialog.getByRole("status")).toContainText(/away/i);
    await expect(dialog.getByRole("status")).not.toContainText(/online/i);
    await frame.getByRole("button", { name: "Simulate offline", exact: true }).click();
    await expect(dialog.getByRole("status")).toContainText(/offline/i);
    await expect(dialog.getByRole("status")).not.toContainText(/online/i);
    expect(externalRequests).toEqual([]);
  });

  test("ignores status messages not sent by the mounted chat iframe", async ({ page, baseURL }) => {
    const externalRequests = await blockExternalRequests(page, baseURL);
    await mockChatFrame(page);
    await page.goto("/");
    const dialog = await openChat(page);
    await dialog.getByRole("button", { name: "Start chat", exact: true }).click();
    await expect(page.getByTitle(frameTitle, { exact: true })).toBeVisible();
    await page.evaluate(async () => {
      window.postMessage({ type: "origin-chat", event: "ready", status: "online" }, window.location.origin);
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    });
    await expect(dialog.getByRole("status")).not.toContainText(/online/i);
    await page.frameLocator(`iframe[title="${frameTitle}"]`).getByRole("button", { name: "Simulate offline", exact: true }).click();
    await expect(dialog.getByRole("status")).toContainText(/offline/i);
    expect(externalRequests).toEqual([]);
  });

  test("provider failure returns to useful contact options", async ({ page, baseURL }) => {
    const externalRequests = await blockExternalRequests(page, baseURL);
    await mockChatFrame(page);
    await page.goto("/");
    const dialog = await openChat(page);
    await dialog.getByRole("button", { name: "Start chat", exact: true }).click();
    await page.frameLocator(`iframe[title="${frameTitle}"]`).getByRole("button", { name: "Simulate failure", exact: true }).click();
    await expect(dialog.getByText("We couldn’t connect to chat.", { exact: false })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Try chat again", exact: true })).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Send a message", exact: true })).toHaveAttribute("href", "/contact");
    await expect(dialog.locator('a[href^="tel:"]')).toBeVisible();
    await expect(page.getByTitle(frameTitle, { exact: true })).toHaveCount(0);
    expect(externalRequests).toEqual([]);
  });

  test("browser navigation closes and resets the chat session", async ({ page, baseURL }) => {
    const externalRequests = await blockExternalRequests(page, baseURL);
    const frameLoads = await mockChatFrame(page);
    await page.goto("/contact");
    await page.getByRole("banner").getByRole("link", { name: "Origin Repairs — home", exact: true }).click();
    await expect(page).toHaveURL(/\/$/);
    const dialog = await openChat(page);
    await dialog.getByRole("button", { name: "Start chat", exact: true }).click();
    await expect.poll(frameLoads).toBe(1);
    await page.goBack();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(dialog).toHaveCount(0);
    await expect(page.getByTitle(frameTitle, { exact: true })).toHaveCount(0);
    await openChat(page);
    await expect(dialog.getByRole("button", { name: "Start chat", exact: true })).toBeVisible();
    expect(frameLoads()).toBe(1);
    expect(externalRequests.filter((url) => /tawk/i.test(url))).toEqual([]);
  });
});
