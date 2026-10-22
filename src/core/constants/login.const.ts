// A player's login code: it lets them be the same player on another device. Behind it is an email
// and password login on their otherwise anonymous user — the server sets the code as the password,
// the browser signs in with it. The address is never mailed: ".invalid" can't receive mail. The
// domain is the original app's, so its players' codes still work (docs/DECISIONS.md #1).

const LOGIN_EMAIL_DOMAIN = "players.invalid";

/** No 0/O or 1/I/L: a code is read off one screen and typed on another. */
export const LOGIN_CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
export const LOGIN_CODE_LENGTH = 6;

export function loginEmail(userId: string): string {
  return `${userId}@${LOGIN_EMAIL_DOMAIN}`;
}

/** What was typed, as a code: " k7p 2qx " → "K7P2QX". */
export function normalizeLoginCode(input: string): string {
  return input.toUpperCase().replace(/[^0-9A-Z]/g, "");
}
