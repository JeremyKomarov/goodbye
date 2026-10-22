import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { castVote, withdrawVote } from "@/features/room/api/votes.api";
import type { RoomSnapshot } from "@/features/room/types/room.types";

interface VoteChange {
  userId: string;
  /** The hour to vote for, or null to take the vote back. */
  slotMs: number | null;
}

/**
 * Casts, moves or takes back this browser's vote. The heatmap moves at once — the change is put
 * into the room's snapshot before the request, and put back if it fails. Invalidates the room.
 */
export function useVote(slug: string) {
  const queryClient = useQueryClient();
  const key = QUERY_KEYS.room.snapshot(slug);

  return useMutation({
    mutationFn: ({ slotMs }: VoteChange) =>
      slotMs === null
        ? withdrawVote(slug)
        : castVote(slug, { slotStart: new Date(slotMs).toISOString() }),
    onMutate: async ({ userId, slotMs }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const before = queryClient.getQueryData<RoomSnapshot>(key);
      queryClient.setQueryData<RoomSnapshot>(key, (snapshot) => {
        if (!snapshot) return snapshot;
        const others = snapshot.votes.filter((vote) => vote.userId !== userId);
        const votes = slotMs === null ? others : [...others, { userId, slotMs }];
        return { ...snapshot, votes };
      });
      return { before };
    },
    onError: (_error, _change, context) => {
      if (context?.before) queryClient.setQueryData(key, context.before);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.all(slug) }),
  });
}
