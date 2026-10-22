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
    const next = supabase.channel(topic);
    for (const table of Object.values(ROOM_TABLES)) {
      const filter = table === ROOM_TABLES.rooms ? `id=eq.${roomId}` : byRoom;
      next.on("postgres_changes", { event: "*", schema: "public", table, filter }, () =>
        onChange(table),
      );
    }
    for (const table of UNFILTERED_DELETES)
      next.on("postgres_changes", { event: "DELETE", schema: "public", table }, () =>
        onChange(table),
      );
    channel = next.subscribe((status) => {
      // Connected (or back after a drop): whatever changed meanwhile is read once, everywhere.
      if (status === "SUBSCRIBED") for (const table of Object.values(ROOM_TABLES)) onChange(table);
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
