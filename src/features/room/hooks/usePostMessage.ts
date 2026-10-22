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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.wall(slug) }),
  });
}
