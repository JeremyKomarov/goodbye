import { STORAGE_KEYS } from "@/core/constants/storage-keys.const";

// The exit whose finale this browser has watched, by the time of the exit — so a host who undoes
// the exit and leaves again plays it once more. Silent where storage refuses.

export function loadFinaleSeen(slug: string): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.finaleSeen(slug));
  } catch {
    return null;
  }
}

export function saveFinaleSeen(slug: string, exitedAt: number) {
  try {
    localStorage.setItem(STORAGE_KEYS.finaleSeen(slug), String(exitedAt));
  } catch {}
}
