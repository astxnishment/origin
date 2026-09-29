import { expect, test } from "@playwright/test";

test("repairs index device links open the matching quote model list", async ({ page }) => {
  for (const [family, device, model] of [
    ["iPad", "ipad", "iPad Pro 11-inch M5"],
    ["MacBook", "macbook", "MacBook Neo A18 Pro"],
    ["Samsung Galaxy Tab", "galaxy-tab", "Galaxy Tab S11"],
    ["Samsung Galaxy Book", "galaxy-book", "Galaxy Book6 Pro"],
  ]) {
    await page.goto("/repairs");
    await page.locator(`a[href="/quote?device=${device}"]`).click();
    await expect(page.getByRole("heading", { name: "Choose or enter the model" })).toBeVisible();
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
    await expect(page.locator("aside").getByText(family, { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: model, exact: true })).toBeVisible();
  }
});

test("Samsung and Pixel service quote links preserve the phone brand", async ({ page }) => {
  for (const [brand, model] of [["samsung", "Galaxy S26 Plus"], ["google-pixel", "Pixel 11 Pro XL"]]) {
    await page.goto(`/repairs/${brand}`);
    await page.locator(`a[href="/quote?brand=${brand}"]`).click();
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
    await page.getByRole("button", { name: model, exact: true }).click();
    await expect(page.getByRole("heading", { name: "What is the fault?" })).toBeVisible();
    await page.getByRole("button", { name: "Screen replacement", exact: true }).click();
    await expect(page.getByText("Quote required", { exact: true })).toBeVisible();
  }
});

test("prefilled selections can be changed or reset without being reapplied", async ({ page }) => {
  await page.goto("/quote?device=ipad&brand=samsung");
  await expect(page.locator("aside").getByText("iPad", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Device type", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Which tablet?" })).toBeVisible();
  await page.getByRole("button", { name: /^Samsung Galaxy Tab/ }).click();
  await page.getByRole("button", { name: "Galaxy Tab S11", exact: true }).click();
  await expect(page.locator("aside").getByText("Galaxy Tab S11", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Start over", exact: true }).click();
  await expect(page.getByRole("heading", { name: "What needs repairing?" })).toBeVisible();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  await page.getByRole("button", { name: /^Phone/ }).click();
  await page.getByRole("button", { name: /^iPhone/ }).click();
  await expect(page.locator("aside").getByText("iPhone", { exact: true })).toBeVisible();
  await expect(page.locator("aside").getByText("iPad", { exact: true })).toHaveCount(0);
});

test("invalid and repeated quote URL choices fall back to an empty estimator", async ({ page }) => {
  for (const query of [
    "device=unknown&brand=unknown&category=unknown&repair=unknown",
    "device=ipad&device=macbook&brand=samsung&brand=google-pixel",
    "brand=not-a-brand",
  ]) {
    await page.goto(`/quote?${query}`);
    await expect(page.getByRole("heading", { name: "What needs repairing?" })).toBeVisible();
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    await expect(page.getByText("Estimated price", { exact: true })).toHaveCount(0);
  }
});

test("a pricing repair prefill is applied only after choosing a compatible model", async ({ page }) => {
  await page.goto("/quote?device=ipad&repair=screen-replacement");
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
  await expect(page.getByText("Estimated price", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "iPad 9th Gen", exact: true }).click();
  await expect(page.getByText("Estimated price", { exact: true })).toBeVisible();
  await expect(page.locator("aside").getByText("Screen replacement", { exact: true })).toBeVisible();

  await page.goto("/quote?device=macbook&repair=ssd-ram-upgrade");
  await page.getByRole("button", { name: "MacBook Neo A18 Pro", exact: true }).click();
  await expect(page.getByRole("heading", { name: "What is the fault?" })).toBeVisible();
  await expect(page.getByRole("button", { name: "SSD / RAM upgrade", exact: true })).toHaveCount(0);
  await expect(page.getByText("Estimated price", { exact: true })).toHaveCount(0);
});
