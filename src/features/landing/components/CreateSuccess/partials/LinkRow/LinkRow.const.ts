/** `plain` for a link to share; `secret` for one to keep — set in the pill's warning yellow. */
export const LINK_ROW_TONES = {
  plain: "plain",
  secret: "secret",
} as const;

export type LinkRowTone = (typeof LINK_ROW_TONES)[keyof typeof LINK_ROW_TONES];
