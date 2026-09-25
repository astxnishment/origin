import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage starts with an empty catalogue estimator", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Start with your device" })
  ).toBeVisible();
  await expect(page.getByText("Estimated price")).toHaveCount(0);
  await expect(page.getByText(/James T\.|Sophie H\.|Marcus R\./)).toHaveCount(0);
});

test("legacy iPhone repair links go to booking with the selection preserved", async ({ page }) => {
  await page.goto("/repairs/iphone-15-battery-replacement-leeds?tier=compatible-battery");
  await expect(page).toHaveURL(/\/book\?.*model=iphone-15.*repair=battery-replacement.*tier=compatible-battery/);
  await expect(page.getByRole("combobox", { name: "MODEL", exact: false })).toContainText("iPhone 15");
});

test("one iPhone page lets customers choose the latest model", async ({ page }) => {
  await page.goto("/repairs/iphone");
  await page.getByLabel("iPhone model", { exact: true }).selectOption("iphone-18-pro-max");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page).toHaveURL(/\/book\?brand=apple&model=iphone-18-pro-max/);
});

test("quote journey reaches a catalogue model without a fabricated result", async ({
  page,
}) => {
  await page.goto("/quote");
  await page.getByRole("button", { name: /^Phone/ }).click();
  await page.getByRole("button", { name: /^iPhone/ }).click();
  await expect(page.getByText("Choose or enter the model")).toBeVisible();
  await page.getByRole("searchbox", { name: "Search models" }).fill("18 max");
  await expect(page.getByRole("button", { name: "iPhone 18 Pro Max", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "iPhone 8", exact: true })).toHaveCount(0);
  await page.getByRole("searchbox", { name: "Search models" }).fill("no such model");
  await expect(page.getByText("No matching models. Try a shorter name or model number.")).toBeVisible();
  await page.getByRole("searchbox", { name: "Search models" }).fill("18 pro");
  await page.getByRole("button", { name: "iPhone 18 Pro", exact: true }).click();
  await page.getByRole("button", { name: "Screen replacement", exact: true }).click();
  await expect(page.getByText("Quote required", { exact: true }).first()).toBeVisible();
});

test("data recovery and liquid damage have separate customer journeys", async ({
  page,
}) => {
  await page.goto("/repairs");
  await expect(
    page.getByRole("heading", { name: "Data Recovery" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Liquid Damage Repair" })
  ).toBeVisible();

  await page.goto("/repairs/data-recovery");
  await expect(
    page.getByRole("heading", { name: "Recover what matters." })
  ).toBeVisible();

  await page.goto("/repairs/liquid-damage");
  await expect(
    page.getByRole("heading", { name: "Power it down. Bring it in." })
  ).toBeVisible();
});

test("iPhone pricing goes directly to booking and preserves the selected tier", async ({
  page,
}) => {
  await page.goto("/pricing");
  await page.getByRole("button", { name: "Phone" }).click();
  await page.getByRole("searchbox", { name: "Search price table" }).fill("iPhone 15");
  const repairLink = page
    .locator('a[href^="/book?"][href*="tier="]:visible')
    .first();
  await expect(repairLink).toBeVisible();
  const href = await repairLink.getAttribute("href");
  await repairLink.click();
  await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"));
  await expect(page.getByRole("combobox", { name: "MODEL", exact: false })).toContainText("iPhone 15");
});

test("booking uses focused stages and back navigation keeps selections", async ({
  page,
}) => {
  await page.goto("/book");
  await expect(page.getByText("1. Repair")).toBeVisible();
  await expect(page.getByLabel("Full name")).toHaveCount(0);

  await page.getByLabel("Device type").click();
  await page.getByRole("option", { name: "Game console" }).click();
  await page.getByLabel("Make & model").fill("PlayStation 5");
  await page.getByLabel("Repair / issue").click();
  await page.getByRole("option", { name: "HDMI port repair" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(
    page.getByRole("heading", { name: /Service method/ })
  ).toBeVisible();
  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.getByLabel("Make & model")).toHaveValue("PlayStation 5");
});

test("contact validation is accessible and does not claim success", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await expect(page.getByText("Message received")).toHaveCount(0);
});

test("404 has recovery links", async ({ page }) => {
  await page.goto("/this-route-does-not-exist");
  await expect(
    page.getByRole("heading", { name: "This page could not be found." })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Back to homepage" })
  ).toBeVisible();
});

test("theme toggle changes the document theme", async ({ page, viewport }) => {
  await page.goto("/");
  const initial = await page.locator("html").getAttribute("data-theme");
  if (viewport && viewport.width < 1280) {
    await page.getByRole("button", { name: "Menu" }).click();
  }
  await page
    .getByRole("button", { name: /Switch to (light|dark) mode/ })
    .click();
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-theme",
    initial ?? ""
  );
});

test("major pages have no automatically detectable accessibility violations", async ({
  page,
}) => {
  for (const path of [
    "/",
    "/repairs",
    "/repairs/data-recovery",
    "/repairs/liquid-damage",
    "/pricing",
    "/quote",
    "/contact",
  ]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .analyze();
    expect(results.violations, path).toEqual([]);
  }
});

test("navigation respects the configured launch services", async ({
  page,
  viewport,
}) => {
  await page.goto("/");
  if (viewport && viewport.width < 1280) {
    await page.getByRole("button", { name: "Menu" }).click();
  }
  const account = page.getByRole("link", { name: /Customer account/i }).first();
  if (process.env.NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED === "false") {
    await expect(account).toHaveCount(0);
  } else {
    await expect(account).toBeVisible();
  }
  if (process.env.NEXT_PUBLIC_MAIL_IN_ENABLED === "false") {
    await expect(page.getByRole("link", { name: /Mail-in/i })).toHaveCount(0);
  }
  if (process.env.NEXT_PUBLIC_TRACKING_ENABLED === "false") {
    await expect(page.getByRole("link", { name: /Track a Repair/i })).toHaveCount(0);
  }
});

test("customer account login uses secure email-link access", async ({ page }) => {
  test.skip(process.env.NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED === "false", "Accounts disabled for this build");
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "Sign in to your account" })
  ).toBeVisible();
  await expect(page.getByLabel("Email address")).toHaveAttribute(
    "type",
    "email"
  );
  await expect(page.getByLabel(/password/i)).toHaveCount(0);
});

test("mobile fixed bar does not cover the final page content", async ({
  page,
  viewport,
}) => {
  test.skip(!viewport || viewport.width > 430, "Mobile viewport only");
  await page.goto("/repairs");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const bar = page.getByRole("navigation", {
    name: "Quick repair actions",
  });
  await expect(bar).toBeVisible();
  const bodyPadding = await page.locator("body").evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).paddingBottom)
  );
  const barHeight = await bar.evaluate((element) =>
    element.getBoundingClientRect().height
  );
  expect(bodyPadding).toBeGreaterThanOrEqual(Math.min(barHeight, 60));

  for (const path of ["/", "/quote", "/book", "/contact", "/privacy"]) {
    await page.goto(path);
    await expect(
      page.getByRole("navigation", { name: "Quick repair actions" })
    ).toHaveCount(0);
  }
});

test("mobile pages fit the viewport and forms avoid focus zoom", async ({
  page,
  viewport,
}) => {
  test.skip(!viewport || viewport.width > 430, "Mobile viewport only");
  const viewportHeight = viewport?.height ?? 844;

  for (const path of [
    "/",
    "/repairs",
    "/pricing",
    "/quote",
    "/book",
    "/contact",
    "/repairs/phones",
    "/repairs/laptops",
    "/repairs/consoles",
    "/repairs/data-recovery",
    "/repairs/liquid-damage",
  ]) {
    await page.goto(path);
    const layout = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(layout.scrollWidth, path).toBeLessThanOrEqual(
      layout.clientWidth + 1
    );
  }

  await page.goto("/");
  const nextSectionTop = await page
    .locator("main section")
    .nth(1)
    .evaluate((element) => element.getBoundingClientRect().top);
  expect(nextSectionTop).toBeLessThan(viewportHeight);

  await page.goto("/contact");
  const inputFontSize = await page
    .getByLabel("Name")
    .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
  expect(inputFontSize).toBeGreaterThanOrEqual(16);
});
