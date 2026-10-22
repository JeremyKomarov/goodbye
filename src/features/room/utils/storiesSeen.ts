import { STORAGE_KEYS } from "@/core/constants/storage-keys.const";

// The story groups this browser has watched to the end, so their rings go grey — kept in
// localStorage, read through `useSyncExternalStore`. Silent where storage refuses.

const listeners = new Set<() => void>();
let cache: string | null = null;

export function readSeen(): string {
  if (cache === null) {
    try {
      cache = localStorage.getItem(STORAGE_KEYS.storiesSeen) ?? "";
    } catch {
      cache = "";
    }
  }
  return cache;
}

export function markSeen(groupId: string) {
  const ids = new Set(readSeen().split(",").filter(Boolean));
  if (ids.has(groupId)) return;
  ids.add(groupId);
  cache = [...ids].join(",");
  try {
    localStorage.setItem(STORAGE_KEYS.storiesSeen, cache);
  } catch {}
  listeners.forEach((listener) => listener());
}

export function subscribeSeen(listener: () => void) {
  listeners.add(listener);
  return () => void listeners.delete(listener);
}
