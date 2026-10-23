import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { fetchExitSummary } from "@/shared/api/summary.api";
import { mapExitSummaryDto } from "@/shared/api/summary.mapper";

/**
 * The room's summary — kept fresh by the room's channel. Off until `isEnabled`: it is read only
 * once there is something to tell, when the hour is locked or the host has left.
 */
export function useExitSummary(slug: string, isEnabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.room.summary(slug),
    queryFn: async () => mapExitSummaryDto(await fetchExitSummary(slug)),
    enabled: isEnabled,
  });
}
