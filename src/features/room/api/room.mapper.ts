import type { Room, RoomSnapshot } from "@/features/room/types/room.types";
import type { RoomDto, RoomSnapshotDto } from "./room.dto";

const msOrNull = (value: string | null) => (value === null ? null : Date.parse(value));

export function mapRoomDto(dto: RoomDto): Room {
  return {
    id: dto.id,
    slug: dto.slug,
    hostName: dto.host_name,
    hostGender: dto.host_gender,
    groupName: dto.group_name,
    reason: dto.reason,
    timezone: dto.timezone,
    windowStart: dto.window_start,
    windowEnd: dto.window_end,
    dayStartHour: dto.day_start_hour,
    dayEndHour: dto.day_end_hour,
    votingClosesAt: Date.parse(dto.voting_closes_at),
    status: dto.status,
    lockedSlot: msOrNull(dto.locked_slot),
    exitedAt: msOrNull(dto.exited_at),
  };
}

export function mapRoomSnapshotDto(dto: RoomSnapshotDto): RoomSnapshot {
  return {
    room: mapRoomDto(dto.room),
    players: dto.players.map((p) => ({ userId: p.user_id, name: p.display_name })),
    hostIds: dto.host_ids,
    votes: dto.votes.map((v) => ({ userId: v.user_id, slotMs: Date.parse(v.slot_start) })),
  };
}
