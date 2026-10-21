import { describe, expect, it } from "vitest";
import { ICON_NAMES, ICONS, MIRRORED_ICONS } from "./Icon.const";

describe("ICON_NAMES", () => {
  it("names every icon in the map, and only those", () => {
    expect(Object.keys(ICON_NAMES)).toEqual(Object.keys(ICONS));
    for (const [key, value] of Object.entries(ICON_NAMES)) expect(value).toBe(key);
  });

  it("mirrors only icons that exist", () => {
    for (const name of MIRRORED_ICONS) expect(ICONS).toHaveProperty(name);
  });
});
