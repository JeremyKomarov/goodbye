import type { RealtimeChannel } from "@supabase/supabase-js";
import { browserSupabase } from "./client";

// The room's Realtime channel. It reports *that* something changed, never what: the caller
// invalidates its queries and reads the room again through its handler (docs/DECISIONS.md #2).

/** What changed: the room row, who is in it, who hosts it, or a vote. */
export const ROOM_TABLES = {
  rooms: "rooms",
  players: "players",
  hosts: "room_hosts",
  votes: "votes",
} as const;
export type RoomTable = (typeof ROOM_TABLES)[keyof typeof ROOM_TABLES];

// supabase.channel() hands back a channel with the same topic until its unsubscribe finishes, so a
// quick remount (React's dev double-mount, a room switch) waits for the last teardown first.
const teardowns = new Map<string, Promise<unknown>>();

/**
 * Listens to one room. `onChange` runs for every change, and once each time the channel connects
 * — so whatever changed between the page's read and the connection is read too. Returns the
 * unsubscribe.
 */
export function subscribeToRoom(roomId: string, onChange: (table: RoomTable) => void) {
  const supabase = browserSupabase();
  const topic = `room:${roomId}`;
  const byRoom = `room_id=eq.${roomId}`;
  let channel: RealtimeChannel | null = null;
  let active = true;

  const connect = () => {
    if (!active) return;
    const changes = (table: RoomTable, filter?: string) =>
      ({ event: "*", schema: "public", table, ...(filter && { filter }) }) as const;
    channel = supabase
      .channel(topic)
      .on("postgres_changes", changes(ROOM_TABLES.rooms, `id=eq.${roomId}`), () =>
        onChange(ROOM_TABLES.rooms),
      )
      .on("postgres_changes", changes(ROOM_TABLES.players, byRoom), () =>
        onChange(ROOM_TABLES.players),
      )
      .on("postgres_changes", changes(ROOM_TABLES.hosts, byRoom), () =>
        onChange(ROOM_TABLES.hosts),
      )
      .on("postgres_changes", changes(ROOM_TABLES.votes, byRoom), () =>
        onChange(ROOM_TABLES.votes),
      )
      // A deleted row carries only its key, so a withdrawn vote can't be filtered by room: any
      // withdrawal anywhere invalidates, and the read that follows is what tells.
      .on("postgres_changes", { event: "DELETE", schema: "public", table: ROOM_TABLES.votes }, () =>
        onChange(ROOM_TABLES.votes),
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") onChange(ROOM_TABLES.rooms);
      });
  };

  const previous = teardowns.get(topic) ?? Promise.resolve();
  void previous.then(connect);

  return () => {
    active = false;
    teardowns.set(
      topic,
      previous.then(() => (channel ? supabase.removeChannel(channel) : undefined)).catch(() => {}),
    );
  };
}
