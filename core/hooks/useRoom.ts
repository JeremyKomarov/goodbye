"use client";

import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRoomRealtime } from "@/core/hooks/useRoomRealtime";
import { useRoomActions } from "@/core/hooks/useRoomActions";
import { useCallback, useEffect, useRef, useState } from "react";
import { claimHost } from "@/app/r/[slug]/admin/actions";
import { loadAdminToken } from "@/core/admin-storage";
import { captchaToken } from "@/core/captcha";
import { type ReactionMap } from "@/core/reactions";
import { NAME_TAKEN } from "@/core/room/messages";
import { localize } from "@/core/i18n/useLocale";
import { getBrowserClient } from "@/core/supabase/browser";
import type {
  LeaderboardRow,
  Room,
  Vote,
  WallMessage,
} from "@/core/types";

export type Me = { userId: string; name: string };
export type OnlineUser = { userId: string; name: string };
export type Typer = { userId: string; name: string; until: number };

type AuthState = "loading" | "join" | "ready";

/** join() and rename() return this when someone in the room already has the name. */
export { NAME_TAKEN } from "@/core/room/messages";

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

/**
 * Everything live in a room: the room row, players, votes, wall, leaderboard,
 * presence and emoji broadcasts, over one Realtime channel.
 */
export function useRoom(initialRoom: Room) {
  const supabase = getBrowserClient();
  const roomId = initialRoom.id;
  const queryClient = useQueryClient();

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
  const { data: leaderboard = [] } = useQuery({
    queryKey: ["room", roomId, "leaderboard"],
    enabled: authState === "ready",
    queryFn: async () => {
      const { data, error } = await supabase.from("leaderboard").select("*").eq("room_id", roomId);
      if (error) throw error;
      return data as LeaderboardRow[];
    },
  });
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
    leaderboardTimer.current = setTimeout(() => {
      void queryClient.invalidateQueries({ queryKey: ["room", roomId, "leaderboard"] });
    }, 300);
  }, [queryClient, roomId]);

  const join = useCallback(
    async (rawName: string) => {
      const name = rawName.trim().slice(0, 24);
      if (!name) return localize("joinNameRequired");
      const session = await ensureSession(supabase);
      if (!session) return localize("joinFailed");
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
          : localize("saveNameFailed");
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

  useRoomRealtime({ supabase, roomId, channelRef, meRef, rainListeners, refreshLeaderboard, setRoom, setPlayers, setVotes, setMessages, setBaselineMessageId, setHosts, setReactions, setLoaded, setOnline, setTypers });

  const { vote, postMessage, react, rename, switchUser, loginCode, signInAs, submitScore, setTyping, rain, sendEmoji, onRain, finalize, markExit } = useRoomActions({ initialRoom, supabase, roomId, authState, me, meRef, channelRef, votesRef, reactionsRef, rainListeners, refreshLeaderboard, setVotes, setMessages, setReactions, setMe, setPlayers, setReturning, setAuthState, setRoom });

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
    rain,
    sendEmoji,
    onRain,
    finalize,
    markExit,
  };
}

export type RoomApi = ReturnType<typeof useRoom>;
