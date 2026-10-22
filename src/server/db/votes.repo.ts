import "server-only";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import { db } from "./client";

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
