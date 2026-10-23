import { useTranslations } from "next-intl";
import { API_ENDPOINTS } from "@/core/constants/api-endpoints.const";
import { exitActionsClasses } from "@/features/room/components/ExitActions/ExitActions.classes";
import {
  EXIT_ACTIONS_NAMESPACE, exitActionsKeys,
} from "@/features/room/components/ExitActions/ExitActions.keys.const";
import { Sheet } from "@/shared/components/Sheet";
import { CALENDAR_NAMESPACE, calendarKeys } from "@/shared/strings/calendar.keys.const";
import type { Room } from "@/shared/types/room.types";
import { exitEvent, googleCalendarUrl } from "@/shared/utils/calendar";

interface CalendarSheetProps {
  room: Room;
  /** The room's link, which the event carries. */
  url: string;
  open: boolean;
  onClose: () => void;
}

/** The locked hour into a calendar: Google's, or the .ics file for the rest. */
export function CalendarSheet({ room, url, open, onClose }: CalendarSheetProps) {
  const t = useTranslations(EXIT_ACTIONS_NAMESPACE);
  const tEvent = useTranslations(CALENDAR_NAMESPACE);
  const event = exitEvent(
    room,
    {
      title: tEvent(calendarKeys.title, {
        name: room.hostName,
        gender: room.hostGender,
        group: room.groupName,
      }),
      details: tEvent(calendarKeys.details, { url }),
    },
    url,
  );
  if (!event) return null;

  return (
    <Sheet open={open} onClose={onClose} title={t(exitActionsKeys.calendar.title)}>
      <p className={exitActionsClasses.note}>{t(exitActionsKeys.calendar.note)}</p>
      <div className={exitActionsClasses.links}>
        <a
          href={googleCalendarUrl(event)}
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
          className={exitActionsClasses.link}
        >
          {t(exitActionsKeys.calendar.google)}
        </a>
        <a
          href={API_ENDPOINTS.rooms.calendar(room.slug)}
          onClick={onClose}
          className={exitActionsClasses.link}
        >
          {t(exitActionsKeys.calendar.file)}
        </a>
      </div>
    </Sheet>
  );
}
