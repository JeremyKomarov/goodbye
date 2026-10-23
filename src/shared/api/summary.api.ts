import { toApiError } from "@/core/api/api-error";
import { API_ENDPOINTS } from "@/core/constants/api-endpoints.const";
import { ExitSummaryDtoSchema } from "./summary.dto";

export async function fetchExitSummary(slug: string) {
  const response = await fetch(API_ENDPOINTS.rooms.summary(slug), { cache: "no-store" });
  if (!response.ok) throw await toApiError(response);

  return ExitSummaryDtoSchema.parse(await response.json());
}
