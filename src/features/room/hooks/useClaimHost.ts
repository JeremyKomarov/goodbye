import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { claimHost } from "@/features/room/api/players.api";

/**
 * The host's browser, already in the room, tells the server it is the host — for rooms opened
 * before hosts were recorded, and for a second device. Idempotent. Invalidates the room.
 */
export function useClaimHost(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (adminToken: string) => claimHost(slug, { adminToken }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.all(slug) }),
  });
}
