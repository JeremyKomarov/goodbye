// The confetti for a new room record, in the room's own colours, read from the tokens. Loaded on
// the first record only; nothing falls for a reader who asked for reduced motion.
const COLOUR_TOKENS = ["--accent-exit", "--accent-pill", "--brand-500"];

export async function celebrate() {
  const { default: confetti } = await import("canvas-confetti");
  const style = getComputedStyle(document.documentElement);
  void confetti({
    particleCount: 90,
    spread: 70,
    origin: { y: 0.6 },
    colors: COLOUR_TOKENS.map((token) => style.getPropertyValue(token).trim()),
    disableForReducedMotion: true,
  });
}
