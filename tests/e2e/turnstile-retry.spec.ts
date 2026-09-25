import { expect, test, type Page } from "@playwright/test";

// Run against a build with NEXT_PUBLIC_TURNSTILE_SITE_KEY set. The widget and
// submission endpoints below are local mocks; no verification or email is sent.
test.describe("Turnstile submission recovery", () => {
  test.skip(!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY, "Requires a build with Turnstile enabled.");

  test.beforeEach(async ({ page }) => {
    await page.route("https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", (route) =>
      route.fulfill({
        contentType: "application/javascript",
        body: `
          let nextWidget = 0;
          const widgets = new Map();
          window.turnstile = {
            render(element, options) {
              const id = String(++nextWidget);
              const button = document.createElement("button");
              button.type = "button";
              button.textContent = "Complete test spam check";
              button.onclick = () => {
                button.disabled = true;
                options.callback("single-use-test-token-" + id);
              };
              element.appendChild(button);
              widgets.set(id, element);
              return id;
            },
            remove(id) {
              widgets.get(id)?.replaceChildren();
              widgets.delete(id);
            }
          };
        `,
      })
    );
  });

  async function failThenAccept(page: Page, endpoint: string, networkFailure = false) {
    const submissions: Record<string, unknown>[] = [];
    await page.route(`**${endpoint}`, async (route) => {
      submissions.push(route.request().postDataJSON());
      if (submissions.length === 1) {
        if (networkFailure) return route.abort("failed");
        return route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "Test delivery unavailable. Please retry." }) });
      }
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, message: "Test request accepted." }) });
    });
    return submissions;
  }

  async function retryAndCheck(page: Page, buttonName: string, submissions: Record<string, unknown>[]) {
    await page.getByRole("button", { name: "Complete test spam check" }).click();
    await page.getByRole("button", { name: buttonName, exact: true }).click();
    await expect.poll(() => submissions.length).toBe(1);
    // A consumed token must be replaced immediately, without reloading or
    // waiting for its five-minute expiry. This fails if the widget stays spent.
    await expect(page.getByRole("button", { name: "Complete test spam check" })).toBeEnabled();
    await page.getByRole("button", { name: "Complete test spam check" }).click();
    await page.getByRole("button", { name: buttonName, exact: true }).click();
    await expect.poll(() => submissions.length).toBe(2);
    await expect(page.getByText("Test request accepted.", { exact: false })).toBeVisible();
    expect(submissions[1].turnstileToken).not.toBe(submissions[0].turnstileToken);
    const withoutToken = (input: Record<string, unknown>) => {
      const data = { ...input };
      delete data.turnstileToken;
      return data;
    };
    // Includes the unchanged request identity and the customer's entered values.
    expect(withoutToken(submissions[1])).toEqual(withoutToken(submissions[0]));
  }

  for (const networkFailure of [false, true]) {
    test(`contact retries after ${networkFailure ? "a lost response" : "a delivery failure"}`, async ({ page }) => {
      const submissions = await failThenAccept(page, "/api/contact", networkFailure);
      await page.goto("/contact");
      await page.getByLabel("Name", { exact: false }).fill("Test Customer");
      await page.getByLabel("Email", { exact: false }).fill("customer@example.com");
      await page.getByLabel("How can we help?", { exact: false }).fill("Keep this message after a failed send.\nAnd this second line.");
      await page.getByRole("checkbox").check();
      await retryAndCheck(page, "Send Message", submissions);
    });
  }

  test("booking retries with the same repair details and request key", async ({ page }) => {
    const submissions = await failThenAccept(page, "/api/booking");
    await page.goto("/book");
    await page.getByLabel("Device type").click();
    await page.getByRole("option", { name: "Game console" }).click();
    await page.getByLabel("Make & model").fill("PlayStation 5");
    await page.getByLabel("Repair / issue").click();
    await page.getByRole("option", { name: "HDMI port repair" }).click();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    const date = new Date();
    date.setUTCDate(date.getUTCDate() + 7);
    while (date.getUTCDay() === 0) date.setUTCDate(date.getUTCDate() + 1);
    await page.getByLabel(/^Date\s*\*?$/).fill(date.toISOString().slice(0, 10));
    await page.getByRole("button", { name: "10:00am", exact: true }).click();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.getByLabel("Full name").fill("Test Customer");
    await page.getByLabel("Email", { exact: false }).fill("customer@example.com");
    await page.getByLabel("Phone", { exact: false }).fill("07700900123");
    await page.getByRole("checkbox").check();
    await retryAndCheck(page, "Request Repair Slot", submissions);
  });

  test("account access retries with the entered email preserved", async ({ page }) => {
    test.skip(process.env.NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED === "false", "Customer accounts disabled for this build.");
    const submissions = await failThenAccept(page, "/api/auth/magic-link");
    await page.goto("/login");
    await page.getByLabel("Email address").fill("customer@example.com");
    await retryAndCheck(page, "Email me a sign-in link", submissions);
  });
});
