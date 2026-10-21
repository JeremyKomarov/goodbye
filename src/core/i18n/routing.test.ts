import { describe, expect, it } from "vitest";
import { isLocale, LOCALES, localeDirection, resolveLocale, routing } from "./routing";

describe("i18n routing", () => {
  it("defaults to Hebrew and never prefixes a URL", () => {
    expect(routing.defaultLocale).toBe(LOCALES.he);
    expect(routing.localePrefix).toBe("never");
  });

  it("lays Hebrew out right to left and English left to right", () => {
    expect(localeDirection(LOCALES.he)).toBe("rtl");
    expect(localeDirection(LOCALES.en)).toBe("ltr");
  });

  it("narrows only the locales it knows", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it("resolves the cookie's locale, and Hebrew for anything else", () => {
    expect(resolveLocale("en")).toBe(LOCALES.en);
    expect(resolveLocale(undefined)).toBe(LOCALES.he);
    expect(resolveLocale("fr")).toBe(LOCALES.he);
  });
});
