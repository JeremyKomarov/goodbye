import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { fetchWall } from "@/features/room/api/wall.api";
import { mapWallDto } from "@/features/room/api/wall.mapper";

/** The wall's messages and reactions. Kept fresh by the room's channel, like the room itself. */
export function useWall(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.room.wall(slug),
    queryFn: async () => mapWallDto(await fetchWall(slug)),
  });
}
