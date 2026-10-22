export const COUNTDOWN_TONES = { plain: "plain", overtime: "overtime" } as const;
export type CountdownTone = (typeof COUNTDOWN_TONES)[keyof typeof COUNTDOWN_TONES];
