// The landing journey at a phone's and a laptop's size, in both languages: every wizard step fits
// the card without a scroll, the card keeps one size, and the page never scrolls either way. It
// stops before "Create", so it writes no room.
import { expect, test, type Page } from "./test";

const LOCALES = ["he", "en"] as const;

/** How far the page, the card and the step box can each scroll, and the card's size. */
function measure(page: Page) {
  return page.evaluate(() => {
    const panel = document.querySelector<HTMLElement>("[class*=create-room-panel]")!;
    const steps = document.querySelector<HTMLElement>("[class*=create-room-form__steps]")!;
    const root = document.documentElement;
    const { width, height } = panel.getBoundingClientRect();
    return {
      card: { width: Math.round(width), height: Math.round(height) },
      overflow: {
        pageDown: root.scrollHeight - innerHeight,
        pageSideways: root.scrollWidth - innerWidth,
        card: panel.scrollHeight - panel.clientHeight,
        stepDown: steps.scrollHeight - steps.clientHeight,
        // The hidden steps sit offset to the side; that is overflow only if a person can scroll to it.
        stepSideways: ["auto", "scroll"].includes(getComputedStyle(steps).overflowX)
          ? steps.scrollWidth - steps.clientWidth
          : 0,
      },
    };
  });
}

const NO_OVERFLOW = { pageDown: 0, pageSideways: 0, card: 0, stepDown: 0, stepSideways: 0 };

for (const locale of LOCALES) {
  test(`the wizard fits on every step (${locale})`, async ({ page, context, baseURL }) => {
    await context.addCookies([{ name: "NEXT_LOCALE", value: locale, url: baseURL! }]);
    await page.goto("/");
    const next = page.locator('button[type="submit"]');
    await expect(next).toBeEnabled();

    const current = page.locator("[class*=create-room-form__steps] fieldset:not([inert])");
    const sizes = [];

    for (const step of ["reason", "who", "when"]) {
      await page.waitForTimeout(400); // the step's slide
      if (step === "who") await expect(current.getByRole("textbox")).toHaveCount(2);
      if (step === "when") await expect(current.locator('input[type="date"]')).toHaveCount(1);
      const { card, overflow } = await measure(page);
      expect(overflow, `${step} overflows`).toEqual(NO_OVERFLOW);
      sizes.push(card);

      if (step === "reason") await current.getByRole("radio").first().check({ force: true });
      if (step === "who") {
        const fields = current.getByRole("textbox");
        await fields.nth(0).fill("Dana");
        await fields.nth(1).fill("Work friends");
      }
      if (step !== "when") await next.click();
    }

    expect(sizes[1], "the card resized on step 2").toEqual(sizes[0]);
    expect(sizes[2], "the card resized on step 3").toEqual(sizes[0]);
  });
}
