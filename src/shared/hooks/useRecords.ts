import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { fetchRecords } from "@/shared/api/records.api";
import { mapRecordsDto } from "@/shared/api/records.mapper";

/** The room's records, every game. Kept fresh by the room's channel, like the room itself. */
export function useRecords(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.room.scores(slug),
    queryFn: async () => mapRecordsDto(await fetchRecords(slug)),
  });
}
