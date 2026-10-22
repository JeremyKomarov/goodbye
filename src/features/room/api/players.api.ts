import { API_ENDPOINTS } from "@/core/constants/api-endpoints.const";
import { toApiError } from "@/core/api/api-error";
import { sessionHeaders } from "@/core/supabase/session";
import {
  ClaimHostInputSchema, SaveNameInputSchema, type ClaimHostInput, type SaveNameInput,
} from "./players.dto";

export async function saveName(slug: string, input: SaveNameInput) {
  const response = await fetch(API_ENDPOINTS.rooms.me(slug), {
    method: "PUT",
    headers: { "content-type": "application/json", ...(await sessionHeaders()) },
    body: JSON.stringify(SaveNameInputSchema.parse(input)),
  });
  if (!response.ok) throw await toApiError(response);
}

export async function claimHost(slug: string, input: ClaimHostInput) {
  const response = await fetch(API_ENDPOINTS.rooms.hosts(slug), {
    method: "POST",
    headers: { "content-type": "application/json", ...(await sessionHeaders()) },
    body: JSON.stringify(ClaimHostInputSchema.parse(input)),
  });
  if (!response.ok) throw await toApiError(response);
}
