// A goodbye stays long enough to read: a beat, and then by its length.
export const REPLAY_BASE_MS = 2500;
export const REPLAY_PER_CHAR_MS = 45;
export const REPLAY_MAX_MS = 8000;
/** Past this many goodbyes the bars would be slivers: one bar, and the counter says where. */
export const REPLAY_BARS_MAX = 30;
/** Up to this many characters, a goodbye is set large. */
export const REPLAY_SHORT_CHARS = 60;

export function replayMs(body: string) {
  return Math.min(REPLAY_MAX_MS, REPLAY_BASE_MS + body.length * REPLAY_PER_CHAR_MS);
}
