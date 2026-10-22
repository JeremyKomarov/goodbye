import { STORAGE_KEYS } from "@/core/constants/storage-keys.const";

// A player's login code, kept on each device once the server has handed it over, so the "you in
// the room" sheet shows it without asking again. Silent where storage refuses, like adminTokens.

export function saveLoginCode(userId: string, code: string) {
  try {
    localStorage.setItem(STORAGE_KEYS.loginCode(userId), code);
  } catch {}
}

export function loadLoginCode(userId: string): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.loginCode(userId));
  } catch {
    return null;
  }
}
