"use client";

import type { WallMessage } from "@/core/types";
import styles from "./AdminWall.module.scss";

export function AdminWall({ messages, pending, onRefresh, onDelete }: { messages: WallMessage[]; pending: boolean; onRefresh: () => void; onDelete: (message: WallMessage) => void }) {
  return <section className={styles.view36}>
    <div className={styles.view37}>
      <h2 className={styles.view19}>הודעות בקיר {messages.length > 0 && <span className={styles.view38}>{messages.length}</span>}</h2>
      <button type="button" onClick={onRefresh} className={styles.view9}>רענון</button>
    </div>
    {messages.length === 0 ? <p className={styles.view39}>אין הודעות עדיין.</p> :
      <ul className={styles.view40}>{messages.map((message) => <li key={message.id} className={styles.view41}>
        <div className={styles.view42}>
          <div className={styles.view43}><bdi>{message.display_name}</bdi></div>
          <p dir="auto" className={styles.view44}>{message.body}</p>
        </div>
        <button type="button" disabled={pending} onClick={() => onDelete(message)} className={styles.view45}>מחיקה</button>
      </li>)}</ul>}
  </section>;
}
