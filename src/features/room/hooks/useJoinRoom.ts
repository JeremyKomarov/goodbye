import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { ensureSession } from "@/core/supabase/session";
import { claimHost, saveName } from "@/features/room/api/players.api";
import type { SaveNameInput } from "@/features/room/api/players.dto";
import { loadAdminToken } from "@/shared/utils/adminTokens";

/**
 * Comes into the room under a name, signing this browser in first if it never has. The host's
 * browser claims the room before taking the host's name, which is reserved for them; a failed
 * claim (an old room, a stale token) still lets them in under another name.
 * Invalidates the session user and the room.
 */
export function useJoinRoom(slug: string) {
  const queryClient = useQueryClient();
  const locale = useLocale();
  return useMutation({
    mutationFn: async (input: SaveNameInput) => {
      await ensureSession(locale);
      const adminToken = loadAdminToken(slug);
      if (adminToken) await claimHost(slug, { adminToken }).catch(() => undefined);
      await saveName(slug, input);
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.session.user }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.all(slug) }),
      ]),
  });
}
