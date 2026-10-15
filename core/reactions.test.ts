import { describe, expect, it } from "vitest";
import { mostLoved, reactionCounts, withReaction } from "@/core/reactions";
import type { WallMessage } from "@/core/types";

const message = (id: number): WallMessage => ({
  id,
  room_id: "r",
  user_id: `u${id}`,
  display_name: `n${id}`,
  body: `b${id}`,
  created_at: "2026-11-09T12:00:00Z",
});

describe("reactionCounts", () => {
  it("counts each emoji, most used first", () => {
    expect(reactionCounts({ a: "😂", b: "❤️", c: "😂" })).toEqual([
      { emoji: "😂", count: 2 },
      { emoji: "❤️", count: 1 },
    ]);
    expect(reactionCounts(undefined)).toEqual([]);
  });
});

describe("mostLoved", () => {
  it("finds the message with the most reactions, earliest on a tie", () => {
    const messages = [message(1), message(2), message(3)];
    expect(mostLoved(messages, { 2: { a: "❤️" }, 3: { a: "❤️" } })?.message.id).toBe(2);
    expect(mostLoved(messages, { 3: { a: "❤️", b: "🔥" } })).toMatchObject({ count: 2 });
    expect(mostLoved(messages, {})).toBeNull();
  });
});

describe("withReaction", () => {
  it("sets, replaces and removes one person's reaction", () => {
    const set = withReaction({}, 1, "a", "❤️");
    expect(set).toEqual({ 1: { a: "❤️" } });
    expect(withReaction(set, 1, "a", "😂")).toEqual({ 1: { a: "😂" } });
    expect(withReaction(set, 1, "a", undefined)).toEqual({ 1: {} });
    expect(withReaction(set, 1, "a", "❤️")).toBe(set);
  });
});
