import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.AUDIT_BASE_URL ?? "http://127.0.0.1:3107";
const phase = process.env.AUDIT_PHASE ?? "before";
const root = path.resolve("artifacts", "design-audit", phase);

const viewports = [
  { name: "1440x1000", width: 1440, height: 1000 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "430x932", width: 430, height: 932 },
  { name: "390x844", width: 390, height: 844 },
  { name: "375x812", width: 375, height: 812 },
  { name: "320x568", width: 320, height: 568 },
];

const routes = [
  { name: "home", route: "/" },
  { name: "phone-repairs", route: "/repairs/phones" },
  { name: "tablet-repairs", route: "/repairs/ipad" },
  { name: "laptop-repairs", route: "/repairs/laptops" },
  { name: "console-repairs", route: "/repairs/consoles" },
  { name: "data-recovery", route: "/repairs/data-recovery" },
  { name: "pricing", route: "/pricing" },
  { name: "quote", route: "/quote" },
  { name: "booking", route: "/book" },
  { name: "about", route: "/about" },
  { name: "contact", route: "/contact" },
  { name: "faq", route: "/faq" },
  { name: "mail-in", route: "/mail-in" },
  { name: "tracking", route: "/track" },
  { name: "privacy", route: "/privacy" },
  { name: "terms", route: "/terms" },
  { name: "warranty", route: "/warranty" },
  { name: "not-found", route: "/design-audit-not-found" },
];

const themes = [
  { name: "light", colorScheme: "light" },
  { name: "dark", colorScheme: "dark" },
];

const browser = await chromium.launch();

try {
  for (const viewport of viewports) {
    for (const theme of themes) {
      const outputDir = path.join(root, theme.name, viewport.name);
      await mkdir(outputDir, { recursive: true });

      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        colorScheme: theme.colorScheme,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();

      await page.addInitScript((selectedTheme) => {
        localStorage.setItem("origin-theme", selectedTheme);
      }, theme.name);

      for (const item of routes) {
        await page.goto(new URL(item.route, baseURL).toString(), {
          waitUntil: "domcontentloaded",
        });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(120);
        await page.screenshot({
          path: path.join(outputDir, `${item.name}.png`),
          fullPage: false,
          animations: "disabled",
        });
      }

      await context.close();
    }
  }
} finally {
  await browser.close();
}

console.log(`Design audit screenshots saved to ${root}`);
