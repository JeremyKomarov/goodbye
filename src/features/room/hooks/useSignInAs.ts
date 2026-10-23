import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { signInWithCode } from "@/core/supabase/session";
import type { Player } from "@/features/room/types/room.types";
import { sameName } from "@/features/room/utils/names";

/**
 * Comes in as the player with this name — joined on another device — with their code. Rejects with
 * `not_found` for a name nobody in the room has, or the code's refusal. Invalidates the session
 * user, so the room recognises them.
 */
export function useSignInAs(players: readonly Player[] | undefined) {
  const queryClient = useQueryClient();
  const signIn = useMutation({
    mutationFn: ({ userId, code }: { userId: string; code: string }) =>
      signInWithCode(userId, code),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.session.user }),
  });

  return async (name: string, code: string) => {
    const player = players?.find((candidate) => sameName(candidate.name, name));
    if (!player) throw new ApiError(API_ERROR_CODES.not_found, 404);
    await signIn.mutateAsync({ userId: player.userId, code });
  };
}
