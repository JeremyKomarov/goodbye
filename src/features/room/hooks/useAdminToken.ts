import { useSyncExternalStore } from "react";
import { loadAdminToken } from "@/shared/utils/adminTokens";

const noSubscription = () => () => {};

/** This browser's admin token for the room, if it opened it; null on the server and in hydration. */
export function useAdminToken(slug: string): string | null {
  return useSyncExternalStore(
    noSubscription,
    () => loadAdminToken(slug),
    () => null,
  );
}
