/** `in` is someone else's message, on the start side; `out` is yours, on the end side. */
export const BUBBLE_SIDES = {
  in: "in",
  out: "out",
} as const;

export type BubbleSide = (typeof BUBBLE_SIDES)[keyof typeof BUBBLE_SIDES];
