import "server-only";
import { customAlphabet } from "nanoid";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import {
  ROOM_STATUSES, type HostGender, type LeaveReason, type RoomStatus,
} from "@/core/constants/room.const";
import type { Locale } from "@/core/i18n/routing";
import { db } from "./client";

// Rooms and their secrets. The table is `public.rooms`; the admin token's hash sits apart in
// `public.room_secrets`, which no client role can read (supabase/migrations/…_init.sql).

export interface RoomRecord {
  id: string;
  slug: string;
  hostName: string;
  hostGender: HostGender;
  groupName: string;
  reason: LeaveReason | null;
  timezone: string;
  windowStart: string;
  windowEnd: string;
  dayStartHour: number;
  dayEndHour: number;
  votingClosesAt: string;
  status: RoomStatus;
  lockedSlot: string | null;
  exitedAt: string | null;
  createdAt: string;
  /** The room's one language, set when it is created (plan/10-room-language.md). */
  locale: Locale;
}

export type NewRoom = Omit<RoomRecord, "id" | "slug" | "status" | "lockedSlot" | "exitedAt" |
  "createdAt">;

interface RoomRow {
  id: string;
  slug: string;
  host_name: string;
  host_gender: HostGender;
  group_name: string;
  reason: LeaveReason | null;
  timezone: string;
  window_start: string;
  window_end: string;
  day_start_hour: number;
  day_end_hour: number;
  voting_closes_at: string;
  status: RoomStatus;
  locked_slot: string | null;
  exited_at: string | null;
  created_at: string;
  locale: Locale;
}

// Lowercase, no 0/o, 1/l/i: a slug gets read aloud and retyped. Matches the table's slug check.
const newSlug = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 8);
const SLUG_PATTERN = /^[A-Za-z0-9_-]{6,16}$/;
const UNIQUE_VIOLATION = "23505";
const SLUG_ATTEMPTS = 3;

const toRecord = (row: RoomRow): RoomRecord => ({
  id: row.id,
  slug: row.slug,
  hostName: row.host_name,
  hostGender: row.host_gender,
  groupName: row.group_name,
  reason: row.reason,
  timezone: row.timezone,
  windowStart: row.window_start,
  windowEnd: row.window_end,
  dayStartHour: row.day_start_hour,
  dayEndHour: row.day_end_hour,
  votingClosesAt: row.voting_closes_at,
  status: row.status,
  lockedSlot: row.locked_slot,
  exitedAt: row.exited_at,
  createdAt: row.created_at,
  locale: row.locale,
});

const failed = () => new ApiError(API_ERROR_CODES.upstream_failed, 502);

/** Inserts the room and its admin-token hash together; neither is left behind without the other. */
export async function insertRoom(room: NewRoom, adminTokenHash: string): Promise<RoomRecord> {
  const row = {
    host_name: room.hostName,
    host_gender: room.hostGender,
    group_name: room.groupName,
    reason: room.reason,
    timezone: room.timezone,
    window_start: room.windowStart,
    window_end: room.windowEnd,
    day_start_hour: room.dayStartHour,
    day_end_hour: room.dayEndHour,
    voting_closes_at: room.votingClosesAt,
    locale: room.locale,
  };

  for (let attempt = 0; attempt < SLUG_ATTEMPTS; attempt++) {
    const { data, error } = await db()
      .from("rooms")
      .insert({ ...row, slug: newSlug() })
      .select("*")
      .single<RoomRow>();
    if (error?.code === UNIQUE_VIOLATION) continue;
    if (error || !data) throw failed();

    const { error: secretError } = await db()
      .from("room_secrets")
      .insert({ room_id: data.id, admin_token_hash: adminTokenHash });
    if (secretError) {
      await db().from("rooms").delete().eq("id", data.id);
      throw failed();
    }
    return toRecord(data);
  }
  throw failed();
}

/** The room, or null for a slug that is malformed or unknown. */
export async function findRoomBySlug(slug: string): Promise<RoomRecord | null> {
  if (!SLUG_PATTERN.test(slug)) return null;
  const { data, error } = await db()
    .from("rooms")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<RoomRow>();
  if (error) throw failed();
  return data ? toRecord(data) : null;
}

/** The room's language alone, for the proxy; null for a slug that is malformed or unknown. */
export async function findRoomLocale(slug: string): Promise<Locale | null> {
  if (!SLUG_PATTERN.test(slug)) return null;
  const { data, error } = await db()
    .from("rooms")
    .select("locale")
    .eq("slug", slug)
    .maybeSingle<{ locale: Locale }>();
  if (error) throw failed();
  return data?.locale ?? null;
}

/** The stored hash of the room's admin token, for `tokenMatches` in server/auth/. */
export async function findAdminTokenHash(roomId: string): Promise<string | null> {
  const { data, error } = await db()
    .from("room_secrets")
    .select("admin_token_hash")
    .eq("room_id", roomId)
    .maybeSingle<{ admin_token_hash: string }>();
  if (error) throw failed();
  return data?.admin_token_hash ?? null;
}

/** Removes the room and, by cascade, everything in it. */
export async function deleteRoom(roomId: string): Promise<void> {
  const { error } = await db().from("rooms").delete().eq("id", roomId);
  if (error) throw failed();
}

/**
 * Locks the room to its winning hour once voting time is over — finalize_room() in the database,
 * which draws among tied hours and is idempotent. Before the close it changes nothing. Null for an
 * unknown slug.
 */
export async function finalizeRoom(slug: string): Promise<RoomRecord | null> {
  const { data, error } = await db()
    .rpc("finalize_room", { p_slug: slug })
    .maybeSingle<RoomRow>();
  if (error) throw failed();
  return data?.id ? toRecord(data) : null;
}

/** Locks the room now to the leading hour — admin_lock_room(); a room not voting is unchanged. */
export async function lockRoomNow(roomId: string): Promise<RoomRecord> {
  const { data, error } = await db()
    .rpc("admin_lock_room", { p_room: roomId })
    .single<RoomRow>();
  if (error || !data) throw failed();
  return toRecord(data);
}

/** Opens the vote again until `votingClosesAt`, forgetting the chosen hour and any exit. */
export async function reopenRoom(roomId: string, votingClosesAt: string): Promise<RoomRecord> {
  return updateRoom(roomId, {
    status: ROOM_STATUSES.voting,
    voting_closes_at: votingClosesAt,
    locked_slot: null,
    exited_at: null,
  });
}

/** Marks the host's exit, once: a room already exited keeps its first time, and is returned. */
export async function markExited(roomId: string): Promise<RoomRecord | null> {
  const { data, error } = await db()
    .from("rooms")
    .update({ status: ROOM_STATUSES.exited, exited_at: new Date().toISOString() })
    .eq("id", roomId)
    .neq("status", ROOM_STATUSES.exited)
    .select("*")
    .maybeSingle<RoomRow>();
  if (error) throw failed();
  return data ? toRecord(data) : null;
}

/** Takes the exit back: to the countdown if an hour was chosen, otherwise to the vote. */
export async function undoExit(room: RoomRecord): Promise<RoomRecord> {
  return updateRoom(room.id, {
    status: room.lockedSlot ? ROOM_STATUSES.locked : ROOM_STATUSES.voting,
    exited_at: null,
  });
}

async function updateRoom(roomId: string, changes: Partial<RoomRow>): Promise<RoomRecord> {
  const { data, error } = await db()
    .from("rooms")
    .update(changes)
    .eq("id", roomId)
    .select("*")
    .single<RoomRow>();
  if (error || !data) throw failed();
  return toRecord(data);
}
