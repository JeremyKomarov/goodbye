"use client";

import type { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/browser";
import type {
  GameId,
  LeaderboardRow,
  Room,
  Vote,
  WallMessage,
} from "@/lib/types";

export type Me = { userId: string; name: string };
export type OnlineUser = { userId: string; name: string };
export type Typer = { userId: string; name: string; until: number };
type PresencePayload = OnlineUser;
type TypingPayload = OnlineUser & { typing: boolean };

/** A "typing" signal expires on its own if the "stopped" message never arrives. */
const TYPING_TTL = 4000;
const typingUntil = () => Date.now() + TYPING_TTL;
type AuthState = "loading" | "join" | "ready";

const MESSAGE_LIMIT = 200;
const teardowns = new Map<string, Promise<void>>();

function upsertById<T extends { id: number }>(list: T[], item: T) {
  const i = list.findIndex((x) => x.id === item.id);
  if (i === -1) return [...list, item];
  const next = list.slice();
  next[i] = item;
  return next;
}

/**
 * Everything live in a room: the room row, players, votes, wall, leaderboard,
 * presence and emoji broadcasts, over one Realtime channel.
 */
export function useRoom(initialRoom: Room) {
  const supabase = getBrowserClient();
  const roomId = initialRoom.id;

  const [room, setRoom] = useState(initialRoom);
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [me, setMe] = useState<Me | null>(null);
  const [players, setPlayers] = useState<Record<string, string>>({});
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const [messages, setMessages] = useState<WallMessage[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [online, setOnline] = useState<OnlineUser[]>([]);
  const [typers, setTypers] = useState<Record<string, Typer>>({});
  const [loaded, setLoaded] = useState(false);
  // Newest message id at first load; anything newer counts as unread.
  const [baselineMessageId, setBaselineMessageId] = useState<number | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const meRef = useRef<Me | null>(null);
  const rainListeners = useRef(new Set<(emoji: string) => void>());
  const leaderboardTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const votesRef = useRef(votes);

  useEffect(() => {
    votesRef.current = votes;
  }, [votes]);

  const refreshLeaderboard = useCallback(() => {
    if (leaderboardTimer.current) clearTimeout(leaderboardTimer.current);
    leaderboardTimer.current = setTimeout(async () => {
      const { data } = await supabase
        .from("leaderboard")
        .select("*")
        .eq("room_id", roomId);
      if (data) setLeaderboard(data as LeaderboardRow[]);
    }, 300);
  }, [supabase, roomId]);

  // Who am I? Returning visitors keep their anonymous session and player row.
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      if (!user) {
        if (!cancelled) setAuthState("join");
        return;
      }
      const { data: player } = await supabase
        .from("players")
        .select("display_name")
        .eq("room_id", roomId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (player) {
        const next = { userId: user.id, name: player.display_name as string };
        meRef.current = next;
        setMe(next);
        setAuthState("ready");
      } else {
        setAuthState("join");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [supabase, roomId]);

  // Live data. Subscribe first, then load, so nothing slips between the two.
  useEffect(() => {
    const topic = `room:${roomId}`;
    let channel: RealtimeChannel | null = null;
    let active = true;
    const byRoom = `room_id=eq.${roomId}`;

    const load = async () => {
      const [r, p, v, m, l] = await Promise.all([
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
        supabase.from("leaderboard").select("*").eq("room_id", roomId),
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
      if (l.data) setLeaderboard(l.data as LeaderboardRow[]);
      setLoaded(true);
    };

    const connect = () => {
      if (!active) return;
      const ch = supabase.channel(topic, { config: { presence: { key: "" } } });
      channel = ch;
      channelRef.current = ch;
      ch
      .on(
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
            upsertById(prev, payload.new as WallMessage).slice(-MESSAGE_LIMIT),
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
        { event: "INSERT", schema: "public", table: "scores", filter: byRoom },
        () => refreshLeaderboard(),
      )
      .on("presence", { event: "sync" }, () => {
        const state = ch.presenceState<PresencePayload>();
        const seen = new Map<string, OnlineUser>();
        for (const entries of Object.values(state)) {
          for (const entry of entries) seen.set(entry.userId, { userId: entry.userId, name: entry.name });
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
          if (p.typing) next[p.userId] = { userId: p.userId, name: p.name, until };
          else delete next[p.userId];
          return next;
        });
      })
      .on("broadcast", { event: "emoji" }, ({ payload }) => {
        const emoji = (payload as { emoji?: string }).emoji;
        if (emoji) rainListeners.current.forEach((listener) => listener(emoji));
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
      const done = previous.then(() => (channel ? supabase.removeChannel(channel) : undefined)).then(
        () => undefined,
        () => undefined,
      );
      teardowns.set(topic, done);
    };
  }, [supabase, roomId, refreshLeaderboard]);

  const join = useCallback(
    async (rawName: string) => {
      const name = rawName.trim().slice(0, 24);
      if (!name) return "צריך שם כדי להיכנס";
      let { data } = await supabase.auth.getSession();
      if (!data.session) {
        const { error } = await supabase.auth.signInAnonymously();
        if (error) return "לא הצלחנו להכניס אותך. נסו לרענן את הדף";
        ({ data } = await supabase.auth.getSession());
      }
      const userId = data.session!.user.id;
      const { error } = await supabase
        .from("players")
        .upsert(
          { room_id: roomId, user_id: userId, display_name: name },
          { onConflict: "room_id,user_id" },
        );
      if (error) return "לא הצלחנו לשמור את השם. נסו שוב";
      const next = { userId, name };
      meRef.current = next;
      setMe(next);
      setPlayers((prev) => ({ ...prev, [userId]: name }));
      setAuthState("ready");
      channelRef.current?.track(next);
      return null;
    },
    [supabase, roomId],
  );

  /** Cast, move or withdraw (`null`) your vote. Returns an error message or null. */
  const vote = useCallback(
    async (slotMs: number | null) => {
      const current = meRef.current;
      if (!current) return "צריך להיכנס עם שם קודם";
      const before = votesRef.current[current.userId];
      setVotes((prev) => {
        const next = { ...prev };
        if (slotMs === null) delete next[current.userId];
        else
          next[current.userId] = {
            id: before?.id ?? -1,
            room_id: roomId,
            user_id: current.userId,
            slot_start: new Date(slotMs).toISOString(),
          };
        return next;
      });

      const result =
        slotMs === null
          ? await supabase
              .from("votes")
              .delete()
              .eq("room_id", roomId)
              .eq("user_id", current.userId)
          : await supabase
              .from("votes")
              .upsert(
                {
                  room_id: roomId,
                  user_id: current.userId,
                  slot_start: new Date(slotMs).toISOString(),
                  updated_at: new Date().toISOString(),
                },
                { onConflict: "room_id,user_id" },
              )
              .select("id, room_id, user_id, slot_start")
              .single();

      if (result.error) {
        setVotes((prev) => {
          const next = { ...prev };
          if (before) next[current.userId] = before;
          else delete next[current.userId];
          return next;
        });
        return "ההצבעה כבר נסגרה או שהשעה הזו לא זמינה";
      }
      if (slotMs !== null && result.data) {
        const saved = result.data as Vote;
        setVotes((prev) => ({ ...prev, [saved.user_id]: saved }));
      }
      return null;
    },
    [supabase, roomId],
  );

  const postMessage = useCallback(
    async (body: string) => {
      const current = meRef.current;
      const text = body.trim();
      if (!current || !text) return "אין מה לשלוח";
      const { data, error } = await supabase
        .from("wall_messages")
        .insert({
          room_id: roomId,
          display_name: current.name,
          body: text.slice(0, 140),
        })
        .select("*")
        .single();
      if (error) return "רגע, לאט. אפשר לשלוח הודעה כל כמה שניות";
      setMessages((prev) => upsertById(prev, data as WallMessage));
      return null;
    },
    [supabase, roomId],
  );

  const submitScore = useCallback(
    async (game: GameId, score: number) => {
      if (!meRef.current) return;
      await supabase
        .from("scores")
        .insert({ room_id: roomId, game, score: Math.round(score) });
      refreshLeaderboard();
    },
    [supabase, roomId, refreshLeaderboard],
  );

  const setTyping = useCallback((typing: boolean) => {
    if (!meRef.current) return;
    const payload: TypingPayload = { ...meRef.current, typing };
    channelRef.current?.send({ type: "broadcast", event: "typing", payload });
  }, []);

  const sendEmoji = useCallback((emoji: string) => {
    rainListeners.current.forEach((listener) => listener(emoji));
    channelRef.current?.send({
      type: "broadcast",
      event: "emoji",
      payload: { emoji },
    });
  }, []);

  const onRain = useCallback((listener: (emoji: string) => void) => {
    rainListeners.current.add(listener);
    return () => {
      rainListeners.current.delete(listener);
    };
  }, []);

  /** Ask the database to lock the winning slot once voting time is over. */
  const finalize = useCallback(async () => {
    const { data } = await supabase.rpc("finalize_room", {
      p_slug: initialRoom.slug,
    });
    if (data) setRoom(data as Room);
    return data as Room | null;
  }, [supabase, initialRoom.slug]);

  return {
    room,
    authState,
    me,
    players,
    votes,
    messages,
    leaderboard,
    online,
    typers,
    loaded,
    baselineMessageId,
    join,
    vote,
    postMessage,
    submitScore,
    setTyping,
    sendEmoji,
    onRain,
    finalize,
  };
}

export type RoomApi = ReturnType<typeof useRoom>;
