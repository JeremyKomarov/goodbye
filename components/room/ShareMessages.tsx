"use client";

import {
  type ExitStats,
  goodbyeMessage,
  resultMessage,
  whatsappLink,
} from "@/lib/share";
import type { Room } from "@/lib/types";

type Props = {
  room: Room;
  url: string;
  stats: ExitStats;
  drawn: boolean;
};

/** The host's two WhatsApp messages, ready to send: the decision, then the goodbye. */
export function ShareMessages({ room, url, stats, drawn }: Props) {
  const messages = [
    room.locked_slot && {
      id: "result",
      title: "הקבוצה החליטה",
      when: "לשלוח כשההצבעה ננעלת",
      text: resultMessage(room, url, stats.voterCount, drawn),
    },
    {
      id: "goodbye",
      title: "הודעת פרידה",
      when: "לשלוח רגע לפני שיוצאים",
      text: goodbyeMessage(room, url, stats),
    },
  ].filter((m) => !!m);

  return (
    <div className="flex flex-col gap-3 pb-1">
      {messages.map((m) => (
        <div key={m.id} className="rounded-2xl bg-raised p-3">
          <div className="mb-2 flex items-baseline justify-between gap-2 px-1">
            <span className="font-semibold">{m.title}</span>
            <span className="text-xs text-mute">{m.when}</span>
          </div>
          <p
            dir="auto"
            className="max-h-36 overflow-y-auto whitespace-pre-wrap break-words rounded-xl bg-bubble px-3 py-2 text-sm leading-snug"
          >
            {m.text}
          </p>
          <a
            href={whatsappLink(m.text)}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex h-11 items-center justify-center rounded-xl bg-signal font-semibold text-night"
          >
            שליחה בוואטסאפ
          </a>
        </div>
      ))}
      <p className="px-1 text-xs text-mute">
        וואטסאפ ייפתח עם ההודעה מוכנה. בוחרים את הקבוצה ולוחצים שליחה.
      </p>
    </div>
  );
}
