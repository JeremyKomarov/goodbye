"use client";

import { useState } from "react";
import { ShareMessages } from "@/components/room/ShareMessages";
import { Sheet } from "@/components/ui/Sheet";
import { exitEvent, googleCalendarUrl } from "@/lib/calendar";
import type { ExitStats } from "@/lib/share";
import type { Room } from "@/lib/types";

type Props = {
  room: Room;
  url: string;
  isHost: boolean;
  stats: ExitStats;
  drawn: boolean;
};

/** Under the locked countdown: a calendar reminder for everyone, and the host's messages. */
export function ExitActions({ room, url, isHost, stats, drawn }: Props) {
  const [open, setOpen] = useState<"calendar" | "share" | null>(null);
  const event = exitEvent(room, url);
  if (!event) return null;
  const close = () => setOpen(null);

  return (
    <div className="mt-3 flex flex-wrap justify-center gap-2 short:mt-2">
      <button
        type="button"
        onClick={() => setOpen("calendar")}
        className="rounded-full bg-raised px-4 py-2 text-sm"
      >
        📅 הוספה ליומן
      </button>
      {isHost && (
        <button
          type="button"
          onClick={() => setOpen("share")}
          className="rounded-full bg-signal px-4 py-2 text-sm font-semibold text-night"
        >
          📣 שליחה לקבוצה
        </button>
      )}

      <Sheet open={open === "calendar"} onClose={close} title="הוספה ליומן">
        <p className="mb-3 text-ink/80">
          תזכורת עשר דקות לפני, עם קישור לחדר, כדי לראות את היציאה בשידור חי.
        </p>
        <div className="flex flex-col gap-2 pb-1">
          <a
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noreferrer"
            onClick={close}
            className="flex h-12 items-center justify-center rounded-2xl bg-raised font-semibold"
          >
            יומן Google
          </a>
          <a
            href={`/r/${room.slug}/exit.ics`}
            onClick={close}
            className="flex h-12 items-center justify-center rounded-2xl bg-raised font-semibold"
          >
            אייפון, מק או Outlook
          </a>
        </div>
      </Sheet>

      {isHost && (
        <Sheet open={open === "share"} onClose={close} title="שליחה לקבוצה">
          <ShareMessages room={room} url={url} stats={stats} drawn={drawn} />
        </Sheet>
      )}
    </div>
  );
}
