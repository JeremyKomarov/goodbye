// Every key this app writes to the browser's storage. The admin key is the original app's, so a
// host who opened a room there still finds their admin link here (docs/DECISIONS.md #1).
export const STORAGE_KEYS = {
  adminToken: (slug: string) => `exit-admin:${slug}`,
} as const;
