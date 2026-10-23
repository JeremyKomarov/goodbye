/** A shuffled copy (Fisher–Yates); `random` is `Math.random` unless a test fixes it. */
export function shuffle<T>(list: readonly T[], random: () => number = Math.random): T[] {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
