import type { Wall, WallMessage } from "@/features/room/types/wall.types";
import type { WallDto, WallMessageDto } from "./wall.dto";

export function mapWallMessageDto(dto: WallMessageDto): WallMessage {
  return {
    id: dto.id,
    userId: dto.user_id,
    name: dto.display_name,
    body: dto.body,
    createdAt: Date.parse(dto.created_at),
  };
}

export function mapWallDto(dto: WallDto): Wall {
  const reactions: Wall["reactions"] = {};
  for (const row of dto.reactions) (reactions[row.message_id] ??= {})[row.user_id] = row.emoji;
  return { messages: dto.messages.map(mapWallMessageDto), reactions };
}
