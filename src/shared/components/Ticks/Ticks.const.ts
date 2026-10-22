export const TICK_STATES = {
  sent: "sent",
  delivered: "delivered",
  read: "read",
} as const;

export type TickState = (typeof TICK_STATES)[keyof typeof TICK_STATES];
