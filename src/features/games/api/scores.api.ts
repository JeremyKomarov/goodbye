import { toApiError } from "@/core/api/api-error";
import { API_ENDPOINTS } from "@/core/constants/api-endpoints.const";
import { sessionHeaders } from "@/core/supabase/session";
import { type SubmitScoreInput, SubmitScoreInputSchema } from "@/shared/api/records.dto";

export async function submitScore(slug: string, input: SubmitScoreInput) {
  const response = await fetch(API_ENDPOINTS.rooms.scores(slug), {
    method: "POST",
    headers: { "content-type": "application/json", ...(await sessionHeaders()) },
    body: JSON.stringify(SubmitScoreInputSchema.parse(input)),
  });
  if (!response.ok) throw await toApiError(response);
}
