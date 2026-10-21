import { describe, expect, it } from "vitest";
import { classMap, NO_CLASS } from "./classMap";

describe("classMap", () => {
  it("returns the map unchanged when every class exists", () => {
    const map = { root: "x_root", tone: { quiet: "x_quiet", plain: NO_CLASS } };
    expect(classMap("X", map)).toBe(map);
  });

  it("throws naming the component and the nested key that has no rule", () => {
    expect(() => classMap("Badge", { root: "a", tone: { loud: undefined } })).toThrow(
      'Badge: class "tone.loud" has no rule in its stylesheet',
    );
  });
});
