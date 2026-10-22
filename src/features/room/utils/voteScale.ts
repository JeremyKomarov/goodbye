// How the heatmap shades an hour, and how many hour chips go in a row. Ported from the original's
// features/room/content/voteScale.ts; the colours are the `--vote-*` tokens.

/** Shades from fewest to most votes: `--vote-1` … `--vote-5`. */
export const VOTE_STEPS = 5;
/** From this step (0-based) the shade is light enough to need dark text. */
export const DARK_TEXT_FROM = 3;

/** The shade for `count` votes when the busiest hour has `max`: -1 for none, else 0…4. */
export function voteStep(count: number, max: number): number {
  if (count === 0 || max === 0) return -1;
  return Math.min(VOTE_STEPS - 1, Math.ceil((count / max) * VOTE_STEPS) - 1);
}

/** Columns for `n` chips, from `min` to `max`: the fewest rows, then the fullest last row. */
export function columns(n: number, min: number, max: number): number {
  let best = Math.max(1, Math.min(n, min));
  for (let c = best + 1; c <= Math.min(n, max); c++) {
    const rows = Math.ceil(n / c);
    const bestRows = Math.ceil(n / best);
    const fill = (n % c || c) / c;
    const bestFill = (n % best || best) / best;
    if (rows < bestRows || (rows === bestRows && fill > bestFill)) best = c;
  }
  return best;
}
