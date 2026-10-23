import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import {
  joinRoomChannel, ROOM_TABLES, type RoomChannel, type RoomPeer, type RoomTable,
} from "@/core/supabase/realtime";
import type { Player } from "@/features/room/types/room.types";
import { useNow } from "@/shared/hooks/useNow";

// A burst of changes (a vote moved: a delete and an insert) is read once.
const SETTLE_MS = 150;
// A typing signal lasts this long unless it is renewed; a sender renews it every 2s.
const TYPING_TTL_MS = 4000;

const WALL_TABLES: readonly RoomTable[] = [ROOM_TABLES.wallMessages, ROOM_TABLES.wallReactions];

/** The reads a table's change makes stale. The records carry the players' names. */
function staleKeys(slug: string, table: RoomTable) {
  if (WALL_TABLES.includes(table)) return [QUERY_KEYS.room.wall(slug)];
  if (table === ROOM_TABLES.scores) return [QUERY_KEYS.room.scores(slug)];
  if (table === ROOM_TABLES.players)
    return [QUERY_KEYS.room.snapshot(slug), QUERY_KEYS.room.scores(slug)];
  return [QUERY_KEYS.room.snapshot(slug)];
}

type RainListener = (emoji: string) => void;

/**
 * The room's live channel, for as long as the room is open. Table changes invalidate the room's
 * queries — the wall's, the records, or the snapshot (docs/DECISIONS.md #2); who is here, who is
 * typing and the emoji rain are held here, as the moment only (#8).
 */
export function useRoomChannel(slug: string, roomId: string | undefined, me: Player | null) {
  const queryClient = useQueryClient();
  const channel = useRef<RoomChannel | null>(null);
  const rainListeners = useRef(new Set<RainListener>());
  const [online, setOnline] = useState<RoomPeer[]>([]);
  const [typing, setTyping] = useState<Record<string, { peer: RoomPeer; until: number }>>({});
  const now = useNow();

  useEffect(() => {
    if (!roomId) return;
    const timers = new Map<string, ReturnType<typeof setTimeout>>();
    const joined = joinRoomChannel(roomId, {
      onChange: (table) => {
        for (const queryKey of staleKeys(slug, table)) {
          const id = queryKey.join("/");
          clearTimeout(timers.get(id));
          const invalidate = () => queryClient.invalidateQueries({ queryKey });
          timers.set(id, setTimeout(invalidate, SETTLE_MS));
        }
      },
      onPresence: setOnline,
      onTyping: (peer, isTyping) =>
        setTyping(({ [peer.userId]: _previous, ...rest }) =>
          isTyping ? { ...rest, [peer.userId]: { peer, until: Date.now() + TYPING_TTL_MS } } : rest,
        ),
      onEmoji: (emoji) => rainListeners.current.forEach((listener) => listener(emoji)),
    });
    channel.current = joined;
    return () => {
      timers.forEach(clearTimeout);
      channel.current = null;
      joined.unsubscribe();
    };
  }, [queryClient, slug, roomId]);

  // Shown as here once joined, under the name in use; the channel tracks again on reconnect.
  const myId = me?.userId;
  const myName = me?.name;
  useEffect(() => {
    channel.current?.track(myId && myName ? { userId: myId, name: myName } : null);
  }, [myId, myName, roomId]);

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (me) channel.current?.sendTyping({ userId: me.userId, name: me.name }, isTyping);
    },
    [me],
  );

  /** Rains on this screen, and on everyone else's. */
  const sendEmoji = useCallback((emoji: string) => {
    rainListeners.current.forEach((listener) => listener(emoji));
    channel.current?.sendEmoji(emoji);
  }, []);

  /** Rains on this screen only — every screen has the same clock, so no broadcast is needed. */
  const rain = useCallback((emoji: string) => {
    rainListeners.current.forEach((listener) => listener(emoji));
  }, []);

  const onRain = useCallback((listener: RainListener) => {
    rainListeners.current.add(listener);
    return () => void rainListeners.current.delete(listener);
  }, []);

  const typers = Object.values(typing)
    .filter((entry) => entry.until > now && entry.peer.userId !== me?.userId)
    .map((entry) => entry.peer);

  return { online, typers, sendTyping, sendEmoji, rain, onRain };
}

export type RoomLive = ReturnType<typeof useRoomChannel>;
