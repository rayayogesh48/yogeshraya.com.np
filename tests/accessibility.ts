import { expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Entrance fades and theme transitions briefly lower contrast; audit the settled page.
async function waitForAnimations(page: Page) {
  await page.waitForFunction(() =>
    document.getAnimations().every((animation) => animation.playState !== "running" || animation.effect?.getTiming().iterations === Infinity),
  );
  // Motion's JS-driven fades (Reveal) don't appear in getAnimations(), so also wait until inline opacities stop
  // changing between polls. Elements meant to stay faded (inactive dots, mock bars) are stable and don't block this.
  await page.waitForFunction(
    () => {
      const snapshot = [...document.querySelectorAll<HTMLElement>('[style*="opacity"]')].map((element) => getComputedStyle(element).opacity).join();
      const store = window as unknown as { __opacitySnapshot?: string };
      const settled = store.__opacitySnapshot === snapshot;
      store.__opacitySnapshot = snapshot;
      return settled;
    },
    undefined,
    { polling: 150 },
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
