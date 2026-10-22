import { API_ENDPOINTS } from "@/core/constants/api-endpoints.const";
import { toApiError } from "@/core/api/api-error";
import { CreatedRoomDtoSchema, CreateRoomInputSchema, type CreateRoomInput } from "./rooms.dto";

export async function createRoom(input: CreateRoomInput) {
  const response = await fetch(API_ENDPOINTS.rooms.create, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(CreateRoomInputSchema.parse(input)),
  });
  if (!response.ok) throw await toApiError(response);

  return CreatedRoomDtoSchema.parse(await response.json());
}
