// A person's avatar: the first letter of their name on their sender colour. Ported from the
// original's core/colors.ts; the colours are tokens now (`--sender-*` in tokens.scss).

const SENDER_COLORS = [
  "var(--sender-orange)",
  "var(--sender-blue)",
  "var(--sender-olive)",
  "var(--sender-pink)",
  "var(--sender-yellow)",
  "var(--sender-violet)",
  "var(--sender-green)",
  "var(--sender-coral)",
] as const;

/** The same colour for the same id, every time, on every screen. */
export function senderColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return SENDER_COLORS[Math.abs(hash) % SENDER_COLORS.length];
}

/** The first character of a name — a whole grapheme's first code point, so not half an emoji. */
export function initialOf(name: string): string {
  return Array.from(name.trim())[0] ?? "?";
}
