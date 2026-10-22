import { useMutation } from "@tanstack/react-query";
import { signInWithCode } from "@/core/supabase/session";
import { fetchLoginCode } from "@/features/room/api/login-code.api";
import { saveLoginCode } from "@/shared/utils/loginCodes";

/**
 * This player's code for another device: made on first ask, or anew with `fresh`. A new code
 * signs out every session of the user, this one too, so this browser signs straight back in with
 * it. The code is kept on the device. Invalidates nothing: who this browser is has not changed.
 */
export function useLoginCode(userId: string | undefined) {
  return useMutation({
    mutationFn: async (fresh: boolean) => {
      if (!userId) throw new Error("useLoginCode: no player yet");
      const { code, created } = await fetchLoginCode({ fresh });
      if (created) await signInWithCode(userId, code);
      saveLoginCode(userId, code);
      return code;
    },
  });
}
