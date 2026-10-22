import type { CreatedRoom } from "@/features/landing/types/room.types";
import type { CreatedRoomDto } from "./rooms.dto";

export function mapCreatedRoomDto(dto: CreatedRoomDto): CreatedRoom {
  return { slug: dto.slug, adminToken: dto.admin_token };
}
