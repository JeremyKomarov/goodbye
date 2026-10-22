import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { currentUserId } from "@/core/supabase/session";

/** This browser's user id, or null before it has joined any room. Read once, then invalidated. */
export function useSessionUser() {
  return useQuery({
    queryKey: QUERY_KEYS.session.user,
    queryFn: currentUserId,
    staleTime: Infinity,
  });
}
