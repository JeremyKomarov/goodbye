import { API_ENDPOINTS } from "@/core/constants/api-endpoints.const";
import { toApiError } from "@/core/api/api-error";
import { sessionHeaders } from "@/core/supabase/session";
import { CastVoteInputSchema, type CastVoteInput } from "./votes.dto";

export async function castVote(slug: string, input: CastVoteInput) {
  const response = await fetch(API_ENDPOINTS.rooms.vote(slug), {
    method: "PUT",
    headers: { "content-type": "application/json", ...(await sessionHeaders()) },
    body: JSON.stringify(CastVoteInputSchema.parse(input)),
  });
  if (!response.ok) throw await toApiError(response);
}

export async function withdrawVote(slug: string) {
  const response = await fetch(API_ENDPOINTS.rooms.vote(slug), {
    method: "DELETE",
    headers: await sessionHeaders(),
  });
  if (!response.ok) throw await toApiError(response);
}
