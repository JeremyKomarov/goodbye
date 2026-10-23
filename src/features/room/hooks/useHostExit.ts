import { useTranslations } from "next-intl";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { HERO_NAMESPACE, heroKeys } from "@/features/room/components/Hero/Hero.keys.const";
import { useDuration } from "@/shared/hooks/useDuration";
import type { Room } from "@/shared/types/room.types";
import { ON_TIME_MINUTES } from "@/shared/utils/verdict";
import { useMarkExit } from "./useMarkExit";

export interface HostExit {
  onExit: () => void;
  isBusy: boolean;
}

/**
 * The host's "I left the group" from inside the room, for a browser holding the admin token while
 * the hour is set. Early is allowed, but the host hears how it will look first. Null for anyone
 * else.
 */
export function useHostExit(room: Room | undefined, adminToken: string | null): HostExit | null {
  const t = useTranslations(HERO_NAMESPACE);
  const { rough } = useDuration();
  const exit = useMarkExit(room?.slug ?? "", adminToken);
  const isLocked = room?.status === ROOM_STATUSES.locked && room.lockedSlot !== null;
  if (!room || !adminToken || !isLocked || room.lockedSlot === null) return null;
  const lockedSlot = room.lockedSlot;

  return {
    isBusy: exit.isPending,
    onExit: () => {
      const left = lockedSlot - Date.now();
      const question =
        left > ON_TIME_MINUTES * 60_000
          ? t(heroKeys.exitRow.askEarly, { left: rough(left) })
          : t(heroKeys.exitRow.ask);
      if (!window.confirm(question)) return;
      exit.mutate(undefined, { onError: () => window.alert(t(heroKeys.exitRow.failed)) });
    },
  };
}
