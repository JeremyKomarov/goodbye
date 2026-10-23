// Satori — what draws the link previews — lays text out left to right with no bidi support, so a
// line is put into visual order here. Keep each line short: wrapping would break the order. Ported
// from the original's core/bidi.ts, with the English card's Hebrew names added.

// What a left-to-right run inside Hebrew holds: letters, digits, and the punctuation between them.
const LTR_RUN = /[0-9A-Za-z:.,'׳?!()\-–—&/+#@\s]*[0-9A-Za-z][0-9A-Za-z:.,'׳\-–—&/+#@\s]*/g;
const HEBREW_RUN = /[֐-׿](?:[֐-׿\s'׳"״\-]*[֐-׿])?/g;

const reverse = (text: string) => Array.from(text).reverse().join("");

/**
 * A Hebrew line in visual order: reversed, then each run of digits and Latin flipped back, while
 * punctuation at a run's edges ("ב-14:00", "(Bob)") stays where the reversal put it.
 */
export function visualRtl(line: string): string {
  return reverse(line).replace(LTR_RUN, (run) => {
    const core = run.match(/[0-9A-Za-z](?:.*[0-9A-Za-z])?/);
    if (!core || core.index === undefined) return run;
    const start = core.index;
    const end = start + core[0].length;
    return run.slice(0, start) + reverse(core[0]) + run.slice(end);
  });
}

/** An English line in visual order: only its Hebrew runs — a name, a group — are reversed. */
export function visualLtr(line: string): string {
  return line.replace(HEBREW_RUN, reverse);
}
