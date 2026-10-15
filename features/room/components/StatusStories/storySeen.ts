const SEEN_KEY = "exit-stories-seen";

const listeners = new Set<() => void>();
let cache: string | null = null;

export function readSeen() {
  if (cache === null) {
    try {
      cache = localStorage.getItem(SEEN_KEY) ?? "";
    } catch {
      cache = "";
    }
  }
  return cache;
}

export function markSeen(id: string) {
  const ids = new Set(readSeen().split(",").filter(Boolean));
  ids.add(id);
  cache = [...ids].join(",");
  try {
    localStorage.setItem(SEEN_KEY, cache);
  } catch {}
  listeners.forEach((listener) => listener());
}

export function subscribeSeen(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function storyRing(seen: boolean, color = "var(--color-signal)") {
  return seen
    ? "var(--color-line)"
    : `conic-gradient(var(--color-signal), ${color}, var(--color-signal))`;
}
