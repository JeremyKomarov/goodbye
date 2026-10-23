import { API_ENDPOINTS, ADMIN_TOKEN_HEADER } from "@/core/constants/api-endpoints.const";
import { toApiError } from "@/core/api/api-error";
import { AdminRoomDtoSchema } from "./admin.dto";

export async function fetchAdminRoom(slug: string, token: string) {
  const response = await fetch(API_ENDPOINTS.rooms.admin(slug), {
    cache: "no-store",
    headers: { [ADMIN_TOKEN_HEADER]: token },
  });
  if (!response.ok) throw await toApiError(response);

  return AdminRoomDtoSchema.parse(await response.json());
}
