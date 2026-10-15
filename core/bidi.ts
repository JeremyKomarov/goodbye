/**
 * Satori lays text out left-to-right with no bidi support, so Hebrew lines are
 * reversed into visual order here. Runs of digits and Latin are flipped back,
 * while punctuation at a run's edges ("ב-14:00", "(Bob)") stays where the
 * reversal put it. Keep each line short: wrapping would break the visual order.
 */
export function visualRtl(line: string) {
  const reversed = Array.from(line).reverse().join("");
  return reversed.replace(
    /[0-9A-Za-z:.,'׳?!()\-\s]*[0-9A-Za-z][0-9A-Za-z:.,'׳\-]*/g,
    (run) => {
      const core = run.match(/[0-9A-Za-z](?:.*[0-9A-Za-z])?/);
      if (!core) return run;
      const start = core.index!;
      const end = start + core[0].length;
      return (
        run.slice(0, start) +
        Array.from(core[0]).reverse().join("") +
        run.slice(end)
      );
    },
  );
}
