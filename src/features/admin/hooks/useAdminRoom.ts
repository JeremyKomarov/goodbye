import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { fetchAdminRoom } from "@/features/admin/api/admin.api";
import { mapAdminRoomDto } from "@/features/admin/api/admin.mapper";

/**
 * The host's view of their room, while there is a token to ask with. A refused token is an
 * answer, not a hiccup: it is not retried.
 */
export function useAdminRoom(slug: string, token: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.room.admin(slug),
    queryFn: async () => mapAdminRoomDto(await fetchAdminRoom(slug, token ?? "")),
    enabled: token !== null,
    retry: false,
  });
}
