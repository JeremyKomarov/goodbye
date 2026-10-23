import { useEffect, useSyncExternalStore } from "react";
import { ADMIN_TOKEN_PARAM } from "@/core/constants/routes.const";
import { loadAdminToken, saveAdminToken } from "@/shared/utils/adminTokens";

const noSubscription = () => () => {};

function tokenInHash(): string | null {
  return new URLSearchParams(window.location.hash.slice(1)).get(ADMIN_TOKEN_PARAM);
}

/**
 * The admin token: from the link's `#k=…` when it was just opened — kept in this browser, and
 * taken out of the address bar so it isn't shared by accident — or the one kept before. Null on
 * the server and while hydrating; "" when this browser has none.
 */
export function useLinkToken(slug: string): string | null {
  const token = useSyncExternalStore(
    noSubscription,
    () => tokenInHash() ?? loadAdminToken(slug) ?? "",
    () => null,
  );

  useEffect(() => {
    const fromLink = tokenInHash();
    if (!fromLink) return;
    saveAdminToken(slug, fromLink);
    history.replaceState(history.state, "", window.location.pathname + window.location.search);
  }, [slug]);

  return token;
}
