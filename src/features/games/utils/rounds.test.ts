import { describe, expect, it } from "vitest";
import { NOTICE_KINDS, NOTICES } from "@/features/games/content/catch.const";
import { PICTURE_ROUND, PICTURES } from "@/features/games/content/pictures.const";
import {
  RIGHT_POINTS, SPEED_POINTS, TRIVIA_ROUND, TRIVIA_SECONDS,
} from "@/features/games/content/trivia.const";
import { SCORE_RANGES } from "@/core/constants/games.const";
import { dealPictures, pickNoticeKind, triviaPoints } from "./rounds";

/** A fixed sequence for `random`, repeated. */
const sequence = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};

describe("triviaPoints", () => {
  const all = TRIVIA_SECONDS * 1000;

  it("gives nothing for a wrong answer, however quick", () => {
    expect(triviaPoints(false, all)).toBe(0);
  });

  it("gives the full speed bonus at once, none at the buzzer, half at half time", () => {
    expect(triviaPoints(true, all)).toBe(RIGHT_POINTS + SPEED_POINTS);
    expect(triviaPoints(true, 0)).toBe(RIGHT_POINTS);
    expect(triviaPoints(true, all / 2)).toBe(RIGHT_POINTS + SPEED_POINTS / 2);
  });

  it("holds to the bounds if the clock is past its deadline or ahead of it", () => {
    expect(triviaPoints(true, -500)).toBe(RIGHT_POINTS);
    expect(triviaPoints(true, all * 2)).toBe(RIGHT_POINTS + SPEED_POINTS);
  });

  it("can't make a perfect round score more than the database takes", () => {
    expect(TRIVIA_ROUND * triviaPoints(true, all)).toBeLessThanOrEqual(SCORE_RANGES.trivia.max);
  });
});

describe("dealPictures", () => {
  it("deals a round of different pictures with exactly one honest", () => {
    const { cards } = dealPictures(new Set());
    expect(cards).toHaveLength(PICTURE_ROUND);
    expect(new Set(cards.map((c) => c.puzzle.id)).size).toBe(PICTURE_ROUND);
    expect(cards.filter((c) => c.honest)).toHaveLength(1);
  });

  it("deals pictures not seen lately before seen ones", () => {
    const seen = new Set(PICTURES.slice(0, PICTURE_ROUND).map((p) => p.id));
    const { cards } = dealPictures(seen);
    for (const card of cards) expect(seen.has(card.puzzle.id)).toBe(false);
  });

  it("adds the round to what is seen", () => {
    const { cards, seen } = dealPictures(new Set());
    for (const card of cards) expect(seen.has(card.puzzle.id)).toBe(true);
  });

  it("starts the cycle over once every picture has had its turn", () => {
    const almostAll = new Set(PICTURES.slice(PICTURE_ROUND).map((p) => p.id));
    const { cards, seen } = dealPictures(almostAll);
    expect(seen.size).toBe(PICTURE_ROUND);
    expect([...seen].sort()).toEqual(cards.map((c) => c.puzzle.id).sort());
  });

  it("puts the honest one wherever `random` says", () => {
    const { cards } = dealPictures(new Set(), sequence(0.99));
    expect(cards.findIndex((c) => c.honest)).toBe(PICTURE_ROUND - 1);
  });
});

describe("pickNoticeKind", () => {
  it("falls through the kinds by weight", () => {
    expect(pickNoticeKind(0)).toBe(NOTICE_KINDS.message);
    expect(pickNoticeKind(NOTICES.message.weight + 0.01)).toBe(NOTICE_KINDS.flower);
    expect(pickNoticeKind(0.999)).toBe(NOTICE_KINDS.exit);
  });

  it("has weights that add up to one, so the last kind can fall", () => {
    const total = Object.values(NOTICES).reduce((sum, notice) => sum + notice.weight, 0);
    expect(total).toBeCloseTo(1);
  });
});
