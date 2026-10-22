import { describe, expect, it } from "vitest";
import { pad, splitCountdown } from "./countdown";

describe("splitCountdown", () => {
  it("splits a duration into its units", () => {
    expect(splitCountdown(((1 * 24 + 2) * 3600 + 3 * 60 + 4) * 1000 + 999)).toEqual({
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: 4,
    });
  });

  it("stops at zero once the moment has passed", () => {
    expect(splitCountdown(-5000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it("pads to two digits", () => {
    expect([pad(7), pad(42)]).toEqual(["07", "42"]);
  });
});
