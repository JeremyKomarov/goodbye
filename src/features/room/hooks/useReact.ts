import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactionEmoji } from "@/core/constants/room.const";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { react, unreact } from "@/features/room/api/wall.api";
import type { Wall } from "@/features/room/types/wall.types";
import { withReaction } from "@/features/room/utils/reactions";

interface ReactionChange {
  messageId: number;
  userId: string;
  /** The reaction, or null to take it back. */
  emoji: ReactionEmoji | null;
}

/**
 * Reacts to a wall message, changes the reaction, or takes it back. The chip moves at once — the
 * change goes into the wall before the request, and is put back if it fails. Invalidates the wall.
 */
export function useReact(slug: string) {
  const queryClient = useQueryClient();
  const key = QUERY_KEYS.room.wall(slug);

  return useMutation({
    mutationFn: ({ messageId, emoji }: ReactionChange) =>
      emoji === null ? unreact(slug, messageId) : react(slug, messageId, { emoji }),
    onMutate: async ({ messageId, userId, emoji }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const before = queryClient.getQueryData<Wall>(key);
      queryClient.setQueryData<Wall>(key, (wall) =>
        wall && { ...wall, reactions: withReaction(wall.reactions, messageId, userId, emoji) },
      );
      return { before };
    },
    onError: (_error, _change, context) => {
      if (context?.before) queryClient.setQueryData(key, context.before);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}
