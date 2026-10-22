import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { signOutHere } from "@/core/supabase/session";

/**
 * "Not you?": forgets who this browser is — in every room, since the session is the browser's —
 * so the next person is asked for a name. Invalidates the session user.
 */
export function useSwitchUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signOutHere,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.session.user }),
  });
}
