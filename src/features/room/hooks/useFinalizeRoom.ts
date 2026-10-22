import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { finalizeRoom } from "@/features/room/api/room.api";
import { mapRoomDto } from "@/features/room/api/room.mapper";

/** Asks for the result once voting time is over. Invalidates the room when it has locked. */
export function useFinalizeRoom(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => mapRoomDto(await finalizeRoom(slug)),
    onSuccess: (room) => {
      if (room.status !== ROOM_STATUSES.voting)
        return queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.all(slug) });
    },
  });
}
