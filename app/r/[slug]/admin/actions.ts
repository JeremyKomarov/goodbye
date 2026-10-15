"use server";

import { tokenMatches } from "@/core/admin-token";
import { allSlots } from "@/core/slots";
import { getAdminClient } from "@/core/supabase/admin";
import type { Room } from "@/core/types";

export type AdminResult =
  { ok: true; room: Room } | { ok: false; error: string };

const DENIED_TEXT = "קישור הניהול לא תקין. בדקו שהעתקתם אותו במלואו";
const DENIED: AdminResult = { ok: false, error: DENIED_TEXT };
const FAILED: AdminResult = { ok: false, error: "הפעולה לא הצליחה. נסו שוב" };

async function authorize(slug: string, token: string) {
  if (
    typeof slug !== "string" ||
    typeof token !== "string" ||
    token.length < 20
  )
    return null;
  const db = getAdminClient();
  const { data: room } = await db
    .from("rooms")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!room) return null;
  const { data: secret } = await db
    .from("room_secrets")
    .select("admin_token_hash")
    .eq("room_id", room.id)
    .maybeSingle();
  if (!secret || !tokenMatches(token, secret.admin_token_hash)) return null;
  return { db, room: room as Room };
}

export async function getAdminRoom(
  slug: string,
  token: string,
): Promise<AdminResult> {
  const auth = await authorize(slug, token);
  return auth ? { ok: true, room: auth.room } : DENIED;
}

export async function lockVoting(
  slug: string,
  token: string,
): Promise<AdminResult> {
  const auth = await authorize(slug, token);
  if (!auth) return DENIED;
  const { data, error } = await auth.db.rpc("admin_lock_room", {
    p_room: auth.room.id,
  });
  return error || !data ? FAILED : { ok: true, room: data as Room };
}

export async function reopenVoting(
  slug: string,
  token: string,
  closesAtIso: string,
): Promise<AdminResult> {
  const auth = await authorize(slug, token);
  if (!auth) return DENIED;
  const closesAt = Date.parse(closesAtIso);
  if (Number.isNaN(closesAt) || closesAt < Date.now() + 60_000)
    return { ok: false, error: "זמן הסגירה צריך להיות בעתיד" };
  if (!allSlots(auth.room).some((s) => s.ms >= closesAt))
    return { ok: false, error: "אין שעות להצבעה אחרי הזמן הזה" };
  const { data, error } = await auth.db
    .from("rooms")
    .update({
      status: "voting",
      voting_closes_at: new Date(closesAt).toISOString(),
      locked_slot: null,
      exited_at: null,
    })
    .eq("id", auth.room.id)
    .select("*")
    .single();
  return error || !data ? FAILED : { ok: true, room: data as Room };
}

/**
 * The host left the group. Leaving during the vote locks no hour (nobody picked one
 * yet), so the verdict is "left mid-vote". Pressing again (a second tab, a double
 * tap) keeps the first exit time.
 */
export async function markExited(
  slug: string,
  token: string,
): Promise<AdminResult> {
  const auth = await authorize(slug, token);
  if (!auth) return DENIED;
  // The vote is over but no browser has locked the hour yet: lock it first.
  if (
    auth.room.status === "voting" &&
    Date.parse(auth.room.voting_closes_at) <= Date.now()
  ) {
    const { error } = await auth.db.rpc("admin_lock_room", {
      p_room: auth.room.id,
    });
    if (error) return FAILED;
  }
  const { data, error } = await auth.db
    .from("rooms")
    .update({ status: "exited", exited_at: new Date().toISOString() })
    .eq("id", auth.room.id)
    .neq("status", "exited")
    .select("*")
    .maybeSingle();
  if (error) return FAILED;
  return { ok: true, room: (data as Room | null) ?? auth.room };
}

/** Back to the countdown, or to the vote if the host had left in the middle of it. */
export async function undoExit(
  slug: string,
  token: string,
): Promise<AdminResult> {
  const auth = await authorize(slug, token);
  if (!auth) return DENIED;
  const { data, error } = await auth.db
    .from("rooms")
    .update({
      status: auth.room.locked_slot ? "locked" : "voting",
      exited_at: null,
    })
    .eq("id", auth.room.id)
    .eq("status", "exited")
    .select("*")
    .maybeSingle();
  if (error) return FAILED;
  return { ok: true, room: (data as Room | null) ?? auth.room };
}

export async function deleteWallMessage(
  slug: string,
  token: string,
  id: number,
): Promise<AdminResult> {
  const auth = await authorize(slug, token);
  if (!auth) return DENIED;
  const { error } = await auth.db
    .from("wall_messages")
    .delete()
    .eq("id", id)
    .eq("room_id", auth.room.id);
  return error ? FAILED : { ok: true, room: auth.room };
}

/**
 * Mark this browser's anonymous user as the room's host: the database then keeps
 * them out of the vote, reserves their name and badges their wall messages. Any
 * vote they cast before the room knew them is dropped.
 */
export async function claimHost(
  slug: string,
  token: string,
  accessToken: string,
): Promise<{ ok: boolean }> {
  const auth = await authorize(slug, token);
  if (!auth || typeof accessToken !== "string") return { ok: false };
  const { data, error } = await auth.db.auth.getUser(accessToken);
  if (error || !data.user) return { ok: false };
  const userId = data.user.id;
  const { error: hostError } = await auth.db
    .from("room_hosts")
    .upsert(
      { room_id: auth.room.id, user_id: userId },
      { onConflict: "room_id,user_id", ignoreDuplicates: true },
    );
  if (hostError) return { ok: false };
  await auth.db
    .from("votes")
    .delete()
    .eq("room_id", auth.room.id)
    .eq("user_id", userId);
  return { ok: true };
}

export type PlayerCode = { userId: string; name: string; code: string | null };
export type PlayerCodesResult =
  { ok: true; players: PlayerCode[] } | { ok: false; error: string };

/** Everyone in the room except the host, with the code for their other devices. */
export async function listPlayerCodes(
  slug: string,
  token: string,
): Promise<PlayerCodesResult> {
  const auth = await authorize(slug, token);
  if (!auth) return { ok: false, error: DENIED_TEXT };
  const [{ data: players, error }, { data: hosts }] = await Promise.all([
    auth.db
      .from("players")
      .select("user_id, display_name")
      .eq("room_id", auth.room.id)
      .order("created_at"),
    auth.db.from("room_hosts").select("user_id").eq("room_id", auth.room.id),
  ]);
  if (error || !players)
    return { ok: false, error: "לא הצלחנו לטעון את השחקנים. נסו שוב" };
  const hostIds = new Set((hosts ?? []).map((h) => h.user_id as string));
  const guests = players.filter((p) => !hostIds.has(p.user_id as string));
  const { data: codes } = guests.length
    ? await auth.db
        .from("login_codes")
        .select("user_id, code")
        .in(
          "user_id",
          guests.map((p) => p.user_id),
        )
    : { data: [] };
  const byUser = new Map(
    (codes ?? []).map((c) => [c.user_id as string, c.code as string]),
  );
  return {
    ok: true,
    players: guests.map((p) => ({
      userId: p.user_id as string,
      name: p.display_name as string,
      code: byUser.get(p.user_id as string) ?? null,
    })),
  };
}
