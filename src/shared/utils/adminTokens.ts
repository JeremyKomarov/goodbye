import { STORAGE_KEYS } from "@/core/constants/storage-keys.const";

// The host's admin token, kept in their browser so the room can link to its admin page. Storage
// can be missing or refuse (private mode, blocked site data); then the token is simply not kept.

export function saveAdminToken(slug: string, token: string) {
  try {
    localStorage.setItem(STORAGE_KEYS.adminToken(slug), token);
  } catch {}
}

export function loadAdminToken(slug: string): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.adminToken(slug));
  } catch {
    return null;
  }
}

export function forgetAdminToken(slug: string) {
  try {
    localStorage.removeItem(STORAGE_KEYS.adminToken(slug));
  } catch {}
}
