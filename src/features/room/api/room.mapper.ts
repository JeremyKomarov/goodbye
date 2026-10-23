import type { RoomSnapshot } from "@/features/room/types/room.types";
import { mapRoomDto } from "@/shared/api/room.mapper";
import type { RoomSnapshotDto } from "./room.dto";

export function mapRoomSnapshotDto(dto: RoomSnapshotDto): RoomSnapshot {
  return {
    room: mapRoomDto(dto.room),
    players: dto.players.map((p) => ({ userId: p.user_id, name: p.display_name })),
    hostIds: dto.host_ids,
    votes: dto.votes.map((v) => ({ userId: v.user_id, slotMs: Date.parse(v.slot_start) })),
  };
}
