import { test, expect } from "@playwright/test";
import { auditAccessibility } from "./accessibility";

// Client-side navigation updates the URL once the target page loads; a dev server compiles it on first visit.
const NAVIGATION_TIMEOUT = 15_000;

const publicRoutes = [
  "/",
  "/work",
  "/about",
  "/craft",
  "/insight",
  "/work/karobar-app-product-design",
  "/work/briz-local-marketplace-app-nepal",
  "/work/sync-engine-crdt",
  "/insight/designing-clearer-product-flows",
  "/insight/what-should-a-dashboard-show-first",
];

for (const width of [320, 390, 1440]) {
  test(`public pages are readable and fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of publicRoutes) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
      const nav = page.getByRole("navigation", { name: "Main navigation" });
      const bounds = await nav.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      await page.locator("footer").scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      const footer = await page.locator(".foot-row--bottom").boundingBox();
      const dock = await nav.boundingBox();
      expect(footer!.y + footer!.height).toBeLessThan(dock!.y);
      await expect(
        page.locator(
          'a[href*="example.com"], a[href="https://github.com"], a[href="https://x.com"]',
        ),
      ).toHaveCount(0);
    }
    expect(errors).toEqual([]);
  });
}

test("theme persists, settings dismisses and restores keyboard focus", async ({
  page,
}) => {
  await page.goto("/");
  const settings = page.getByRole("button", { name: "Settings", exact: true });
  await settings.focus();
  await page.keyboard.press("Enter");
  await expect(settings).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("group", { name: "Settings" })).toBeVisible();
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.keyboard.press("Escape");
  await expect(settings).toBeFocused();
  await expect(page.getByRole("group", { name: "Settings" })).toHaveCount(0);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await settings.click();
  await expect(
    page.getByRole("button", { name: "Dark", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "System", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.emulateMedia({ colorScheme: "light" });
  await expect
    .poll(() => page.locator("body").evaluate((el) => getComputedStyle(el).backgroundColor))
    .toBe("rgb(255, 255, 255)");
  const light = await page
    .locator("body")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  await page.emulateMedia({ colorScheme: "dark" });
  // The body background eases between themes, so wait for it to settle.
  await expect
    .poll(() => page.locator("body").evaluate((el) => getComputedStyle(el).backgroundColor))
    .toBe("rgb(17, 17, 17)");
  expect(light).toBe("rgb(255, 255, 255)");
  await settings.click();
  await page.locator("h1").click();
  await expect(page.getByRole("group", { name: "Settings" })).toHaveCount(0);
});

test("disclosures expose content by keyboard and dock navigates between pages", async ({
  page,
}) => {
  await page.goto("/about");
  const experience = page.getByRole("button", { name: /Karobar/ });
  await experience.focus();
  await page.keyboard.press("Enter");
  await expect(experience).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByText("Conducted research to understand user problems", {
      exact: false,
    }),
  ).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(experience).toHaveAttribute("aria-expanded", "false");
  const strength = page.getByRole("button", { name: /Find the real problem/ });
  await strength.click();
  await expect(strength).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByText("I start with what people need to do", { exact: false }),
  ).toBeVisible();
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await page.goto("/insight");
  for (const label of ["Projects", "About", "Craft", "Insights"]) {
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(
      nav.getByRole("link", { name: label, exact: true }),
    ).toHaveAttribute("aria-current", "page");
    await expect(page.locator("h1")).toBeVisible();
  }
  await nav.getByRole("link", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL(/\/$/, { timeout: NAVIGATION_TIMEOUT });
});

for (const theme of ["Light", "Dark"]) {
  test(`key pages have no unexpected accessibility findings in ${theme}`, async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Settings", exact: true }).click();
    await page.getByRole("button", { name: theme, exact: true }).click();
    await expect.poll(() => page.locator(".hero-ctas .chip").first().evaluate((element) => getComputedStyle(element).backgroundColor))
      .toBe(theme === "Light" ? "rgb(244, 244, 245)" : "rgb(30, 30, 30)");
    await auditAccessibility(page);
    await page.keyboard.press("Escape");
    for (const route of [
      "/",
      "/about",
      "/work",
      "/craft",
      "/insight/designing-clearer-product-flows",
    ]) {
      await page.goto(route);
      await auditAccessibility(page);
    }
  });
}

test("drafts and unknown content return 404 and stay out of discovery", async ({
  request,
}) => {
  for (const route of [
    "/insight/better-product-design-feedback",
    "/insight/missing",
    "/work/missing",
    "/craft/missing",
  ]) {
    expect((await request.get(route)).status(), route).toBe(404);
  }
  for (const route of ["/", "/insight", "/sitemap.xml"]) {
    expect(await (await request.get(route)).text()).not.toContain(
      "better-product-design-feedback",
    );
  }
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("example.com");
});

test("primary content remains visible without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/");
  await expect(
    page.getByRole("heading", { name: "Yogesh Raya", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "My Work", exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText("a Product Designer based in", {
      exact: false,
    }),
  ).toBeVisible();
  await context.close();
});

test("reduced motion and mobile settings preserve usable controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about");
  await expect(page.locator("footer .foot-time")).toContainText("in Nepal");
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  const box = await page.getByRole("group", { name: "Settings" }).boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(320);
  await page.keyboard.press("Escape");
  const strength = page.getByRole("button", {
    name: /Design beyond the happy path/,
  });
  await strength.click();
  await expect(strength).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByText("I consider empty states", { exact: false }),
  ).toBeVisible();
});

test("case studies list published related insights in frontmatter order", async ({ page }) => {
  await page.goto("/work/karobar-app-product-design");
  const related = page.getByRole("region", { name: "Related insights" });
  await expect(related.getByRole("heading", { level: 3 })).toHaveText([
    "What should a product dashboard show first?",
    "Designing clearer product flows",
  ]);
  await expect(related.getByRole("link").first()).toHaveAttribute("href", "/insight/what-should-a-dashboard-show-first");

  // A referenced draft stays hidden; the published reference still shows.
  await page.goto("/work/briz-local-marketplace-app-nepal");
  await expect(page.getByRole("region", { name: "Related insights" }).getByRole("link")).toHaveCount(1);

  // No references: no section.
  await page.goto("/work/sync-engine-crdt");
  await expect(page.getByRole("region", { name: "Related insights" })).toHaveCount(0);

  await page.goto("/work/karobar-app-product-design");
  await page.getByRole("region", { name: "Related insights" }).getByRole("link").first().click();
  await expect(page).toHaveURL(/\/insight\/what-should-a-dashboard-show-first$/, { timeout: NAVIGATION_TIMEOUT });
  await expect(page.getByRole("link", { name: "Back to Insights" }).first()).toBeVisible();
});

test("old URLs permanently redirect to their new pages", async ({ request }) => {
  for (const [from, to] of [
    ["/blog", "/insight"],
    ["/blog/designing-clearer-product-flows", "/insight/designing-clearer-product-flows"],
    ["/work/property-management-dashboard", "/work/karobar-app-product-design"],
    ["/work/bookkeeping-app-redesign-small-business", "/work/karobar-app-product-design"],
    ["/work/briz-mobile-workflow", "/work/briz-local-marketplace-app-nepal"],
  ]) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(308);
    expect(response.headers().location, from).toBe(to);
  }
});

// The immersive reader is hidden for now (src/config/features.ts); re-enable these with it.
test.skip("immersive reader opens from the button or R, keeps focus inside, and remembers settings", async ({ page }) => {
  await page.goto("/insight/designing-clearer-product-flows");
  const trigger = page.getByRole("button", { name: /Immersive reader/ });
  await trigger.click();
  const reader = page.getByRole("dialog", { name: /Immersive reader/ });
  await expect(reader).toBeVisible();
  await expect(reader.getByRole("heading", { level: 1 })).toHaveText("Designing clearer product flows");
  await expect(page.getByRole("button", { name: "Close immersive reader" })).toBeFocused();

  await reader.getByRole("button", { name: "Display" }).click();
  await reader.getByRole("group", { name: "Page" }).getByRole("button", { name: "Paper" }).click();
  await expect(reader).toHaveAttribute("data-page", "paper");
  await page.keyboard.press("Escape");
  await expect(reader.locator("#reader-settings")).toHaveCount(0);
  await expect(reader).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(reader).toHaveCount(0);
  await expect(trigger).toBeFocused();

  await page.reload();
  await page.keyboard.press("r");
  await expect(page.getByRole("dialog", { name: /Immersive reader/ })).toHaveAttribute("data-page", "paper");
});

// The immersive reader is hidden for now (src/config/features.ts); re-enable these with it.
test.skip("first visit introduces the immersive reader once", async ({ page }) => {
  await page.goto("/work/karobar-app-product-design");
  const intro = page.locator(".reader-intro");
  await expect(intro).toBeVisible();
  await expect(page.getByRole("button", { name: /Immersive reader/ })).toHaveAttribute("data-intro", "on");
  await page.getByRole("button", { name: "Got it" }).click();
  await expect(intro).toHaveCount(0);
  await page.goto("/insight/designing-clearer-product-flows");
  await page.waitForTimeout(1500);
  await expect(intro).toHaveCount(0);
});
