import { API_ENDPOINTS } from "@/core/constants/api-endpoints.const";
import { toApiError } from "@/core/api/api-error";
import { WallDtoSchema } from "./wall.dto";

export async function fetchWall(slug: string) {
  const response = await fetch(API_ENDPOINTS.rooms.wall(slug), { cache: "no-store" });
  if (!response.ok) throw await toApiError(response);

  return WallDtoSchema.parse(await response.json());
}
