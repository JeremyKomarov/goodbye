import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { fetchRoom } from "@/features/room/api/room.api";
import { mapRoomSnapshotDto } from "@/features/room/api/room.mapper";

/** The room and everything in it. Kept fresh by the room's Realtime channel, not by polling. */
export function useRoom(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.room.snapshot(slug),
    queryFn: async () => mapRoomSnapshotDto(await fetchRoom(slug)),
  });
}
