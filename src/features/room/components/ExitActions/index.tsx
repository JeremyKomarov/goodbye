"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { FEATURE_KEYS } from "@/core/config/features.const";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { roomPath } from "@/core/constants/routes.const";
import { useRoomContext } from "@/features/room/hooks/useRoomContext";
import { Button, BUTTON_SIZES, BUTTON_VARIANTS } from "@/shared/components/Button";
import { ICON_NAMES } from "@/shared/components/Icon";
import { useNow } from "@/shared/hooks/useNow";
import { exitActionsClasses } from "./ExitActions.classes";
import { EXIT_SHEETS, type ExitSheet } from "./ExitActions.const";
import { EXIT_ACTIONS_NAMESPACE, exitActionsKeys } from "./ExitActions.keys.const";
import { CalendarSheet } from "./partials/CalendarSheet";

/**
 * Under the countdown: a calendar reminder for everyone while the hour is ahead — a reminder for
 * a time that has passed is noise.
 */
export function ExitActions() {
  const t = useTranslations(EXIT_ACTIONS_NAMESPACE);
  const { snapshot } = useRoomContext();
  const { room } = snapshot;
  const now = useNow();
  const [sheet, setSheet] = useState<ExitSheet | null>(null);
  const close = () => setSheet(null);
  // Only once the clock runs in the browser (0 before), so the server never draws these.
  const canRemind =
    room.status === ROOM_STATUSES.locked && room.lockedSlot !== null && now > 0 &&
    now < room.lockedSlot;
  if (!canRemind) return null;
  const url = `${window.location.origin}${roomPath(FEATURE_KEYS.room, room.slug)}`;

  return (
    <div className={exitActionsClasses.root}>
      <Button
        variant={BUTTON_VARIANTS.secondary}
        size={BUTTON_SIZES.sm}
        icon={ICON_NAMES.calendar}
        onClick={() => setSheet(EXIT_SHEETS.calendar)}
      >
        {t(exitActionsKeys.calendar.open)}
      </Button>
      <CalendarSheet
        room={room}
        url={url}
        open={sheet === EXIT_SHEETS.calendar}
        onClose={close}
      />
    </div>
  );
}
