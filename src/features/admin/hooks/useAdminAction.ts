import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { runAdminAction } from "@/features/admin/api/admin.api";
import type { AdminRoom } from "@/features/admin/types/admin.types";
import type { AdminActionInput } from "@/shared/api/admin-action.dto";
import { mapRoomDto } from "@/shared/api/room.mapper";

/**
 * Lock, reopen, exit or take the exit back. Rejects with an `ApiError` — `forbidden`, or a reopen's
 * `close_time_in_past` / `no_slots_after_close` on `votingClosesAt`. The room it answers goes
 * straight into the host's view — this request's own answer, not an event — and the room's
 * queries are invalidated.
 */
export function useAdminAction(slug: string, token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AdminActionInput) =>
      mapRoomDto(await runAdminAction(slug, token, input)),
    onSuccess: (room) => {
      const key = QUERY_KEYS.room.admin(slug);
      queryClient.setQueryData<AdminRoom>(key, (view) => view && { ...view, room });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.all(slug) });
    },
  });
}
