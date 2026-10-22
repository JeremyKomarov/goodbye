import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { subscribeToRoom } from "@/core/supabase/realtime";

// A burst of changes (a vote moved: a delete and an insert) is read once.
const SETTLE_MS = 150;

/** Keeps the room fresh: a change anywhere in it invalidates the room's queries, and only that. */
export function useRoomRealtime(slug: string, roomId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!roomId) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = subscribeToRoom(roomId, () => {
      clearTimeout(timer);
      timer = setTimeout(
        () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.all(slug) }),
        SETTLE_MS,
      );
    });
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [queryClient, slug, roomId]);
}
