import { describe, expect, it } from "vitest";
import type { GameRecord } from "@/shared/types/records.types";
import { beats, champions, placeOf, rankRecords } from "./records";

const record = (game: GameRecord["game"], userId: string, score: number): GameRecord => ({
  game,
  userId,
  name: userId,
  score,
});

const records = [
  record("runaway", "a", 3000),
  record("runaway", "b", 1200),
  record("trivia", "a", 700),
  record("trivia", "c", 900),
  record("catch", "b", -40),
];

describe("records", () => {
  it("ranks a timed game by the lowest score, the others by the highest", () => {
    expect(rankRecords(records, "runaway").map((r) => r.userId)).toEqual(["b", "a"]);
    expect(rankRecords(records, "trivia").map((r) => r.userId)).toEqual(["c", "a"]);
    expect(beats("runaway", 1000, 1200)).toBe(true);
    expect(beats("catch", -50, -40)).toBe(false);
  });

  it("names each game's champion, skipping games nobody played", () => {
    expect(champions(records).map((r) => `${r.game}:${r.userId}`)).toEqual([
      "runaway:b",
      "trivia:c",
      "catch:b",
    ]);
  });

  it("places a new score against everyone else's best", () => {
    expect(placeOf(records, "trivia", "a", 1000)).toEqual({ isBest: true, rank: 1, total: 2 });
    expect(placeOf(records, "trivia", "a", 100)).toEqual({ isBest: false, rank: 2, total: 2 });
    expect(placeOf(records, "picture", "a", 0)).toEqual({ isBest: true, rank: 1, total: 1 });
    expect(placeOf(records, "runaway", "c", 2000)).toEqual({ isBest: true, rank: 2, total: 3 });
  });
});
