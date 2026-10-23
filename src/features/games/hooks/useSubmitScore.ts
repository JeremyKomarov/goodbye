import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import type { SubmitScoreInput } from "@/shared/api/records.dto";
import { submitScore } from "@/features/games/api/scores.api";

/** Keeps a round's score. Rejects with `games_closed` or `forbidden`. Invalidates the records. */
export function useSubmitScore(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SubmitScoreInput) => submitScore(slug, input),
    // Not awaited: the room's channel may cancel this read with its own.
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.scores(slug) }),
  });
}
