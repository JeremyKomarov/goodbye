import { formatDurationRough } from "@/core/hebrew";
import { ON_TIME_MINUTES } from "@/core/room-view";
import { exitStats } from "@/core/share";
import { leadingSlot, tallyVotes, wonByDraw } from "@/core/slots";
import { getBrowserClient } from "@/core/supabase/browser";
import type { ReactionMap, WallReaction } from "@/core/reactions";
import type { LeaderboardRow, Room, Vote, WallMessage } from "@/core/types";

/** Everything the goodbye message mentions: votes, wall, reactions, records. */
export async function loadExitStats(room: Room) {
  const db = getBrowserClient();
  const [v, m, x, l] = await Promise.all([
    db
      .from("votes")
      .select("id, room_id, user_id, slot_start")
      .eq("room_id", room.id),
    db.from("wall_messages").select("*").eq("room_id", room.id),
    db
      .from("wall_reactions")
      .select("message_id, user_id, emoji")
      .eq("room_id", room.id),
    db.from("leaderboard").select("*").eq("room_id", room.id),
  ]);
  const votes = (v.data ?? []) as Vote[];
  const reactions: ReactionMap = {};
  for (const row of (x.data ?? []) as WallReaction[])
    (reactions[row.message_id] ??= {})[row.user_id] = row.emoji;
  return {
    stats: exitStats({
      voterCount: votes.length,
      messages: (m.data ?? []) as WallMessage[],
      reactions,
      leaderboard: (l.data ?? []) as LeaderboardRow[],
    }),
    drawn: wonByDraw(leadingSlot(tallyVotes(votes)), room.locked_slot),
  };
}

/** Before marking the exit: early and mid-vote exits are allowed, but the host hears how they'll look. */
export function exitQuestion(room: Room) {
  if (
    room.status === "voting" &&
    Date.now() < Date.parse(room.voting_closes_at)
  )
    return "ההצבעה עוד פתוחה. לצאת כבר עכשיו? כולם יראו שברחת באמצע ההצבעה 😅";
  const left = room.locked_slot ? Date.parse(room.locked_slot) - Date.now() : 0;
  if (left > ON_TIME_MINUTES * 60_000)
    return `עוד ${formatDurationRough(left)} לשעה שהקבוצה בחרה. לסמן שיצאת כבר עכשיו? כולם יראו שברחת מוקדם 😅`;
  return "לסמן שיצאת מהקבוצה? כולם יראו את זה מיד.";
}

export function toLocalInput(ms: number) {
  const d = new Date(ms);
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
