import { ADMIN_TOKEN_HEADER, API_ENDPOINTS } from "@/core/constants/api-endpoints.const";
import { toApiError } from "@/core/api/api-error";
import { ADMIN_ACTIONS, AdminActionInputSchema } from "@/shared/api/admin-action.dto";
import { RoomDtoSchema } from "@/shared/api/room.dto";
import { RoomSnapshotDtoSchema } from "./room.dto";

export async function fetchRoom(slug: string) {
  const response = await fetch(API_ENDPOINTS.rooms.one(slug), { cache: "no-store" });
  if (!response.ok) throw await toApiError(response);

  return RoomSnapshotDtoSchema.parse(await response.json());
}

/** Asks the server to lock the room if its voting time is over; answers the room either way. */
export async function finalizeRoom(slug: string) {
  const response = await fetch(API_ENDPOINTS.rooms.finalize(slug), { method: "POST" });
  if (!response.ok) throw await toApiError(response);

  return RoomDtoSchema.parse(await response.json());
}

/** The host's "I left the group", from the room — the admin action, with this browser's token. */
export async function markExit(slug: string, adminToken: string) {
  const response = await fetch(API_ENDPOINTS.rooms.admin(slug), {
    method: "PATCH",
    headers: { "content-type": "application/json", [ADMIN_TOKEN_HEADER]: adminToken },
    body: JSON.stringify(AdminActionInputSchema.parse({ action: ADMIN_ACTIONS.exit })),
  });
  if (!response.ok) throw await toApiError(response);

  return RoomDtoSchema.parse(await response.json());
}
