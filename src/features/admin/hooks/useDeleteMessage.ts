import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { deleteMessage } from "@/features/admin/api/admin.api";
import type { AdminRoom } from "@/features/admin/types/admin.types";

/**
 * Removes a goodbye from the wall. Once the server has, it leaves the host's list at once, and the
 * room — the wall on every screen — is invalidated.
 */
export function useDeleteMessage(slug: string, token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (messageId: number) => deleteMessage(slug, token, messageId),
    onSuccess: (_nothing, messageId) => {
      queryClient.setQueryData<AdminRoom>(QUERY_KEYS.room.admin(slug), (view) =>
        view && { ...view, messages: view.messages.filter((m) => m.id !== messageId) },
      );
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.all(slug) });
    },
  });
}
