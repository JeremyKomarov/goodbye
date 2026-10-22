import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { saveName } from "@/features/room/api/players.api";
import type { SaveNameInput } from "@/features/room/api/players.dto";

/** Changes this player's name in the room. Invalidates the room. */
export function useRename(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SaveNameInput) => saveName(slug, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.all(slug) }),
  });
}
