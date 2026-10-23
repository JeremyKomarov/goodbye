// A page that throws shows the app's own error screen, in the reader's language, with a way to try
// again and a way home — not Next's default. `/dev/error` throws on purpose (development only).
import { expect, test } from "@playwright/test";

const SAYS = {
  en: { title: "Something went wrong", retry: "Try again", home: "Go to the home page" },
  he: { title: "משהו השתבש", retry: "לנסות שוב", home: "לעמוד הראשי" },
};

for (const [locale, says] of Object.entries(SAYS)) {
  test(`a page that throws says so, in ${locale}`, async ({ page, context, baseURL }) => {
    await context.addCookies([{ name: "NEXT_LOCALE", value: locale, url: baseURL! }]);
    await page.goto("/dev/error");
    await expect(page.getByText(says.title)).toBeVisible();
    await expect(page.getByRole("button", { name: says.retry })).toBeVisible();
    await expect(page.getByRole("link", { name: says.home })).toHaveAttribute("href", "/");
    await expect(page.locator("html")).toHaveAttribute("dir", locale === "he" ? "rtl" : "ltr");
  });
}
