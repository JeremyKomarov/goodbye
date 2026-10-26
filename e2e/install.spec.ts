// What "Add to Home Screen" gets: the manifest the page links, in the reader's language, and icons
// that are really there. Writes nothing.
import { expect, test } from "./test";

const NAMES = { en: "Exit group", he: "יציאה מהקבוצה" };

for (const [locale, shortName] of Object.entries(NAMES)) {
  test(`the page links a manifest whose icons load, in ${locale}`, async ({ page, context, baseURL }) => {
    await context.addCookies([{ name: "NEXT_LOCALE", value: locale, url: baseURL! }]);
    await page.goto("/");
    const href = await page.locator('link[rel="manifest"]').getAttribute("href");
    const answer = await page.request.get(href!);
    expect(answer.ok()).toBe(true);
    const manifest = (await answer.json()) as {
      short_name: string;
      lang: string;
      icons: { src: string; sizes: string }[];
    };
    expect(manifest.short_name).toBe(shortName);
    expect(manifest.lang).toBe(locale);
    expect(manifest.icons.map((icon) => icon.sizes)).toEqual(
      expect.arrayContaining(["192x192", "512x512"]),
    );
    for (const icon of manifest.icons) {
      const image = await page.request.get(icon.src);
      expect(image.headers()["content-type"]).toBe("image/png");
    }
  });
}
