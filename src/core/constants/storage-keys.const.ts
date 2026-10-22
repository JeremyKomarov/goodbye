// Every key this app writes to the browser's storage. The keys are the original app's, so a host
// or a player from there is still recognised here (docs/DECISIONS.md #1).
export const STORAGE_KEYS = {
  adminToken: (slug: string) => `exit-admin:${slug}`,
  // The anonymous session. The original's key too, so a returning visitor is still themselves.
  supabaseAuth: "exit-party-auth",
  // A player's login code, kept on each device once the server has it, to show it again.
  loginCode: (userId: string) => `exit-login:${userId}`,
} as const;
