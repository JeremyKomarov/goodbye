import type { AdminRoom } from "@/features/admin/types/admin.types";
import { mapRoomDto } from "@/shared/api/room.mapper";
import type { AdminRoomDto } from "./admin.dto";

export function mapAdminRoomDto(dto: AdminRoomDto): AdminRoom {
  return {
    room: mapRoomDto(dto.room),
    players: dto.players.map((p) => ({
      userId: p.user_id,
      name: p.display_name,
      isHost: p.is_host,
      code: p.code,
      hasVoted: p.has_voted,
    })),
    messages: dto.messages.map((m) => ({
      id: m.id,
      name: m.display_name,
      body: m.body,
      createdAt: Date.parse(m.created_at),
    })),
  };
}
