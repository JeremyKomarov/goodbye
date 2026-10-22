import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { signInWithCode } from "@/core/supabase/session";

/**
 * Comes in as a player who joined on another device, with their code. Invalidates the session
 * user, so the room recognises them.
 */
export function useSignInAs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, code }: { userId: string; code: string }) =>
      signInWithCode(userId, code),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.session.user }),
  });
}
