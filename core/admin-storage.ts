// The host's admin token is kept in their browser so the room can link to the admin page.
const key = (slug: string) => `exit-admin:${slug}`;

export function saveAdminToken(slug: string, token: string) {
  try {
    localStorage.setItem(key(slug), token);
  } catch {}
}

export function loadAdminToken(slug: string) {
  try {
    return localStorage.getItem(key(slug));
  } catch {
    return null;
  }
}

export function forgetAdminToken(slug: string) {
  try {
    localStorage.removeItem(key(slug));
  } catch {}
}
