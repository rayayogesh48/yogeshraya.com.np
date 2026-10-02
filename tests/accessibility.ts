import { expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Entrance fades and theme transitions briefly lower contrast; audit the settled page.
async function waitForAnimations(page: Page) {
  await page.waitForFunction(() =>
    document.getAnimations().every((animation) => animation.playState !== "running" || animation.effect?.getTiming().iterations === Infinity),
  );
}

export async function auditAccessibility(page: Page) {
  await waitForAnimations(page);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const findings = result.violations.map((violation) => ({
    id: violation.id,
    targets: violation.nodes.map((node) => node.target.join(" ")),
  }));
  expect(findings, "Unexpected accessibility findings").toEqual([]);
}
