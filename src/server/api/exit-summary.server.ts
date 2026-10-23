import "server-only";
import type { ExitSummaryDto } from "@/shared/api/summary.dto";
import type { RoomRecord } from "@/server/db/rooms.repo";
import { listVotes } from "@/server/db/votes.repo";
import { countWallMessages, findWallMessage, listWallReactions } from "@/server/db/wall.repo";
import { leadingSlot, tallyVotes, wonByDraw } from "@/shared/utils/tally";

/** The message with the most reactions; on a tie, the earliest written (ids only grow). */
function mostReacted(messageIds: number[]): { id: number; count: number } | null {
  const counts = new Map<number, number>();
  for (const id of messageIds) counts.set(id, (counts.get(id) ?? 0) + 1);
  let best: { id: number; count: number } | null = null;
  for (const [id, count] of counts)
    if (!best || count > best.count || (count === best.count && id < best.id)) best = { id, count };
  return best;
}

/** What the room adds up to: the finale's numbers, and the ones in the host's messages. */
export async function exitSummary(room: RoomRecord): Promise<ExitSummaryDto> {
  const [votes, messageCount, reactions] = await Promise.all([
    listVotes(room.id),
    countWallMessages(room.id),
    listWallReactions(room.id),
  ]);
  const lead = leadingSlot(tallyVotes(votes.map((v) => ({ slotMs: Date.parse(v.slotStart) }))));
  const lockedSlot = room.lockedSlot === null ? null : Date.parse(room.lockedSlot);
  const top = mostReacted(reactions.map((r) => r.messageId));
  const loved = top && (await findWallMessage(room.id, top.id));

  return {
    voter_count: votes.length,
    message_count: messageCount,
    loved: loved
      ? { display_name: loved.displayName, body: loved.body, reactions: top.count }
      : null,
    drawn: wonByDraw(lead, lockedSlot),
    leading_slot:
      lockedSlot === null && lead?.tied.length === 1 ? new Date(lead.ms).toISOString() : null,
  };
}
