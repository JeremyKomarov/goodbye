import { API_ENDPOINTS, ADMIN_TOKEN_HEADER } from "@/core/constants/api-endpoints.const";
import { toApiError } from "@/core/api/api-error";
import { AdminActionInputSchema, type AdminActionInput } from "@/shared/api/admin-action.dto";
import { RoomDtoSchema } from "@/shared/api/room.dto";
import { AdminRoomDtoSchema } from "./admin.dto";

export async function fetchAdminRoom(slug: string, token: string) {
  const response = await fetch(API_ENDPOINTS.rooms.admin(slug), {
    cache: "no-store",
    headers: { [ADMIN_TOKEN_HEADER]: token },
  });
  if (!response.ok) throw await toApiError(response);

  return AdminRoomDtoSchema.parse(await response.json());
}

export async function runAdminAction(slug: string, token: string, input: AdminActionInput) {
  const response = await fetch(API_ENDPOINTS.rooms.admin(slug), {
    method: "PATCH",
    headers: { "content-type": "application/json", [ADMIN_TOKEN_HEADER]: token },
    body: JSON.stringify(AdminActionInputSchema.parse(input)),
  });
  if (!response.ok) throw await toApiError(response);

  return RoomDtoSchema.parse(await response.json());
}

export async function deleteMessage(slug: string, token: string, messageId: number) {
  const response = await fetch(API_ENDPOINTS.rooms.adminMessage(slug, messageId), {
    method: "DELETE",
    headers: { [ADMIN_TOKEN_HEADER]: token },
  });
  if (!response.ok) throw await toApiError(response);
}
