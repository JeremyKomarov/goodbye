import { describe, expect, it } from "vitest";
import { columns, voteStep } from "./voteScale";

describe("voteStep", () => {
  it("is -1 for an hour nobody picked", () => {
    expect(voteStep(0, 4)).toBe(-1);
    expect(voteStep(0, 0)).toBe(-1);
  });

  it("gives the busiest hour the brightest shade, and spreads the rest below it", () => {
    expect(voteStep(4, 4)).toBe(4);
    expect(voteStep(1, 4)).toBe(1);
    expect(voteStep(1, 10)).toBe(0);
  });
});

describe("columns", () => {
  it("prefers fewer rows, then a fuller last row", () => {
    expect(columns(13, 4, 5)).toBe(5); // 3 rows either way; 5 leaves 3 in the last, 4 leaves 1
    expect(columns(12, 4, 5)).toBe(4); // 3 full rows
    expect(columns(24, 5, 6)).toBe(6); // 4 full rows
  });

  it("never asks for more columns than chips", () => {
    expect(columns(2, 4, 8)).toBe(2);
  });
});
