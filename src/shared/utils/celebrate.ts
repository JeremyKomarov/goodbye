// The confetti, in the room's own colours, read from the tokens: a burst for a new room record,
// and a bigger one from three sides for the finale. Loaded on first use; nothing falls for a reader
// who asked for reduced motion.
const COLOUR_TOKENS = ["--accent-exit", "--accent-pill", "--brand-500"];

export const CELEBRATIONS = { record: "record", finale: "finale" } as const;
export type Celebration = (typeof CELEBRATIONS)[keyof typeof CELEBRATIONS];

// The finale's side bursts follow the first one, a beat apart.
const SIDE_DELAYS_MS = [350, 550];

// canvas-confetti's default instance draws in a web worker made from a `blob:` URL, which the CSP
// refuses (no `worker-src`, docs/DECISIONS.md #16). One instance of our own draws on the page.
let cannon: import("canvas-confetti").CreateTypes | undefined;

export async function celebrate(kind: Celebration = CELEBRATIONS.record) {
  if (!cannon) {
    const { create } = await import("canvas-confetti");
    cannon = create(undefined, { resize: true, useWorker: false });
  }
  const confetti = cannon;
  const style = getComputedStyle(document.documentElement);
  const colors = COLOUR_TOKENS.map((token) => style.getPropertyValue(token).trim());
  const fire = (options: Parameters<typeof confetti>[0]) =>
    void confetti({ colors, disableForReducedMotion: true, ...options });

  if (kind === CELEBRATIONS.record) {
    fire({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    return;
  }
  fire({ particleCount: 140, spread: 80, origin: { y: 0.35 } });
  setTimeout(() => fire({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.6 } }),
    SIDE_DELAYS_MS[0]);
  setTimeout(() => fire({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.6 } }),
    SIDE_DELAYS_MS[1]);
}
