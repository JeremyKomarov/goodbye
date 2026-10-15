"use client";

import { useCallback, useEffect } from "react";
import { ensureLoginCode } from "@/app/actions";
import { loadAdminToken } from "@/core/admin-storage";
import { localize } from "@/core/i18n/useLocale";
import { loadLoginCode, loginEmail, normalizeCode, sameName, saveLoginCode } from "@/core/login";
import { NAME_TAKEN } from "@/core/room/messages";
import type { ActionArgs } from "./useRoomActions";

type IdentityArgs = Pick<ActionArgs,
  "initialRoom" | "supabase" | "roomId" | "authState" | "me" | "meRef" |
  "channelRef" | "setMe" | "setPlayers" | "setReturning" | "setAuthState"
>;

export function useRoomIdentityActions({ initialRoom, supabase, roomId, authState, me,
  meRef, channelRef, setMe, setPlayers, setReturning, setAuthState }: IdentityArgs) {
  /** Change your name in this room. Returns an error message or null. */
  const rename = useCallback(
    async (rawName: string) => {
      const current = meRef.current;
      const name = rawName.trim().slice(0, 24);
      if (!current) return localize("signInFirst");
      if (!name) return localize("nameRequired");
      if (name === current.name) return null;
      const { error } = await supabase
        .from("players")
        .update({ display_name: name })
        .eq("room_id", roomId)
        .eq("user_id", current.userId);
      if (error)
        return error.code === "23505"
          ? NAME_TAKEN
          : localize("renameFailed");
      const next = { ...current, name };
      meRef.current = next;
      setMe(next);
      setPlayers((prev) => ({ ...prev, [current.userId]: name }));
      if (channelRef.current?.state === "joined")
        channelRef.current.track(next);
      return null;
    },
    [supabase, roomId, channelRef, meRef, setMe, setPlayers],
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
    [supabase, meRef],
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
      if (!player) return localize("playerNotFound");
      const code = normalizeCode(rawCode);
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail(player.user_id),
        password: code,
      });
      if (error)
        return error.status === 429
          ? localize("tooManyAttempts")
          : localize("invalidLoginCode");
      const next = { userId: player.user_id, name: player.display_name };
      meRef.current = next;
      setMe(next);
      setReturning(true);
      setAuthState("ready");
      if (channelRef.current?.state === "joined")
        channelRef.current.track(next);
      return null;
    },
    [supabase, roomId, channelRef, meRef, setAuthState, setMe, setReturning],
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
  }, [supabase, channelRef, meRef, setAuthState, setMe, setReturning]);

  return { rename, loginCode, signInAs, switchUser };
}
