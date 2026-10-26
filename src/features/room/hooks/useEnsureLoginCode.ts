import { useEffect } from "react";
import { restoreSession } from "@/core/supabase/session";
import type { Player } from "@/features/room/types/room.types";
import { loadLoginCode } from "@/shared/utils/loginCodes";
import { useLoginCode } from "./useLoginCode";

/**
 * Every player gets a code as they come in, so the host can send it if they ever need it on
 * another device and lost it. Not the host — they have the admin link. Until a player has a code
 * they are signed in on this device only, so making one (which signs every session out) touches
 * only this one. A player who has one is signed back in with it if a new code signed this browser
 * out before it could (`restoreSession`). Returns the code mutation for the sheet that shows it.
 */
export function useEnsureLoginCode(me: Player | null, isHost: boolean) {
  const loginCode = useLoginCode(me?.userId);
  const { mutate, isIdle } = loginCode;
  const needsCode = !!me && !isHost && !loadLoginCode(me.userId);
  const hasCode = !!me && !needsCode;

  useEffect(() => {
    if (hasCode) void restoreSession(loadLoginCode);
  }, [hasCode]);

  useEffect(() => {
    if (needsCode && isIdle) mutate(false);
  }, [needsCode, isIdle, mutate]);

  return loginCode;
}
