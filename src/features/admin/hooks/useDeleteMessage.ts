import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/constants/query-keys.const";
import { deleteMessage } from "@/features/admin/api/admin.api";

/** Removes a goodbye from the wall. Invalidates the room — the host's view and the wall. */
export function useDeleteMessage(slug: string, token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (messageId: number) => deleteMessage(slug, token, messageId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room.all(slug) }),
  });
}
