import { describe, expect, expectTypeOf, it } from "vitest";
import { keysOf } from "./keysOf";

const strings = {
  eyebrow: "Room",
  steps: { reason: { label: "Why" }, schedule: { label: "When" } },
} as const;

describe("keysOf", () => {
  it("maps every leaf to its dotted path", () => {
    expect(keysOf(strings)).toEqual({
      eyebrow: "eyebrow",
      steps: { reason: { label: "steps.reason.label" }, schedule: { label: "steps.schedule.label" } },
    });
  });

  it("types each key as its literal path", () => {
    expectTypeOf(keysOf(strings).steps.reason.label).toEqualTypeOf<"steps.reason.label">();
  });
});
