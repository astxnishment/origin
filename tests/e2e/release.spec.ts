import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = ["/", "/repairs", "/repairs/iphone", "/repairs/ipad", "/repairs/phones", "/repairs/laptops", "/repairs/consoles", "/repairs/custom-pc", "/repairs/data-recovery", "/repairs/liquid-damage", "/repairs/samsung", "/repairs/google-pixel", "/pricing", "/quote", "/book", "/contact", "/faq", "/about", "/privacy", "/terms", "/warranty", ...(process.env.NEXT_PUBLIC_MAIL_IN_ENABLED !== "false" ? ["/mail-in"] : [])];

test("public pages render with unique canonical URLs and loaded images", async ({ page }) => {
  test.setTimeout(180_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of pages) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://originrepairs.com${path === "/" ? "" : path}`);
    await expect(page.locator("main#main-content")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    const layout = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
    expect(layout.scrollWidth, `${path} horizontal overflow`).toBeLessThanOrEqual(layout.width + 1);
    const images = page.locator("main img");
    for (const image of await images.all()) {
      if (await image.isVisible()) {
        await image.scrollIntoViewIfNeeded();
        await expect(image).toHaveJSProperty("complete", true);
        expect(await image.evaluate((element) => (element as HTMLImageElement).naturalWidth), `${path}: ${await image.getAttribute("src")}`).toBeGreaterThan(0);
      }
    }
  }
  expect(errors).toEqual([]);
});

for (const theme of ["light", "dark"] as const) {
  test(`core forms meet automated accessibility checks in ${theme} mode`, async ({ page }) => {
    test.setTimeout(180_000);
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    for (const path of pages) {
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) })), path).toEqual([]);
    }
  });
}

test("keyboard skip link bypasses the header", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("contact keeps the message on delivery failure and supports multiline success", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Name", { exact: false }).fill("Test Customer");
  await page.getByLabel("Email", { exact: false }).fill("customer@example.com");
  await page.getByLabel("How can we help?", { exact: false }).fill("First line of the issue.\nSecond line of the issue.");
  await page.getByRole("checkbox").check();
  await page.route("**/api/contact", (route) => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "We could not deliver your message. Please try again or contact us directly." }) }));
  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.getByText("We could not deliver your message. Please try again or contact us directly.")).toBeVisible();
  await expect(page.getByLabel("How can we help?", { exact: false })).toHaveValue("First line of the issue.\nSecond line of the issue.");
  await page.unroute("**/api/contact");
  await page.route("**/api/contact", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, message: "Message received. The team has your message." }) }));
  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.getByText("Message received. The team has your message.")).toBeVisible();
});

test("preview blocks indexing and sends security headers", async ({ request }) => {
  const home = await request.get("/");
  expect(home.headers()["x-robots-tag"]).toContain("noindex");
  expect(home.headers()["content-security-policy"]).toContain("object-src 'none'");
  expect(home.headers()["x-content-type-options"]).toBe("nosniff");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /");
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).not.toContain("<loc>");
  const rejected = await request.post("/api/contact", { headers: { "sec-fetch-site": "cross-site" }, data: {} });
  expect(rejected.status()).toBe(403);
});
