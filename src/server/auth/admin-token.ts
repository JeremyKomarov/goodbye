import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

// The host's admin link carries a random token; only its SHA-256 is stored, in room_secrets.

/** 24 random bytes, base64url: 32 characters that survive a URL and a copy-paste. */
export function newAdminToken() {
  return randomBytes(24).toString("base64url");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/** Constant-time, so a wrong token takes as long to reject as a nearly right one. */
export function tokenMatches(token: string, hash: string) {
  const a = Buffer.from(hashToken(token), "hex");
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
