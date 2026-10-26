// Playwright's `test` and `expect`, plus one check on every test: a page that breaks the
// Content-Security-Policy (next.config.ts, docs/DECISIONS.md #16) fails it, with what was blocked.
// Every spec imports from here rather than from "@playwright/test".
import { expect, test as base } from "@playwright/test";

export * from "@playwright/test";

export const test = base.extend({
  context: async ({ context }, provide) => {
    const violations: string[] = [];
    context.on("console", (message) => {
      if (/content security policy/i.test(message.text())) violations.push(message.text());
    });
    await provide(context);
    expect(violations, "the page broke its Content-Security-Policy").toEqual([]);
  },
});
