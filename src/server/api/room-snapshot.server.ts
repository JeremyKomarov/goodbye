import "server-only";
import type { RoomDto, RoomSnapshotDto } from "@/features/room/api/room.dto";
import { listHostIds } from "@/server/db/hosts.repo";
import { listPlayers } from "@/server/db/players.repo";
import type { RoomRecord } from "@/server/db/rooms.repo";
import { listVotes } from "@/server/db/votes.repo";

/** The room row as the wire carries it — snake_case, times as ISO strings. */
export function toRoomDto(room: RoomRecord): RoomDto {
  return {
    id: room.id,
    slug: room.slug,
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
    status: room.status,
    locked_slot: room.lockedSlot,
    exited_at: room.exitedAt,
  };
}

/** The room and everything the room screen draws from, read together. */
export async function roomSnapshot(room: RoomRecord): Promise<RoomSnapshotDto> {
  const [players, hostIds, votes] = await Promise.all([
    listPlayers(room.id),
    listHostIds(room.id),
    listVotes(room.id),
  ]);
  return {
    room: toRoomDto(room),
    players: players.map((p) => ({ user_id: p.userId, display_name: p.displayName })),
    host_ids: hostIds,
    votes: votes.map((v) => ({ user_id: v.userId, slot_start: v.slotStart })),
  };
}
