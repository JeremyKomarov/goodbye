import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { postMessage } from "@/features/room/api/wall.api";
import type { PostMessageInput } from "@/features/room/api/wall.dto";
import { mapWallMessageDto } from "@/features/room/api/wall.mapper";

/** Posts a goodbye to the wall. Rejects with `too_fast` or `forbidden`. Invalidates the wall. */
export function usePostMessage(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: PostMessageInput) =>
      mapWallMessageDto(await postMessage(slug, input)),
    // Not awaited: the composer frees up as soon as the message is in, and the room's channel may
    // cancel this read with its own.
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.wall(slug) }),
  });
}
