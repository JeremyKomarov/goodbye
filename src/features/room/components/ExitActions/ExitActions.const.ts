/** The sheets the actions open, one at a time. */
export const EXIT_SHEETS = { calendar: "calendar", share: "share" } as const;
export type ExitSheet = (typeof EXIT_SHEETS)[keyof typeof EXIT_SHEETS];
