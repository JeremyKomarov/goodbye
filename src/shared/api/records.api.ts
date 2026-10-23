import { toApiError } from "@/core/api/api-error";
import { API_ENDPOINTS } from "@/core/constants/api-endpoints.const";
import { RecordsDtoSchema } from "./records.dto";

export async function fetchRecords(slug: string) {
  const response = await fetch(API_ENDPOINTS.rooms.scores(slug), { cache: "no-store" });
  if (!response.ok) throw await toApiError(response);

  return RecordsDtoSchema.parse(await response.json());
}
