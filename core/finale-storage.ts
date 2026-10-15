// The finale plays by itself once per browser (per exit); after that it's a button away.
const key = (slug: string) => `exit-finale:${slug}`;

export function saveFinaleSeen(slug: string, exitedAt: string) {
  try {
    localStorage.setItem(key(slug), exitedAt);
  } catch {}
}

export function loadFinaleSeen(slug: string) {
  try {
    return localStorage.getItem(key(slug));
  } catch {
    return null;
  }
}
