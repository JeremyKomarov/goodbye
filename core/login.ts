// A player's code lets them be the same player on another device. Behind it is an
// email + password login on their (otherwise anonymous) user. The address is never
// mailed: ".invalid" can't receive mail.

const DOMAIN = "players.invalid";

export function loginEmail(userId: string) {
  return `${userId}@${DOMAIN}`;
}

/** What was typed, as a code: " k7p 2qx " -> "K7P2QX". */
export function normalizeCode(input: string) {
  return input.toUpperCase().replace(/[^0-9A-Z]/g, "");
}

/** Case and extra spaces don't make a different name (like norm_name in SQL). */
export function sameName(a: string, b: string) {
  const norm = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();
  return norm(a) === norm(b);
}

// Each device keeps its player's code (once the server has it), to show it again.
const key = (userId: string) => `exit-login:${userId}`;

export function saveLoginCode(userId: string, code: string) {
  try {
    localStorage.setItem(key(userId), code);
  } catch {}
}

export function loadLoginCode(userId: string) {
  try {
    return localStorage.getItem(key(userId));
  } catch {
    return null;
  }
}
