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

test("quote journey reaches a catalogue model without a fabricated result", async ({
  page,
}) => {
  await page.goto("/quote");
  await page.getByRole("button", { name: /^Phone/ }).click();
  await page.getByRole("button", { name: /^iPhone/ }).click();
  await expect(page.getByText("Choose or enter the model")).toBeVisible();
});

test("pricing results lead to a valid repair and preserve the selected tier", async ({
  page,
}) => {
  await page.goto("/pricing");
  await page.getByRole("button", { name: "Phone" }).click();
  const repairLink = page
    .locator('a[href^="/repairs/"][href*="tier="]:visible')
    .first();
  await expect(repairLink).toBeVisible();
  await repairLink.click();
  await expect(page).toHaveURL(/\/repairs\/.+\?tier=/);
  const requestLink = page.getByRole("link", {
    name: /Request This Repair|Request an Assessment/,
  });
  await expect(requestLink).toHaveAttribute("href", /tier=/);
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
  if (viewport && viewport.width < 768) {
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
  for (const path of ["/", "/repairs", "/pricing", "/quote", "/contact"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .disableRules(["color-contrast"])
      .analyze();
    expect(results.violations, path).toEqual([]);
  }
});

test("disabled prototype features are absent from navigation", async ({
  page,
}) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation").first();
  await expect(navigation.getByText(/Track Repair|Account|Mail-in/)).toHaveCount(0);
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
