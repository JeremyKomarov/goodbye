// The landing journey at a phone's and a laptop's size, in both languages: every wizard step fits
// the card without a scroll, and the page never scrolls either way. On a laptop the card keeps one
// size; on a phone it takes the step showing's height, so the hero chat above it gets the rest,
// and the chat stays in sight. It stops before "Create", so it writes no room.
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
  test(`the wizard fits on every step (${locale})`, async ({ page, context, baseURL }, testInfo) => {
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

    if (testInfo.project.name === "laptop") {
      expect(sizes[1], "the card resized on step 2").toEqual(sizes[0]);
      expect(sizes[2], "the card resized on step 3").toEqual(sizes[0]);
    } else {
      // The chat is the demonstration: on a phone it keeps its header and a line in view.
      const chat = await page.locator("[class*=landing-screen__chat]").boundingBox();
      expect(chat?.height ?? 0, "the chat is squeezed out").toBeGreaterThan(90);
    }
  });
}

// Until the page runs in the browser, a placeholder holds the form's place. It is as tall as the
// first step will be (CreateRoomPanel's `--placeholder-height`), so neither the card nor the chat
// above it jumps when the form arrives.
test("the placeholder is as tall as the form that replaces it", async ({ browser }, testInfo) => {
  const { viewport, baseURL } = testInfo.project.use;
  const cardHeight = async (javaScriptEnabled: boolean) => {
    const context = await browser.newContext({ viewport, baseURL, javaScriptEnabled });
    const page = await context.newPage();
    await page.goto("/");
    if (javaScriptEnabled) await page.locator("[class*=create-room-form__steps]").waitFor();
    const height = await page
      .locator("[class*=create-room-panel]")
      .evaluate((panel) => panel.getBoundingClientRect().height);
    await context.close();
    return height;
  };
  expect(Math.abs((await cardHeight(false)) - (await cardHeight(true)))).toBeLessThanOrEqual(1);
});
