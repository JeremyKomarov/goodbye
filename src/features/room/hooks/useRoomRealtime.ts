import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { ROOM_TABLES, subscribeToRoom, type RoomTable } from "@/core/supabase/realtime";

// A burst of changes (a vote moved: a delete and an insert) is read once.
const SETTLE_MS = 150;

const WALL_TABLES: readonly RoomTable[] = [ROOM_TABLES.wallMessages, ROOM_TABLES.wallReactions];

/**
 * Keeps the room fresh: a change to the wall invalidates the wall's query, any other change the
 * room's snapshot — and nothing is written from the event itself (docs/DECISIONS.md #2).
 */
export function useRoomRealtime(slug: string, roomId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!roomId) return;
    const timers = new Map<string, ReturnType<typeof setTimeout>>();
    const unsubscribe = subscribeToRoom(roomId, (table) => {
      const queryKey = WALL_TABLES.includes(table)
        ? QUERY_KEYS.room.wall(slug)
        : QUERY_KEYS.room.snapshot(slug);
      const id = queryKey.join("/");
      clearTimeout(timers.get(id));
      timers.set(id, setTimeout(() => queryClient.invalidateQueries({ queryKey }), SETTLE_MS));
    });
    return () => {
      timers.forEach(clearTimeout);
      unsubscribe();
    };
  }, [queryClient, slug, roomId]);
}
