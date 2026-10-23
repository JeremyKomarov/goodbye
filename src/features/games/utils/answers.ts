// Forgiving matching for a typed guess, in Hebrew or English.

const NIQQUD = /[֑-ׇ]/g;
const FINALS: Record<string, string> = { ך: "כ", ם: "מ", ן: "נ", ף: "פ", ץ: "צ" };

/** Lowercase, strip niqqud and punctuation, unify Hebrew final letters, collapse spaces. */
export function normalize(text: string): string {
  return text
    .normalize("NFC")
    .replace(NIQQUD, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[ךםןףץ]/g, (c) => FINALS[c]);
}

function editDistance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = above;
    }
  }
  return row[b.length];
}

/**
 * Whether the guess is one of the answers. Ignores a leading Hebrew definite article ("הבננה"),
 * spacing and punctuation, and forgives a typo in a longer word (two in a long one).
 */
export function matches(input: string, answers: readonly string[]): boolean {
  const guess = normalize(input);
  if (!guess) return false;
  const guesses = new Set([guess, guess.replace(/ /g, "")]);
  if (guess.startsWith("ה") && guess.length >= 3) guesses.add(guess.slice(1));

  return answers.some((answer) => {
    const target = normalize(answer);
    const compact = target.replace(/ /g, "");
    const tolerance = compact.length >= 7 ? 2 : compact.length >= 4 ? 1 : 0;
    for (const g of guesses) {
      if (g === target || g === compact) return true;
      if (tolerance && editDistance(g.replace(/ /g, ""), compact) <= tolerance) return true;
    }
    return false;
  });
}
