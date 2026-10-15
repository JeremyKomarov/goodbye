"use client";

import styles from "./ExitActions.module.scss";
import { useState } from "react";
import { ShareMessages } from "@/features/room/components/ShareMessages/ShareMessages";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import { exitEvent, googleCalendarUrl } from "@/core/calendar";
import type { ExitStats } from "@/core/share";
import type { Room } from "@/core/types";

type Props = {
  room: Room;
  url: string;
  isHost: boolean;
  stats: ExitStats;
  drawn: boolean;
  /** Only while the hour is still ahead: a reminder for a time that's passed is noise. */
  calendar: boolean;
};

/** Under the countdown: a calendar reminder for everyone, and the host's messages (kept after the exit). */
export function ExitActions({
  room,
  url,
  isHost,
  stats,
  drawn,
  calendar,
}: Props) {
  const [open, setOpen] = useState<"calendar" | "share" | null>(null);
  const event = calendar ? exitEvent(room, url) : null;
  if (!event && !isHost) return null;
  const close = () => setOpen(null);

  return (
    <div className={styles.view1}>
      {event && (
        <button
          type="button"
          onClick={() => setOpen("calendar")}
          className={styles.view2}
        >
          📅 הוספה ליומן
        </button>
      )}
      {isHost && (
        <button
          type="button"
          onClick={() => setOpen("share")}
          className={styles.view3}
        >
          {room.status === "exited" ? "📣 הודעת הפרידה" : "📣 שליחה לקבוצה"}
        </button>
      )}

      {event && (
        <Sheet open={open === "calendar"} onClose={close} title="הוספה ליומן">
          <p className={styles.view4}>
            תזכורת עשר דקות לפני, עם קישור לחדר, כדי לראות את היציאה בשידור חי.
          </p>
          <div className={styles.view5}>
            <a
              href={googleCalendarUrl(event)}
              target="_blank"
              rel="noreferrer"
              onClick={close}
              className={styles.view6}
            >
              יומן Google
            </a>
            <a
              href={`/r/${room.slug}/exit.ics`}
              onClick={close}
              className={styles.view6}
            >
              אייפון, מק או Outlook
            </a>
          </div>
        </Sheet>
      )}

      {isHost && (
        <Sheet
          open={open === "share"}
          onClose={close}
          title={room.status === "exited" ? "הודעת הפרידה" : "שליחה לקבוצה"}
        >
          <ShareMessages room={room} url={url} stats={stats} drawn={drawn} />
        </Sheet>
      )}
    </div>
  );
}
