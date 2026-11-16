// The few token values needed where the stylesheet can't reach: the browser's theme colour, the
// installed app's manifest and the link preview card, which is drawn without CSS. Each is the
// value of the token it is named after, in core/styles/tokens.scss — `token-values.const.test.ts`
// fails if one parts from it. Add a token here only for a place that can't read `var(--…)`.
export const TOKEN_VALUES = {
  "neutral-950": "#0b141a",
  "neutral-900": "#111b21",
  "neutral-800": "#202c33",
  "neutral-100": "#e9edef",
  "accent-pill": "#ffd279",
  "accent-exit": "#f15c6d",
} as const;
