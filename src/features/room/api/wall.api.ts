import { API_ENDPOINTS } from "@/core/constants/api-endpoints.const";
import { toApiError } from "@/core/api/api-error";
import { sessionHeaders } from "@/core/supabase/session";
import {
  PostMessageInputSchema, ReactInputSchema, WallDtoSchema, WallMessageDtoSchema,
  type PostMessageInput, type ReactInput,
} from "./wall.dto";

export async function fetchWall(slug: string) {
  const response = await fetch(API_ENDPOINTS.rooms.wall(slug), { cache: "no-store" });
  if (!response.ok) throw await toApiError(response);

  return WallDtoSchema.parse(await response.json());
}

export async function postMessage(slug: string, input: PostMessageInput) {
  const response = await fetch(API_ENDPOINTS.rooms.wall(slug), {
    method: "POST",
    headers: { "content-type": "application/json", ...(await sessionHeaders()) },
    body: JSON.stringify(PostMessageInputSchema.parse(input)),
  });
  if (!response.ok) throw await toApiError(response);

  return WallMessageDtoSchema.parse(await response.json());
}

export async function react(slug: string, messageId: number, input: ReactInput) {
  const response = await fetch(API_ENDPOINTS.rooms.reaction(slug, messageId), {
    method: "PUT",
    headers: { "content-type": "application/json", ...(await sessionHeaders()) },
    body: JSON.stringify(ReactInputSchema.parse(input)),
  });
  if (!response.ok) throw await toApiError(response);
}

export async function unreact(slug: string, messageId: number) {
  const response = await fetch(API_ENDPOINTS.rooms.reaction(slug, messageId), {
    method: "DELETE",
    headers: await sessionHeaders(),
  });
  if (!response.ok) throw await toApiError(response);
}
