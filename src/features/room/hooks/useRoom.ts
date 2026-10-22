import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { fetchRoom } from "@/features/room/api/room.api";
import type { RoomSnapshotDto } from "@/features/room/api/room.dto";
import { mapRoomSnapshotDto } from "@/features/room/api/room.mapper";

/**
 * The room and everything in it, starting from what the page read on the server. Kept fresh by the
 * room's Realtime channel, not by polling.
 */
export function useRoom(slug: string, initial?: RoomSnapshotDto) {
  return useQuery({
    queryKey: QUERY_KEYS.room.snapshot(slug),
    queryFn: async () => mapRoomSnapshotDto(await fetchRoom(slug)),
    initialData: initial && (() => mapRoomSnapshotDto(initial)),
  });
}
