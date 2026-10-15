"use client";

import styles from "./ShareMessages.module.scss";
import {
  type ExitStats,
  goodbyeMessage,
  resultMessage,
  whatsappLink,
} from "@/core/share";
import type { Room } from "@/core/types";

type Props = {
  room: Room;
  url: string;
  stats: ExitStats;
  drawn: boolean;
};

/** The host's two WhatsApp messages, ready to send: the decision, then the goodbye. */
export function ShareMessages({ room, url, stats, drawn }: Props) {
  const messages = [
    // The decision is news only until the host leaves.
    room.status === "locked" &&
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
    <div className={styles.view1}>
      {messages.map((m) => (
        <div key={m.id} className={styles.view2}>
          <div className={styles.view3}>
            <span className={styles.view4}>{m.title}</span>
            <span className={styles.view5}>{m.when}</span>
          </div>
          <p
            dir="auto"
            className={styles.view6}
          >
            {m.text}
          </p>
          <a
            href={whatsappLink(m.text)}
            target="_blank"
            rel="noreferrer"
            className={styles.view7}
          >
            שליחה בוואטסאפ
          </a>
        </div>
      ))}
      <p className={styles.view8}>
        וואטסאפ ייפתח עם ההודעה מוכנה. בוחרים את הקבוצה ולוחצים שליחה.
      </p>
    </div>
  );
}
