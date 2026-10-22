import { describe, expect, it } from "vitest";
import { exactParts, roughPart } from "./duration";

const MIN = 60_000;

describe("exactParts", () => {
  it("pairs the two largest units and drops a zero", () => {
    expect(exactParts((2 * 1440 + 3 * 60) * MIN)).toEqual([
      { unit: "days", count: 2 },
      { unit: "hours", count: 3 },
    ]);
    expect(exactParts(1440 * MIN)).toEqual([{ unit: "days", count: 1 }]);
    expect(exactParts(65 * MIN)).toEqual([
      { unit: "hours", count: 1 },
      { unit: "minutes", count: 5 },
    ]);
  });

  it("is empty under a minute, and reads a negative duration as its size", () => {
    expect(exactParts(20_000)).toEqual([]);
    expect(exactParts(-17 * MIN)).toEqual([{ unit: "minutes", count: 17 }]);
  });
});

describe("roughPart", () => {
  it("keeps to one unit", () => {
    expect(roughPart(75 * MIN)).toEqual({ unit: "minutes", count: 75 });
    expect(roughPart(33 * 60 * MIN)).toEqual({ unit: "hours", count: 33 });
    expect(roughPart(50 * 60 * MIN)).toEqual({ unit: "days", count: 2 });
    expect(roughPart(10_000)).toBeNull();
  });
});
