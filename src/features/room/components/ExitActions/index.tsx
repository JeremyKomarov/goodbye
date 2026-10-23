"use client";

import { useTranslations } from "next-intl";
import { useState, useSyncExternalStore } from "react";
import { FEATURE_KEYS } from "@/core/config/features.const";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { roomPath } from "@/core/constants/routes.const";
import { useRoomContext } from "@/features/room/hooks/useRoomContext";
import { Button, BUTTON_SIZES, BUTTON_VARIANTS } from "@/shared/components/Button";
import { ICON_NAMES } from "@/shared/components/Icon";
import { ShareMessages } from "@/shared/components/ShareMessages";
import { Sheet } from "@/shared/components/Sheet";
import { useNow } from "@/shared/hooks/useNow";
import { exitActionsClasses } from "./ExitActions.classes";
import { EXIT_SHEETS, type ExitSheet } from "./ExitActions.const";
import { EXIT_ACTIONS_NAMESPACE, exitActionsKeys } from "./ExitActions.keys.const";
import { CalendarSheet } from "./partials/CalendarSheet";

const noSubscription = () => () => {};

/**
 * Under the countdown and the exit card: a calendar reminder for everyone while the hour is ahead
 * — a reminder for a time that has passed is noise — the host's messages to the group, kept
 * after the exit, and the finale again once the host has left.
 */
export function ExitActions() {
  const t = useTranslations(EXIT_ACTIONS_NAMESPACE);
  const { snapshot, isHost, replayFinale } = useRoomContext();
  const { room } = snapshot;
  const now = useNow();
  const [sheet, setSheet] = useState<ExitSheet | null>(null);
  const origin = useSyncExternalStore(noSubscription, () => window.location.origin, () => "");
  const close = () => setSheet(null);
  const isLocked = room.status === ROOM_STATUSES.locked && room.lockedSlot !== null;
  const isExited = room.status === ROOM_STATUSES.exited;
  // Only once the clock runs in the browser (0 before), so the server never draws these.
  const canRemind = isLocked && now > 0 && now < (room.lockedSlot ?? 0);
  const canShare = isHost && now > 0 && (isLocked || isExited);
  if (!canRemind && !canShare && !isExited) return null;
  const url = `${origin}${roomPath(FEATURE_KEYS.room, room.slug)}`;
  const shareLabel = t(isExited ? exitActionsKeys.share.exited : exitActionsKeys.share.locked);

  return (
    <div className={exitActionsClasses.root}>
      {isExited && (
        <Button variant={BUTTON_VARIANTS.secondary} size={BUTTON_SIZES.sm} onClick={replayFinale}>
          {t(exitActionsKeys.replay)}
        </Button>
      )}
      {canRemind && (
        <Button
          variant={BUTTON_VARIANTS.secondary}
          size={BUTTON_SIZES.sm}
          icon={ICON_NAMES.calendar}
          onClick={() => setSheet(EXIT_SHEETS.calendar)}
        >
          {t(exitActionsKeys.calendar.open)}
        </Button>
      )}
      {canShare && (
        <Button
          variant={BUTTON_VARIANTS.secondary}
          size={BUTTON_SIZES.sm}
          icon={ICON_NAMES.share}
          onClick={() => setSheet(EXIT_SHEETS.share)}
        >
          {shareLabel}
        </Button>
      )}
      {canRemind && (
        <CalendarSheet
          room={room}
          url={url}
          open={sheet === EXIT_SHEETS.calendar}
          onClose={close}
        />
      )}
      {canShare && (
        <Sheet open={sheet === EXIT_SHEETS.share} onClose={close} title={shareLabel}>
          <ShareMessages room={room} url={url} />
        </Sheet>
      )}
    </div>
  );
}
