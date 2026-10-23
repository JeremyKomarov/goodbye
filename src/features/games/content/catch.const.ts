// The Catch game's notifications: what each kind is worth, and how often it falls (the weights
// add up to 1). Their words are in CatchGame's strings, under the kind's name.

export const CATCH_SECONDS = 30;

export const NOTICE_KINDS = {
  message: "message",
  flower: "flower",
  boss: "boss",
  exit: "exit",
} as const;

export type NoticeKind = (typeof NOTICE_KINDS)[keyof typeof NOTICE_KINDS];

export const NOTICES: Record<NoticeKind, { points: number; weight: number }> = {
  message: { points: 10, weight: 0.55 },
  flower: { points: 15, weight: 0.2 },
  boss: { points: -30, weight: 0.18 },
  exit: { points: 50, weight: 0.07 },
};
