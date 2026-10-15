"use client";

import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { useCallback, type Dispatch, type RefObject, type SetStateAction } from "react";
import { markExited } from "@/app/r/[slug]/admin/actions";
import { loadAdminToken } from "@/core/admin-storage";
import { localize } from "@/core/i18n/useLocale";
import { type ReactionEmoji, type ReactionMap, withReaction } from "@/core/reactions";
import type { GameId, Room, Vote, WallMessage } from "@/core/types";
import type { Me } from "./useRoom";
import { useRoomIdentityActions } from "./useRoomIdentityActions";

type TypingPayload = Me & { typing: boolean };
type Setter<T> = Dispatch<SetStateAction<T>>;
type AuthState = "loading" | "join" | "ready";

function upsertById<T extends { id: number }>(list: T[], item: T) {
  const i = list.findIndex((x) => x.id === item.id);
  if (i === -1) return [...list, item];
  const next = list.slice();
  next[i] = item;
  return next;
}

export type ActionArgs = {
  initialRoom: Room;
  supabase: SupabaseClient;
  roomId: Room["id"];
  authState: AuthState;
  me: Me | null;
  meRef: RefObject<Me | null>;
  channelRef: RefObject<RealtimeChannel | null>;
  votesRef: RefObject<Record<string, Vote>>;
  reactionsRef: RefObject<ReactionMap>;
  rainListeners: RefObject<Set<(emoji: string) => void>>;
  refreshLeaderboard: () => void;
  setVotes: Setter<Record<string, Vote>>;
  setMessages: Setter<WallMessage[]>;
  setReactions: Setter<ReactionMap>;
  setMe: Setter<Me | null>;
  setPlayers: Setter<Record<string, string>>;
  setReturning: Setter<boolean>;
  setAuthState: Setter<AuthState>;
  setRoom: Setter<Room>;
};

export function useRoomActions({ initialRoom, supabase, roomId, authState, me, meRef, channelRef, votesRef, reactionsRef, rainListeners, refreshLeaderboard, setVotes, setMessages, setReactions, setMe, setPlayers, setReturning, setAuthState, setRoom }: ActionArgs) {
  /** Cast, move or withdraw (`null`) your vote. Returns an error message or null. */
  const vote = useCallback(
    async (slotMs: number | null) => {
      const current = meRef.current;
      if (!current) return localize("signInBeforeVoting");
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
        return localize("votingUnavailable");
      }
      if (slotMs !== null && result.data) {
        const saved = result.data as Vote;
        setVotes((prev) => ({ ...prev, [saved.user_id]: saved }));
      }
      return null;
    },
    [supabase, roomId, meRef, setVotes, votesRef],
  );

  const postMessage = useCallback(
    async (body: string) => {
      const current = meRef.current;
      const text = body.trim();
      if (!current || !text) return localize("emptyMessage");
      const { data, error } = await supabase
        .from("wall_messages")
        .insert({
          room_id: roomId,
          display_name: current.name,
          body: text.slice(0, 140),
        })
        .select("*")
        .single();
      if (error) return localize("messageRateLimit");
      setMessages((prev) => upsertById(prev, data as WallMessage));
      return null;
    },
    [supabase, roomId, meRef, setMessages],
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
    [supabase, roomId, meRef, reactionsRef, setReactions],
  );

  const { rename, loginCode, signInAs, switchUser } = useRoomIdentityActions({
    initialRoom, supabase, roomId, authState, me, meRef, channelRef,
    setMe, setPlayers, setReturning, setAuthState,
  });

  const submitScore = useCallback(
    async (game: GameId, score: number) => {
      if (!meRef.current) return;
      await supabase
        .from("scores")
        .insert({ room_id: roomId, game, score: Math.round(score) });
      refreshLeaderboard();
    },
    [supabase, roomId, refreshLeaderboard, meRef],
  );

  const setTyping = useCallback((typing: boolean) => {
    if (!meRef.current) return;
    const payload: TypingPayload = { ...meRef.current, typing };
    channelRef.current?.send({ type: "broadcast", event: "typing", payload });
  }, [channelRef, meRef]);

  /** Emoji rain on this screen only (every screen has the same clock, so no broadcast). */
  const rain = useCallback((emoji: string) => {
    rainListeners.current.forEach((listener) => listener(emoji));
  }, [rainListeners]);

  const sendEmoji = useCallback((emoji: string) => {
    rain(emoji);
    channelRef.current?.send({
      type: "broadcast",
      event: "emoji",
      payload: { emoji },
    });
  }, [rain, channelRef]);

  const onRain = useCallback((listener: (emoji: string) => void) => {
    rainListeners.current.add(listener);
    return () => {
      rainListeners.current.delete(listener);
    };
  }, [rainListeners]);

  /** Ask the database to lock the winning slot once voting time is over. */
  const finalize = useCallback(async () => {
    const { data } = await supabase.rpc("finalize_room", {
      p_slug: initialRoom.slug,
    });
    if (data) setRoom(data as Room);
    return data as Room | null;
  }, [supabase, initialRoom.slug, setRoom]);

  /** The host: "I left the group", from inside the room (the admin page has it too). */
  const markExit = useCallback(async () => {
    const token = loadAdminToken(initialRoom.slug);
    if (!token) return localize("hostOnlyExit");
    const result = await markExited(initialRoom.slug, token).catch(() => null);
    if (!result?.ok) return result?.error ?? localize("actionFailed");
    setRoom(result.room);
    return null;
  }, [initialRoom.slug, setRoom]);

  return { vote, postMessage, react, rename, switchUser, loginCode, signInAs, submitScore, setTyping, rain, sendEmoji, onRain, finalize, markExit };
}
