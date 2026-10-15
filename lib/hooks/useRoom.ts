"use client";

import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { ensureLoginCode } from "@/app/actions";
import { claimHost } from "@/app/r/[slug]/admin/actions";
import { loadAdminToken } from "@/lib/admin-storage";
import { captchaToken } from "@/lib/captcha";
import {
  loadLoginCode,
  loginEmail,
  normalizeCode,
  sameName,
  saveLoginCode,
} from "@/lib/login";
import {
  isReaction,
  type ReactionEmoji,
  type ReactionMap,
  type WallReaction,
  withReaction,
} from "@/lib/reactions";
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
/** join() and rename() return this when someone in the room already has the name. */
export const NAME_TAKEN = "השם הזה כבר תפוס בחדר. אולי עם אות משם המשפחה?";
const teardowns = new Map<string, Promise<void>>();

/** This browser's anonymous session, signing in first if there isn't one yet. */
async function ensureSession(supabase: SupabaseClient) {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session;
  const { data: signedIn } = await supabase.auth.signInAnonymously({
    options: { captchaToken: await captchaToken() },
  });
  return signedIn.session;
}

/** Best effort: if claiming the host fails (offline, old room), the room still works. */
function claimRoom(slug: string, token: string, accessToken: string) {
  return claimHost(slug, token, accessToken).catch(() => ({ ok: false }));
}

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
  // True when this browser had already joined the room on an earlier visit.
  const [returning, setReturning] = useState(false);
  const [players, setPlayers] = useState<Record<string, string>>({});
  // The host's user ids (one per device they've opened the room on).
  const [hosts, setHosts] = useState<string[]>([]);
  const [reactions, setReactions] = useState<ReactionMap>({});
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const [messages, setMessages] = useState<WallMessage[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [online, setOnline] = useState<OnlineUser[]>([]);
  const [typers, setTypers] = useState<Record<string, Typer>>({});
  const [loaded, setLoaded] = useState(false);
  // Newest message id at first load; anything newer counts as unread.
  const [baselineMessageId, setBaselineMessageId] = useState<number | null>(
    null,
  );

  const channelRef = useRef<RealtimeChannel | null>(null);
  const meRef = useRef<Me | null>(null);
  const rainListeners = useRef(new Set<(emoji: string) => void>());
  const leaderboardTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const votesRef = useRef(votes);
  const reactionsRef = useRef(reactions);

  useEffect(() => {
    votesRef.current = votes;
  }, [votes]);

  useEffect(() => {
    reactionsRef.current = reactions;
  }, [reactions]);

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

  const join = useCallback(
    async (rawName: string) => {
      const name = rawName.trim().slice(0, 24);
      if (!name) return "צריך שם כדי להיכנס";
      const session = await ensureSession(supabase);
      if (!session) return "לא הצלחנו להכניס אותך. נסו לרענן את הדף";
      const userId = session.user.id;
      // The host claims the room first, so the name reserved for them is theirs to take.
      const adminToken = loadAdminToken(initialRoom.slug);
      if (adminToken)
        await claimRoom(initialRoom.slug, adminToken, session.access_token);
      const { error } = await supabase
        .from("players")
        .upsert(
          { room_id: roomId, user_id: userId, display_name: name },
          { onConflict: "room_id,user_id" },
        );
      if (error)
        return error.code === "23505"
          ? NAME_TAKEN
          : "לא הצלחנו לשמור את השם. נסו שוב";
      const next = { userId, name };
      meRef.current = next;
      setMe(next);
      setPlayers((prev) => ({ ...prev, [userId]: name }));
      setAuthState("ready");
      // If the channel isn't up yet, it tracks us once it subscribes.
      if (channelRef.current?.state === "joined")
        channelRef.current.track(next);
      return null;
    },
    [supabase, roomId, initialRoom.slug],
  );

  // Who am I? Returning visitors keep their anonymous session and player row.
  // The host (this browser holds the room's admin token) skips the name prompt
  // and comes in under the name they gave when creating the room.
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      const { data: player } = user
        ? await supabase
            .from("players")
            .select("display_name")
            .eq("room_id", roomId)
            .eq("user_id", user.id)
            .maybeSingle()
        : { data: null };
      if (cancelled) return;
      if (user && player) {
        const next = { userId: user.id, name: player.display_name as string };
        meRef.current = next;
        setMe(next);
        setReturning(true);
        setAuthState("ready");
        // If the channel subscribed before we knew who we are, it skipped tracking us.
        if (channelRef.current?.state === "joined")
          channelRef.current.track(next);
        // Rooms from before hosts were recorded learn who the host is here (it's idempotent).
        const adminToken = loadAdminToken(initialRoom.slug);
        if (adminToken && data.session)
          void claimRoom(
            initialRoom.slug,
            adminToken,
            data.session.access_token,
          );
        return;
      }
      // join() marks us ready; if it fails, fall back to asking for a name.
      if (
        loadAdminToken(initialRoom.slug) &&
        !(await join(initialRoom.host_name))
      )
        return;
      if (!cancelled) setAuthState("join");
    });
    return () => {
      cancelled = true;
    };
  }, [supabase, roomId, join, initialRoom.slug, initialRoom.host_name]);

  // Live data. Subscribe first, then load, so nothing slips between the two.
  useEffect(() => {
    const topic = `room:${roomId}`;
    let channel: RealtimeChannel | null = null;
    let active = true;
    const byRoom = `room_id=eq.${roomId}`;

    const load = async () => {
      const [r, p, v, m, l, h, x] = await Promise.all([
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
      if (l.data) setLeaderboard(l.data as LeaderboardRow[]);
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
  }, [supabase, roomId, refreshLeaderboard]);

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

  /** React to a wall message, change the reaction, or take it back (`null`). */
  const react = useCallback(
    async (messageId: number, emoji: ReactionEmoji | null) => {
      const current = meRef.current;
      if (!current) return;
      const before = reactionsRef.current[messageId]?.[current.userId];
      const apply = (value: ReactionEmoji | undefined) =>
        setReactions((prev) =>
          withReaction(prev, messageId, current.userId, value),
        );
      apply(emoji ?? undefined);
      const { error } = emoji
        ? await supabase.from("wall_reactions").upsert(
            {
              message_id: messageId,
              room_id: roomId,
              user_id: current.userId,
              emoji,
            },
            { onConflict: "message_id,user_id" },
          )
        : await supabase
            .from("wall_reactions")
            .delete()
            .eq("message_id", messageId)
            .eq("user_id", current.userId);
      if (error) apply(before);
    },
    [supabase, roomId],
  );

  /** Change your name in this room. Returns an error message or null. */
  const rename = useCallback(
    async (rawName: string) => {
      const current = meRef.current;
      const name = rawName.trim().slice(0, 24);
      if (!current) return "צריך להיכנס קודם";
      if (!name) return "צריך שם";
      if (name === current.name) return null;
      const { error } = await supabase
        .from("players")
        .update({ display_name: name })
        .eq("room_id", roomId)
        .eq("user_id", current.userId);
      if (error)
        return error.code === "23505"
          ? NAME_TAKEN
          : "לא הצלחנו לשנות את השם. נסו שוב";
      const next = { ...current, name };
      meRef.current = next;
      setMe(next);
      setPlayers((prev) => ({ ...prev, [current.userId]: name }));
      if (channelRef.current?.state === "joined")
        channelRef.current.track(next);
      return null;
    },
    [supabase, roomId],
  );

  /**
   * Your code for coming in as yourself on another device (made on first ask, or
   * again with `fresh`, which retires the old one). The host can look it up too.
   */
  const loginCode = useCallback(
    async (fresh = false) => {
      const current = meRef.current;
      if (!current) return null;
      const saved = fresh ? null : loadLoginCode(current.userId);
      if (saved) return saved;
      const { data } = await supabase.auth.getSession();
      if (!data.session || data.session.user.id !== current.userId) return null;
      const result = await ensureLoginCode(
        data.session.access_token,
        fresh,
      ).catch(() => ({ ok: false }) as const);
      if (!result.ok) return null;
      saveLoginCode(current.userId, result.code);
      if (!result.created) return result.code;
      // A new code signs out every session of this user, this one included.
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail(current.userId),
        password: result.code,
      });
      return error ? null : result.code;
    },
    [supabase],
  );

  // Every player gets a code as they come in, so if they ever need it on another
  // device and can't find it, the host can send it. Not the host: they have the
  // admin link. Until a player has a code they're signed in on this device only,
  // so making one (which signs out their sessions) only touches this one.
  useEffect(() => {
    if (authState !== "ready" || !me || loadAdminToken(initialRoom.slug))
      return;
    void loginCode();
  }, [authState, me, loginCode, initialRoom.slug]);

  /** Come in as a player who joined on another device, with their code. */
  const signInAs = useCallback(
    async (rawName: string, rawCode: string) => {
      const { data: rows } = await supabase
        .from("players")
        .select("user_id, display_name")
        .eq("room_id", roomId);
      const player = rows?.find((p) => sameName(p.display_name, rawName));
      if (!player) return "אין בחדר מישהו בשם הזה";
      const code = normalizeCode(rawCode);
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail(player.user_id),
        password: code,
      });
      if (error)
        return error.status === 429
          ? "יותר מדי ניסיונות. נסו שוב בעוד כמה דקות"
          : "הקוד לא מתאים. בודקים אותו שוב במכשיר הראשון";
      const next = { userId: player.user_id, name: player.display_name };
      meRef.current = next;
      setMe(next);
      setReturning(true);
      setAuthState("ready");
      if (channelRef.current?.state === "joined")
        channelRef.current.track(next);
      return null;
    },
    [supabase, roomId],
  );

  /**
   * "Not you?": forget who this browser is (in every room, since the anonymous
   * session is per browser) and ask for a name again.
   */
  const switchUser = useCallback(async () => {
    if (channelRef.current?.state === "joined") channelRef.current.untrack();
    await supabase.auth.signOut({ scope: "local" });
    meRef.current = null;
    setMe(null);
    setReturning(false);
    setAuthState("join");
  }, [supabase]);

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
    returning,
    players,
    hosts,
    reactions,
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
    react,
    rename,
    switchUser,
    loginCode,
    signInAs,
    submitScore,
    setTyping,
    sendEmoji,
    onRain,
    finalize,
  };
}

export type RoomApi = ReturnType<typeof useRoom>;
