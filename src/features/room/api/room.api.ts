import { API_ENDPOINTS } from "@/core/constants/api-endpoints.const";
import { toApiError } from "@/core/api/api-error";
import { RoomSnapshotDtoSchema } from "./room.dto";

export async function fetchRoom(slug: string) {
  const response = await fetch(API_ENDPOINTS.rooms.one(slug), { cache: "no-store" });
  if (!response.ok) throw await toApiError(response);

  return RoomSnapshotDtoSchema.parse(await response.json());
}
