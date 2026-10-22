export const SYSTEM_PILL_TONES = {
  default: "default",
  highlight: "highlight",
} as const;

export type SystemPillTone = (typeof SYSTEM_PILL_TONES)[keyof typeof SYSTEM_PILL_TONES];
