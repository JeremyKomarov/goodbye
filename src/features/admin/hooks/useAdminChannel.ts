import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { joinRoomChannel, ROOM_TABLES } from "@/core/supabase/realtime";

// A burst of changes (a vote moved and a goodbye sent together, a reconnect) is read once.
const SETTLE_MS = 150;

const ignore = () => {};

/**
 * The room's live channel on the host's page: any change but a game's score re-reads the host's
 * view, so a vote, a player joining or a goodbye shows without a reload (docs/DECISIONS.md #2).
 * The page is not in the room, so it is not tracked as here and sends nothing.
 */
export function useAdminChannel(slug: string, roomId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!roomId) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const joined = joinRoomChannel(roomId, {
      onChange: (table) => {
        if (table === ROOM_TABLES.scores) return;
        clearTimeout(timer);
        timer = setTimeout(
          () =>
            void queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.room.admin(slug),
            }),
          SETTLE_MS,
        );
      },
      onPresence: ignore,
      onTyping: ignore,
      onEmoji: ignore,
    });
    return () => {
      clearTimeout(timer);
      joined.unsubscribe();
    };
  }, [queryClient, slug, roomId]);
}
