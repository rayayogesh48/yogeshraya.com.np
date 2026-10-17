import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
  });

  test("hero shows the profile, Nepali name toggle, and CTA", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: /Yogesh/ })).toBeVisible();
    await expect(page.locator(".range-field")).toBeVisible();
    const avatar = page.getByRole("button", { name: "Show my name in Nepali" });
    await avatar.click();
    await expect(avatar).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".name-hidden")).toContainText("योगेश");
    await expect(page.locator(".hero-bio").getByRole("link", { name: "Bytecare Technology" })).toHaveAttribute("href", /bytecaretech\.com/);
    await expect(page.locator(".hero-bio").getByRole("link", { name: "Briz", exact: true })).toHaveAttribute("href", /brizmarket\.com/);
    await page.locator(".hero-ctas").getByText("View work").click();
    await expect.poll(() => page.evaluate(() => document.getElementById("work")!.getBoundingClientRect().top)).toBeLessThan(100);
  });

  test("project carousels slide by button, dot, and keyboard and link to case studies", async ({ page }) => {
    const card = page.locator(".project-card").first();
    const carousel = card.getByRole("region", { name: /images$/ });
    await expect(carousel.getByRole("button", { name: "Slide 1 of 3" })).toHaveAttribute("aria-current", "true");
    await carousel.getByRole("button", { name: "Next slide" }).click();
    await expect(carousel.getByRole("button", { name: "Slide 2 of 3" })).toHaveAttribute("aria-current", "true");
    await carousel.getByRole("button", { name: "Slide 3 of 3" }).click();
    await expect(carousel.getByRole("button", { name: "Slide 3 of 3" })).toHaveAttribute("aria-current", "true");
    await carousel.focus();
    await page.keyboard.press("ArrowRight");
    await expect(carousel.getByRole("button", { name: "Slide 1 of 3" })).toHaveAttribute("aria-current", "true");
    await card.locator(".project-meta").click();
    await expect(page).toHaveURL(/\/work\/property-management-dashboard$/);
  });

  test("single-image projects hide carousel controls", async ({ page }) => {
    const card = page.locator(".project-card").filter({ hasText: "Real-Time Collaborative Document Canvas" });
    await expect(card.locator('img[src="/images/case-studies/sync-engine.svg"]')).toBeVisible();
    await expect(card.getByRole("button", { name: "Next slide" })).toHaveCount(0);
  });

  test("dock follows the scrolled section and scrolls to sections", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await expect(nav.getByRole("button", { name: "Home" })).toHaveAttribute("aria-current", "true");
    await nav.getByRole("button", { name: "Craft" }).click();
    await expect(nav.getByRole("button", { name: "Craft" })).toHaveAttribute("aria-current", "true");
    await expect(nav.locator(".dock-item.is-active")).toContainText("Craft");
    await nav.getByRole("button", { name: "Projects" }).click();
    await expect(nav.getByRole("button", { name: "Projects" })).toHaveAttribute("aria-current", "true");
  });

  test("experience and strengths expand", async ({ page }) => {
    const job = page.getByRole("button", { name: /Karobar/ });
    await job.click();
    await expect(job).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("link", { name: "Explore the work" }).first()).toBeVisible();
    const strength = page.getByRole("button", { name: "Make the next step clear" });
    await strength.click();
    await expect(strength).toHaveAttribute("aria-expanded", "true");
    await page.mouse.move(0, 0);
    await expect(strength).toHaveAttribute("aria-expanded", "true");
  });

  test("footer shows local time and only real social links", async ({ page }) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.locator(".foot-time")).toContainText("in Nepal");
    await expect(footer.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute("href", /linkedin\.com/);
    await expect(footer.getByRole("link", { name: /GitHub|on X/ })).toHaveCount(0);
  });
});

for (const width of [320, 390, 768]) {
  test(`home and dock fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const dock = await page.locator(".dock-container").boundingBox();
    expect(dock!.x).toBeGreaterThanOrEqual(0);
    expect(dock!.x + dock!.width).toBeLessThanOrEqual(width);
    const card = await page.locator(".project-card").first().boundingBox();
    expect(card!.x + card!.width).toBeLessThanOrEqual(width);
  });
}

test("reduced motion keeps all home content visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const heading of ["My Work", "Experience", "What I Do Best", "About me", "Craft", "Insights"]) {
    const element = page.getByRole("heading", { name: heading, exact: true });
    await element.scrollIntoViewIfNeeded();
    await expect(element).toBeVisible();
  }
});
