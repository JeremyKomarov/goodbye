import type { triviaStrings } from "@/features/games/strings/trivia.strings";

// Trivia: a round is ten of the questions, fifteen seconds each; a right answer is worth 100, and
// up to 50 more the faster it came. The questions' words are in strings/trivia.strings.ts.

export const TRIVIA_ROUND = 10;
export const TRIVIA_SECONDS = 15;
export const RIGHT_POINTS = 100;
export const SPEED_POINTS = 50;

export const OPTIONS = ["a", "b", "c", "d"] as const;

export type QuestionId = keyof typeof triviaStrings;
export type OptionId = (typeof OPTIONS)[number];

/** The right option of each question. */
export const ANSWERS: Record<QuestionId, OptionId> = {
  q01: "b",
  q02: "c",
  q03: "c",
  q04: "a",
  q05: "b",
  q06: "c",
  q07: "a",
  q08: "b",
  q09: "b",
  q10: "b",
  q11: "a",
  q12: "b",
  q13: "b",
  q14: "c",
  q15: "b",
  q16: "b",
  q17: "c",
  q18: "a",
  q19: "b",
  q20: "b",
  q21: "a",
  q22: "a",
  q23: "a",
  q24: "a",
  q25: "a",
  q26: "c",
};
