import { describe, expect, it } from "vitest";
import { reactionCounts, withReaction } from "./reactions";

describe("reactionCounts", () => {
  it("counts each emoji, most used first, ties in picker order", () => {
    expect(reactionCounts({ a: "😂", b: "❤️", c: "😂", d: "🔥" })).toEqual([
      { emoji: "😂", count: 2 },
      { emoji: "❤️", count: 1 },
      { emoji: "🔥", count: 1 },
    ]);
    expect(reactionCounts(undefined)).toEqual([]);
  });
});

describe("withReaction", () => {
  it("sets, changes and removes one person's reaction, leaving the rest", () => {
    const set = withReaction({}, 1, "a", "❤️");
    expect(set).toEqual({ 1: { a: "❤️" } });
    const changed = withReaction({ 1: { a: "❤️", b: "😂" } }, 1, "a", "🔥");
    expect(changed).toEqual({ 1: { a: "🔥", b: "😂" } });
    expect(withReaction(changed, 1, "a", null)).toEqual({ 1: { b: "😂" } });
  });

  it("hands back the same map when nothing changes", () => {
    const map = { 1: { a: "❤️" as const } };
    expect(withReaction(map, 1, "a", "❤️")).toBe(map);
  });
});
