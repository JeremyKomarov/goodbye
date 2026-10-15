"use client";

import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { useEffect, type Dispatch, type RefObject, type SetStateAction } from "react";
import { isReaction, type ReactionMap, type WallReaction, withReaction } from "@/core/reactions";
import type { Room, Vote, WallMessage } from "@/core/types";
import type { Me, OnlineUser, Typer } from "./useRoom";

const MESSAGE_LIMIT = 200;
const TYPING_TTL = 4000;
const typingUntil = () => Date.now() + TYPING_TTL;
const teardowns = new Map<string, Promise<void>>();
type PresencePayload = OnlineUser;
type TypingPayload = OnlineUser & { typing: boolean };
type Setter<T> = Dispatch<SetStateAction<T>>;

function upsertById<T extends { id: number }>(list: T[], item: T) {
  const i = list.findIndex((x) => x.id === item.id);
  if (i === -1) return [...list, item];
  const next = list.slice();
  next[i] = item;
  return next;
}

type RealtimeArgs = {
  supabase: SupabaseClient;
  roomId: Room["id"];
  channelRef: RefObject<RealtimeChannel | null>;
  meRef: RefObject<Me | null>;
  rainListeners: RefObject<Set<(emoji: string) => void>>;
  refreshLeaderboard: () => void;
  setRoom: Setter<Room>;
  setPlayers: Setter<Record<string, string>>;
  setVotes: Setter<Record<string, Vote>>;
  setMessages: Setter<WallMessage[]>;
  setBaselineMessageId: Setter<number | null>;
  setHosts: Setter<string[]>;
  setReactions: Setter<ReactionMap>;
  setLoaded: Setter<boolean>;
  setOnline: Setter<OnlineUser[]>;
  setTypers: Setter<Record<string, Typer>>;
};

export function useRoomRealtime({ supabase, roomId, channelRef, meRef, rainListeners, refreshLeaderboard, setRoom, setPlayers, setVotes, setMessages, setBaselineMessageId, setHosts, setReactions, setLoaded, setOnline, setTypers }: RealtimeArgs) {
  // Live data. Subscribe first, then load, so nothing slips between the two.
  useEffect(() => {
    const topic = `room:${roomId}`;
    let channel: RealtimeChannel | null = null;
    let active = true;
    const byRoom = `room_id=eq.${roomId}`;

    const load = async () => {
      const [r, p, v, m, h, x] = await Promise.all([
        supabase.from("rooms").select("*").eq("id", roomId).single(),
        supabase
          .from("players")
          .select("user_id, display_name")
          .eq("room_id", roomId),
        supabase
          .from("votes")
          .select("id, room_id, user_id, slot_start")
          .eq("room_id", roomId),
        supabase
          .from("wall_messages")
          .select("*")
          .eq("room_id", roomId)
          .order("created_at", { ascending: false })
          .limit(MESSAGE_LIMIT),
        supabase.from("room_hosts").select("user_id").eq("room_id", roomId),
        supabase
          .from("wall_reactions")
          .select("message_id, user_id, emoji")
          .eq("room_id", roomId),
      ]);
      if (r.data) setRoom(r.data as Room);
      if (p.data)
        setPlayers(
          Object.fromEntries(p.data.map((x) => [x.user_id, x.display_name])),
        );
      if (v.data)
        setVotes(
          Object.fromEntries((v.data as Vote[]).map((x) => [x.user_id, x])),
        );
      if (m.data) {
        const list = (m.data as WallMessage[]).reverse();
        setMessages(list);
        setBaselineMessageId((prev) => prev ?? list.at(-1)?.id ?? 0);
      }
      if (h.data) setHosts(h.data.map((row) => row.user_id as string));
      if (x.data) {
        const map: ReactionMap = {};
        for (const row of x.data as WallReaction[])
          (map[row.message_id] ??= {})[row.user_id] = row.emoji;
        setReactions(map);
      }
      setLoaded(true);
    };

    const connect = () => {
      if (!active) return;
      const ch = supabase.channel(topic, { config: { presence: { key: "" } } });
      channel = ch;
      channelRef.current = ch;
      ch.on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => setRoom(payload.new as Room),
      )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "players", filter: byRoom },
          (payload) => {
            const row = payload.new as {
              user_id?: string;
              display_name?: string;
            };
            if (row.user_id && row.display_name)
              setPlayers((prev) => ({
                ...prev,
                [row.user_id!]: row.display_name!,
              }));
          },
        )
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "votes", filter: byRoom },
          (payload) => {
            const vote = payload.new as Vote;
            setVotes((prev) => ({ ...prev, [vote.user_id]: vote }));
          },
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "votes", filter: byRoom },
          (payload) => {
            const vote = payload.new as Vote;
            setVotes((prev) => ({ ...prev, [vote.user_id]: vote }));
          },
        )
        // Delete events can't be filtered and only carry the primary key.
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "votes" },
          (payload) => {
            const id = (payload.old as { id?: number }).id;
            setVotes((prev) => {
              const entry = Object.values(prev).find((x) => x.id === id);
              if (!entry) return prev;
              const next = { ...prev };
              delete next[entry.user_id];
              return next;
            });
          },
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "wall_messages",
            filter: byRoom,
          },
          (payload) =>
            setMessages((prev) =>
              upsertById(prev, payload.new as WallMessage).slice(
                -MESSAGE_LIMIT,
              ),
            ),
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "wall_messages" },
          (payload) => {
            const id = (payload.old as { id?: number }).id;
            setMessages((prev) => prev.filter((x) => x.id !== id));
          },
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "room_hosts",
            filter: byRoom,
          },
          (payload) => {
            const id = (payload.new as { user_id?: string }).user_id;
            if (id)
              setHosts((prev) => (prev.includes(id) ? prev : [...prev, id]));
          },
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "wall_reactions",
            filter: byRoom,
          },
          (payload) => {
            if (payload.eventType === "DELETE") return;
            const row = payload.new as WallReaction;
            if (isReaction(row.emoji))
              setReactions((prev) =>
                withReaction(prev, row.message_id, row.user_id, row.emoji),
              );
          },
        )
        // Like votes: unfiltered, primary key only (message id and user id).
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "wall_reactions" },
          (payload) => {
            const row = payload.old as Partial<WallReaction>;
            if (row.message_id !== undefined && row.user_id)
              setReactions((prev) =>
                withReaction(prev, row.message_id!, row.user_id!, undefined),
              );
          },
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "scores",
            filter: byRoom,
          },
          () => refreshLeaderboard(),
        )
        .on("presence", { event: "sync" }, () => {
          const state = ch.presenceState<PresencePayload>();
          const seen = new Map<string, OnlineUser>();
          for (const entries of Object.values(state)) {
            for (const entry of entries)
              seen.set(entry.userId, {
                userId: entry.userId,
                name: entry.name,
              });
          }
          setOnline([...seen.values()]);
        })
        // Typing goes over broadcast: presence diffs arrive ~2s late, too slow for "typing…".
        .on("broadcast", { event: "typing" }, ({ payload }) => {
          const p = payload as TypingPayload;
          if (!p?.userId) return;
          const until = p.typing ? typingUntil() : 0;
          setTypers((prev) => {
            const next = { ...prev };
            if (p.typing)
              next[p.userId] = { userId: p.userId, name: p.name, until };
            else delete next[p.userId];
            return next;
          });
        })
        .on("broadcast", { event: "emoji" }, ({ payload }) => {
          const emoji = (payload as { emoji?: string }).emoji;
          if (emoji)
            rainListeners.current.forEach((listener) => listener(emoji));
        })
        .subscribe((status) => {
          if (status !== "SUBSCRIBED") return;
          load();
          if (meRef.current) ch.track(meRef.current);
        });
    };

    // supabase.channel() reuses a channel with the same topic until its unsubscribe
    // finishes, so wait for any earlier teardown (React dev remounts, room switches).
    const previous = teardowns.get(topic) ?? Promise.resolve();
    previous.then(connect);

    return () => {
      active = false;
      channelRef.current = null;
      const done = previous
        .then(() => (channel ? supabase.removeChannel(channel) : undefined))
        .then(
          () => undefined,
          () => undefined,
        );
      teardowns.set(topic, done);
    };
  }, [supabase, roomId, channelRef, meRef, rainListeners, refreshLeaderboard, setRoom, setPlayers, setVotes, setMessages, setBaselineMessageId, setHosts, setReactions, setLoaded, setOnline, setTypers]);

}
