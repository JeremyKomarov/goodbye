import type { RealtimeChannel } from "@supabase/supabase-js";
import { browserSupabase } from "./client";

// The room's Realtime channel. It reports *that* something changed, never what: the caller
// invalidates its queries and reads the room again through its handler (docs/DECISIONS.md #2).

/** What changed: the room row, who is in it, who hosts it, a vote, or the wall. */
export const ROOM_TABLES = {
  rooms: "rooms",
  players: "players",
  hosts: "room_hosts",
  votes: "votes",
  wallMessages: "wall_messages",
  wallReactions: "wall_reactions",
} as const;

// A deleted row carries only its key, so these deletions can't be filtered by room: any one
// anywhere is reported, and the read that follows is what tells.
const UNFILTERED_DELETES = [ROOM_TABLES.votes, ROOM_TABLES.wallMessages, ROOM_TABLES.wallReactions];
export type RoomTable = (typeof ROOM_TABLES)[keyof typeof ROOM_TABLES];

// supabase.channel() hands back a channel with the same topic until its unsubscribe finishes, so a
// quick remount (React's dev double-mount, a room switch) waits for the last teardown first.
const teardowns = new Map<string, Promise<unknown>>();

/** Someone in the room, as the channel carries them. */
export interface RoomPeer {
  userId: string;
  name: string;
}

export interface RoomChannelHandlers {
  /** A table changed — also fired for every table each time the channel connects. */
  onChange: (table: RoomTable) => void;
  /** Who is here now, once per change in presence. */
  onPresence: (peers: RoomPeer[]) => void;
  onTyping: (peer: RoomPeer, isTyping: boolean) => void;
  onEmoji: (emoji: string) => void;
}

/** What a screen can send on the room's channel. Nothing sent here is stored anywhere. */
export interface RoomChannel {
  /** Shows this browser's player as here; null takes them away. */
  track: (peer: RoomPeer | null) => void;
  sendTyping: (peer: RoomPeer, isTyping: boolean) => void;
  sendEmoji: (emoji: string) => void;
  unsubscribe: () => void;
}

const EVENTS = { typing: "typing", emoji: "emoji" } as const;

/**
 * Joins one room's channel: table changes (which the caller turns into invalidations), presence,
 * and two broadcasts — typing, and the emoji rain. Presence and the broadcasts are the moment
 * only (docs/DECISIONS.md #8); nothing here writes to the database.
 */
export function joinRoomChannel(roomId: string, handlers: RoomChannelHandlers): RoomChannel {
  const supabase = browserSupabase();
  const topic = `room:${roomId}`;
  const byRoom = `room_id=eq.${roomId}`;
  let channel: RealtimeChannel | null = null;
  let isJoined = false;
  let me: RoomPeer | null = null;
  let active = true;

  const connect = () => {
    if (!active) return;
    // Presence keyed by the server, so one person on two devices is two entries; peers dedupe.
    const next = supabase.channel(topic, { config: { presence: { key: "" } } });
    for (const table of Object.values(ROOM_TABLES)) {
      const filter = table === ROOM_TABLES.rooms ? `id=eq.${roomId}` : byRoom;
      next.on("postgres_changes", { event: "*", schema: "public", table, filter }, () =>
        handlers.onChange(table),
      );
    }
    for (const table of UNFILTERED_DELETES)
      next.on("postgres_changes", { event: "DELETE", schema: "public", table }, () =>
        handlers.onChange(table),
      );
    next
      .on("presence", { event: "sync" }, () => {
        const peers = new Map<string, RoomPeer>();
        for (const entries of Object.values(next.presenceState<RoomPeer>()))
          for (const { userId, name } of entries) peers.set(userId, { userId, name });
        handlers.onPresence([...peers.values()]);
      })
      .on("broadcast", { event: EVENTS.typing }, ({ payload }) => {
        const { userId, name, isTyping } = payload as RoomPeer & { isTyping: boolean };
        if (userId) handlers.onTyping({ userId, name }, isTyping);
      })
      .on("broadcast", { event: EVENTS.emoji }, ({ payload }) => {
        const { emoji } = payload as { emoji?: string };
        if (emoji) handlers.onEmoji(emoji);
      });
    channel = next.subscribe((status) => {
      isJoined = status === "SUBSCRIBED";
      if (!isJoined) return;
      // Connected (or back after a drop): whatever changed meanwhile is read once, everywhere.
      for (const table of Object.values(ROOM_TABLES)) handlers.onChange(table);
      if (me) void next.track(me);
    });
  };

  const previous = teardowns.get(topic) ?? Promise.resolve();
  void previous.then(connect);

  const send = (event: string, payload: object) => {
    if (isJoined) void channel?.send({ type: "broadcast", event, payload });
  };

  return {
    track: (peer) => {
      me = peer;
      if (!isJoined || !channel) return;
      void (peer ? channel.track(peer) : channel.untrack());
    },
    sendTyping: (peer, isTyping) => send(EVENTS.typing, { ...peer, isTyping }),
    sendEmoji: (emoji) => send(EVENTS.emoji, { emoji }),
    unsubscribe: () => {
      active = false;
      const removed = previous.then(() => channel && supabase.removeChannel(channel));
      teardowns.set(topic, removed.catch(() => {}));
    },
  };
}
