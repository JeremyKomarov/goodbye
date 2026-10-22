import { useEffect } from "react";
import type { Player, RoomSnapshot } from "@/features/room/types/room.types";
import { useAdminToken } from "./useAdminToken";
import { useClaimHost } from "./useClaimHost";
import { useJoinRoom } from "./useJoinRoom";
import { useSessionUser } from "./useSessionUser";

export const IDENTITY_STATES = { checking: "checking", join: "join", ready: "ready" } as const;
export type IdentityState = (typeof IDENTITY_STATES)[keyof typeof IDENTITY_STATES];

/**
 * Who this browser is in the room. A returning visitor is recognised by their session and player
 * row; the host's browser (it holds the admin token) comes in under the host's name without being
 * asked, and only sees the name prompt if that fails. Everyone else is asked for a name.
 */
export function useIdentity(slug: string, snapshot: RoomSnapshot | undefined) {
  const session = useSessionUser();
  const adminToken = useAdminToken(slug);
  const join = useJoinRoom(slug);
  const claim = useClaimHost(slug);

  const userId = session.data ?? null;
  const me: Player | null =
    (snapshot && userId && snapshot.players.find((p) => p.userId === userId)) || null;
  const isHost = !!adminToken || (!!userId && !!snapshot?.hostIds.includes(userId));
  const known = !!snapshot && session.isSuccess;

  const hostName = snapshot?.room.hostName;
  const shouldAutoJoin = known && !me && !!adminToken && join.isIdle;
  const { mutate: joinAs } = join;
  useEffect(() => {
    if (shouldAutoJoin && hostName) joinAs({ name: hostName });
  }, [shouldAutoJoin, hostName, joinAs]);

  // A host who joined before hosts were recorded, or on another device, claims the room once.
  const shouldClaim = !!me && !!adminToken && !snapshot?.hostIds.includes(me.userId);
  const { mutate: claimWith, isIdle: claimIdle } = claim;
  useEffect(() => {
    if (shouldClaim && claimIdle && adminToken) claimWith(adminToken);
  }, [shouldClaim, claimIdle, adminToken, claimWith]);

  const state: IdentityState =
    !known || shouldAutoJoin || (join.isPending && !!adminToken && !me)
      ? IDENTITY_STATES.checking
      : me
        ? IDENTITY_STATES.ready
        : IDENTITY_STATES.join;

  return {
    state,
    me,
    isHost,
    adminToken,
    /** False when this browser joined just now, so the hello says "the room will remember you". */
    returning: !join.isSuccess,
    join,
  };
}
