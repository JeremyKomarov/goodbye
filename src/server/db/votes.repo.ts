import "server-only";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import { asUser, db } from "./client";

// The votes: `public.votes`, at most one per player per room, each the start of an hour slot. The
// can_vote() and is_voter() policies decide which votes the database accepts.

export interface VoteRecord {
  userId: string;
  slotStart: string;
}

interface VoteRow {
  user_id: string;
  slot_start: string;
}

const failed = () => new ApiError(API_ERROR_CODES.upstream_failed, 502);

/** Every vote cast in the room. */
export async function listVotes(roomId: string): Promise<VoteRecord[]> {
  const { data, error } = await db()
    .from("votes")
    .select("user_id, slot_start")
    .eq("room_id", roomId)
    .overrideTypes<VoteRow[], { merge: false }>();
  if (error) throw failed();
  return data.map((row) => ({ userId: row.user_id, slotStart: row.slot_start }));
}

// Row-level security said no: the caller is the host, or has not joined the room.
const POLICY_VIOLATION = "42501";

/**
 * Casts or moves the caller's vote. Written as the caller, so can_vote() and is_voter() judge it:
 * a refusal there — the host, or someone who never joined — is `forbidden`.
 */
export async function saveVote(
  accessToken: string,
  roomId: string,
  userId: string,
  slotStart: string,
): Promise<void> {
  const { error } = await asUser(accessToken)
    .from("votes")
    .upsert(
      {
        room_id: roomId,
        user_id: userId,
        slot_start: slotStart,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "room_id,user_id" },
    );
  if (error?.code === POLICY_VIOLATION) throw new ApiError(API_ERROR_CODES.forbidden, 403);
  if (error) throw failed();
}

/** Takes the caller's vote back. Nothing to take back is not an error. */
export async function withdrawVote(accessToken: string, roomId: string, userId: string) {
  const { error } = await asUser(accessToken)
    .from("votes")
    .delete()
    .eq("room_id", roomId)
    .eq("user_id", userId);
  if (error) throw failed();
}

/**
 * Drops one user's vote — the host's, cast before the room knew them as its host. With the secret
 * key: a host may no longer vote, so the policies would not let them withdraw it themselves.
 */
export async function deleteVoteOf(roomId: string, userId: string) {
  const { error } = await db().from("votes").delete().eq("room_id", roomId).eq("user_id", userId);
  if (error) throw failed();
}
