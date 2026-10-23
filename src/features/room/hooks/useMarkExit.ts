import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { markExit } from "@/features/room/api/room.api";

/** The host marks that they left the group, from the room. Invalidates the room. */
export function useMarkExit(slug: string, adminToken: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markExit(slug, adminToken ?? ""),
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.all(slug) }),
  });
}
