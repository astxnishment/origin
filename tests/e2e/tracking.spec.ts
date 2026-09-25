import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import postgres from "postgres";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { createSessionToken, SESSION_COOKIE } from "../../lib/server/auth";
import { createRepair, getRepairForCustomer } from "../../lib/server/repairStore";

// This suite only writes synthetic data to an explicitly enabled, local test DB.
test.skip(process.env.TRACKING_INTEGRATION_TEST !== "true", "Requires the isolated local PostgreSQL tracking test server.");
// Cases are independent; keep their order without skipping every later check
// when an earlier assertion fails. CI runs this suite with one worker.
test.describe.configure({ mode: "default" });

const customerEmails = new Set<string>();
const staffEmail = "teststaff@example.com";
let cleanupSql: postgres.Sql;

async function checkTrackingAccessibilityAndWidth(page: Page) {
  const layout = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(layout.scrollWidth, `Horizontal overflow on ${page.url()}`).toBeLessThanOrEqual(layout.clientWidth + 1);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations, `Accessibility violations on ${page.url()}`).toEqual([]);
}

function customerEmail() {
  const email = `tracking-integration-${randomUUID()}@example.com`;
  customerEmails.add(email);
  return email;
}

async function signIn(context: BrowserContext, email: string, baseURL: string) {
  await context.clearCookies();
  await context.addCookies([{ name: SESSION_COOKIE, value: createSessionToken(email), url: baseURL, httpOnly: true, sameSite: "Lax", secure: false }]);
}

async function seedRepair(email: string, deviceLabel = "Integration test iPhone") {
  return (await createRepair({
    customerEmail: email,
    customerName: "Integration Customer",
    customerPhone: "07700900123",
    deviceLabel,
    repairLabel: "Screen assessment",
    serviceMethod: "mail-in",
    returnAddress: "Test-only return address\nLeeds LS1 1AA",
    issue: "Synthetic repair for local tracking verification.",
  }, `integration_${randomUUID()}`)).repair;
}

test.beforeAll(async () => {
  const value = process.env.DATABASE_URL;
  if (!value) throw new Error("DATABASE_URL is required for tracking integration tests.");
  const url = new URL(value);
  if (url.hostname !== "127.0.0.1" || url.port !== "55432" || !["postgres:", "postgresql:"].includes(url.protocol)) {
    throw new Error("Tracking integration tests are restricted to the isolated local database on 127.0.0.1:55432.");
  }
  if (process.env.EMAILS_ENABLED !== "false" || process.env.TURNSTILE_SECRET_KEY || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    throw new Error("Tracking integration tests require email delivery disabled and Turnstile keys unset.");
  }
  if (process.env.ALLOW_PREVIEW_REPAIR_WRITES !== "true") {
    throw new Error("Explicitly enable ALLOW_PREVIEW_REPAIR_WRITES for this isolated local database test.");
  }
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32 || !process.env.STAFF_EMAILS?.split(",").map((email) => email.trim().toLowerCase()).includes(staffEmail)) {
    throw new Error("Configure the same local AUTH_SECRET and teststaff@example.com staff allowlist for the test runner and Next server.");
  }
  cleanupSql = postgres(value, { max: 1, prepare: false, onnotice: () => {} });
  await cleanupSql.unsafe(await readFile(resolve(process.cwd(), "db/migrations/001_repairs.sql"), "utf8"));
});

test.afterAll(async () => {
  if (!cleanupSql) return;
  try {
    // Never truncate tables or remove records outside this worker's fixtures.
    for (const email of customerEmails) {
      await cleanupSql`DELETE FROM repairs WHERE customer_email = ${email}`;
    }
  } finally {
    await cleanupSql.end();
  }
});

test("tracking requires sign-in and denies customer access to staff tools", async ({ page, context, baseURL }) => {
  await page.goto("/track");
  await expect(page).toHaveURL(/\/login\?next=/);
  const unsigned = await context.request.post("/api/admin/repairs", { data: {} });
  expect(unsigned.status()).toBe(401);

  const privateRepair = await seedRepair(customerEmail(), "Private staff-dashboard repair");
  await signIn(context, customerEmail(), baseURL!);
  const forbiddenPage = await page.goto("/admin/repairs");
  // Next's documented not-found boundary returns 200 when its shell has streamed.
  // Verify the denied content and data boundary, not only the transport status.
  expect([200, 404]).toContain(forbiddenPage?.status());
  await expect(page.getByRole("heading", { name: "This page could not be found.", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Repair dashboard.", exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Customer name", { exact: true })).toHaveCount(0);
  const deniedHtml = await page.content();
  expect(deniedHtml).not.toContain(privateRepair.reference);
  expect(deniedHtml).not.toContain(privateRepair.customerEmail);
  expect(deniedHtml).not.toContain(privateRepair.returnAddress);
  const forbiddenWrite = await context.request.post("/api/admin/repairs", { headers: { origin: baseURL! }, data: {} });
  expect(forbiddenWrite.status()).toBe(403);
});

test("customers see only their repairs and cannot look up another customer's reference", async ({ page, context, baseURL }) => {
  const ownEmail = customerEmail();
  const own = await seedRepair(ownEmail, "Customer-owned test phone");
  const other = await seedRepair(customerEmail(), "Another customer's private phone");
  await signIn(context, ownEmail, baseURL!);

  await page.goto("/track");
  await expect(page.getByRole("heading", { name: own.deviceLabel, exact: true })).toBeVisible();
  await expect(page.getByText(other.deviceLabel, { exact: true })).toHaveCount(0);
  await expect(page.getByText(/Please wait for shipping instructions/)).toBeVisible();
  expect(await page.content()).not.toContain("Test-only return address");
  expect(await page.content()).not.toContain(other.customerEmail);
  await checkTrackingAccessibilityAndWidth(page);

  await page.getByLabel("Repair reference (optional)").fill(other.reference);
  await page.getByRole("button", { name: "Find repair", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No matching repair for this account." })).toBeVisible();
  await expect(page.getByText(other.deviceLabel, { exact: true })).toHaveCount(0);
});

test("staff can add a manual repair and publish an update into the customer's timeline", async ({ page, context, browser, baseURL }, testInfo) => {
  const email = customerEmail();
  const deviceLabel = `Manual Samsung ${randomUUID().slice(0, 8)}`;
  await signIn(context, staffEmail, baseURL!);
  await page.goto("/admin/repairs");
  await expect(page.getByRole("heading", { name: "Repair dashboard." })).toBeVisible();
  await page.getByText("Add a repair received by phone or in person", { exact: true }).click();
  await checkTrackingAccessibilityAndWidth(page);
  await page.getByLabel("Customer name", { exact: true }).fill("Manual Test Customer");
  await page.getByLabel("Customer email", { exact: true }).fill(email);
  await page.getByLabel("Customer phone", { exact: true }).fill("07700 900123");
  await page.getByLabel("Device", { exact: true }).fill(deviceLabel);
  await page.getByLabel("Repair or assessment", { exact: true }).fill("Charging port assessment");
  await page.getByLabel("Issue description", { exact: true }).fill("Local test: charging intermittently.");
  const createdResponse = page.waitForResponse((response) => response.url().endsWith("/api/admin/repairs") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Add repair", exact: true }).click();
  const response = await createdResponse;
  expect(response.status()).toBe(201);
  const { repair } = await response.json();
  await expect(page.getByRole("heading", { name: deviceLabel, exact: true })).toBeVisible();
  const section = page.locator("section").filter({ has: page.getByRole("heading", { name: deviceLabel, exact: true }) });
  await section.getByRole("combobox", { name: /^Repair status/ }).selectOption("repairing");
  await section.getByLabel("Message shown to the customer", { exact: true }).fill("We have started repairing your charging port.");
  const updatedResponse = page.waitForResponse((result) => result.url().includes(`/api/admin/repairs/${repair.reference}`) && result.request().method() === "PATCH");
  await section.getByRole("button", { name: "Save customer update", exact: true }).click();
  expect((await updatedResponse).status()).toBe(200);
  await expect(section.getByText("We have started repairing your charging port.", { exact: true })).toBeVisible();
  if (testInfo.project.name === "desktop") {
    await page.screenshot({ path: testInfo.outputPath("staff-dashboard.png"), fullPage: true });
  }

  const customerContext = await browser.newContext({ baseURL, viewport: page.viewportSize()! });
  try {
    await signIn(customerContext, email, baseURL!);
    const customerPage = await customerContext.newPage();
    await customerPage.goto(`/track?reference=${repair.reference}`);
    await expect(customerPage.getByRole("heading", { name: deviceLabel, exact: true })).toBeVisible();
    await expect(customerPage.getByText("We have started repairing your charging port.", { exact: true })).toBeVisible();
    await expect(customerPage.getByText("Repair in progress", { exact: true })).toHaveCount(2);
    await expect(customerPage.getByText("Assessment required", { exact: true })).toBeVisible();
    expect(await customerPage.content()).not.toContain(staffEmail);
    if (testInfo.project.name === "desktop") {
      await customerPage.screenshot({ path: testInfo.outputPath("customer-tracking.png"), fullPage: true });
    }
  } finally { await customerContext.close(); }
});

test("staff writes reject cross-site and stale updates and render customer notes as text", async ({ page, context, baseURL }) => {
  const email = customerEmail();
  const repair = await seedRepair(email, "Concurrency test device");
  await signIn(context, staffEmail, baseURL!);
  const path = `/api/admin/repairs/${repair.reference}`;
  const data = { status: "received", customerNote: '<img src=x onerror="window.testInjected=true">', expectedUpdatedAt: repair.updatedAt };
  expect((await context.request.patch(path, { data })).status()).toBe(403);
  expect((await context.request.patch(path, { headers: { origin: "https://untrusted.example" }, data })).status()).toBe(403);
  const saved = await context.request.patch(path, { headers: { origin: baseURL! }, data });
  expect(saved.status()).toBe(200);
  expect((await context.request.patch(path, { headers: { origin: baseURL! }, data: { ...data, status: "ready" } })).status()).toBe(409);
  const current = await getRepairForCustomer(repair.reference, email);
  expect(current?.status).toBe("received");
  expect(current?.history).toHaveLength(2);

  await signIn(context, email, baseURL!);
  await page.goto(`/track?reference=${repair.reference}`);
  await expect(page.getByText(data.customerNote, { exact: true })).toBeVisible();
  await expect(page.locator("img[onerror]")).toHaveCount(0);
});

test("mail-in booking persists once without email and appears in live tracking", async ({ page, context, baseURL }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Run the real booking submission once; other scenarios cover tracking at every viewport.");
  const email = customerEmail();
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 7);
  while (date.getUTCDay() === 0) date.setUTCDate(date.getUTCDate() + 1);
  await page.goto("/book");
  await page.getByLabel("Device type").click();
  await page.getByRole("option", { name: "Phone", exact: true }).click();
  const formReadyAt = Date.now();
  await page.getByLabel("Brand", { exact: false }).click();
  await page.getByRole("option", { name: "Apple", exact: true }).click();
  await page.getByLabel("Model", { exact: false }).click();
  await page.getByRole("option", { name: "iPhone 18 Pro", exact: true }).click();
  await page.getByLabel("Repair type", { exact: false }).click();
  await page.getByRole("option", { name: "Screen replacement", exact: true }).click();
  await page.getByLabel("Issue description", { exact: false }).fill("Synthetic mail-in request for the launch check.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: /^Mail-in repair/ }).click();
  await page.getByLabel("Return address", { exact: false }).fill("Test-only online address\nLeeds LS1 1AA");
  await page.getByLabel(/^Date\s*\*?$/).fill(date.toISOString().slice(0, 10));
  await page.getByRole("button", { name: "10:00am", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Full name", { exact: false }).fill("Online Integration Customer");
  await page.getByLabel("Email", { exact: false }).fill(email);
  await page.getByLabel("Phone number", { exact: false }).fill("07700 900123");
  await page.getByRole("checkbox").check();
  // Respect the real server's minimum form-completion interval without altering
  // its timestamp or bypassing the spam checks.
  await expect.poll(() => Date.now() - formReadyAt).toBeGreaterThanOrEqual(2100);
  const submittedRequest = page.waitForRequest((request) => request.url().endsWith("/api/booking") && request.method() === "POST");
  const submittedResponse = page.waitForResponse((response) => response.url().endsWith("/api/booking") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Request Repair Slot", exact: true }).click();
  const [request, response] = await Promise.all([submittedRequest, submittedResponse]);
  const body = request.postDataJSON();
  expect(body).toMatchObject({
    email, serviceMethod: "mail-in", deviceType: "phone", brand: "Apple",
    modelId: "iphone-18-pro", repair: "Screen replacement",
    returnAddress: "Test-only online address\nLeeds LS1 1AA",
    date: date.toISOString().slice(0, 10), time: "10:00am", consentToContact: true,
  });
  expect(response.status(), await response.text()).toBe(200);
  const result = await response.json();
  expect(result.reference).toMatch(/^OR-/);
  expect(result.confirmationEmailSent).toBe(false);
  await expect(page.getByRole("heading", { name: "Repair request received.", exact: true })).toBeVisible();
  await expect(page.getByText(result.reference, { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Track this repair", exact: true })).toHaveAttribute("href", result.trackingUrl);
  await expect(page.getByText("Do not post the device until those instructions are confirmed", { exact: true })).toBeVisible();
  const retry = await context.request.post("/api/booking", { headers: { origin: baseURL! }, data: body });
  expect(retry.status()).toBe(200);
  expect((await retry.json()).reference).toBe(result.reference);
  const conflict = await context.request.post("/api/booking", { headers: { origin: baseURL! }, data: { ...body, issue: "Changed request" } });
  expect(conflict.status()).toBe(409);
  const rows = await cleanupSql`SELECT count(*)::int AS total FROM repairs WHERE customer_email = ${email}`;
  expect(rows[0].total).toBe(1);

  await signIn(context, email, baseURL!);
  await page.goto(result.trackingUrl);
  await expect(page.getByText(result.reference, { exact: true })).toBeVisible();
  await expect(page.getByText("Mail-in repair", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Apple iPhone 18 Pro", exact: true })).toBeVisible();
  await expect(page.getByText(/Please wait for shipping instructions/)).toBeVisible();
});
