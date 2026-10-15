// One hue, brighter with more votes (dark mode flips the light->dark anchor).
export const RAMP = [
  "oklch(0.36 0.06 168)",
  "oklch(0.45 0.09 166)",
  "oklch(0.54 0.12 164)",
  "oklch(0.63 0.14 162)",
  "oklch(0.72 0.16 160)",
];
export const DARK_TEXT_FROM = 3; // steps 4–5 are light enough to need dark text

export function step(count: number, max: number) {
  if (count === 0 || max === 0) return -1;
  return Math.min(RAMP.length - 1, Math.ceil((count / max) * RAMP.length) - 1);
}

/** Columns for `n` hour chips: as few rows as possible, then the fullest last row. */
export function columns(n: number, min: number, max: number) {
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
