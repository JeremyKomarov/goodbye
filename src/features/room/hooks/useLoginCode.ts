import { useMutation } from "@tanstack/react-query";
import { holdingSession, signInWithCode } from "@/core/supabase/session";
import { fetchLoginCode } from "@/features/room/api/login-code.api";
import { saveLoginCode } from "@/shared/utils/loginCodes";

/**
 * This player's code for another device: made on first ask, or anew with `fresh`. A new code
 * signs out every session of the user, this one too, so this browser signs straight back in with
 * it — other requests wait meanwhile (`holdingSession`). The code is kept on the device first, so
 * a page closed before the sign-in lands can still sign in with it on its next load
 * (`restoreSession`). Invalidates nothing: who this browser is has not changed.
 */
export function useLoginCode(userId: string | undefined) {
  return useMutation({
    mutationFn: (fresh: boolean) =>
      holdingSession(() => {
        if (!userId) throw new Error("useLoginCode: no player yet");
        return keepAndSignIn(userId, fresh);
      }),
  });
}

/** Asks for the code, keeps it, then signs back in with it if it is new. */
export async function keepAndSignIn(
  userId: string,
  fresh: boolean,
  steps = { fetchLoginCode, saveLoginCode, signInWithCode },
): Promise<string> {
  const { code, created } = await steps.fetchLoginCode({ fresh });
  steps.saveLoginCode(userId, code);
  if (created) await steps.signInWithCode(userId, code);
  return code;
}
