"use client";

import styles from "./FarewellWall.module.scss";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SystemPill } from "@/components/ui/SystemPill/SystemPill";
import { MessageBubble } from "@/features/room/components/MessageBubble/MessageBubble";
import { g, iso } from "@/core/hebrew";
import type { Typer } from "@/core/hooks/useRoom";
import {
  type ReactionEmoji,
  type ReactionMap,
} from "@/core/reactions";
import type { Room, WallMessage } from "@/core/types";

export const QUICK_EMOJI = ["👋", "😢", "🎉", "🫡", "❤️", "😂"];
const MAX = 140;

type Props = {
  room: Room;
  messages: WallMessage[];
  myUserId: string | null;
  /** The host's user ids: their messages get a badge. */
  hosts: string[];
  reactions: ReactionMap;
  typers: Typer[];
  onSend: (body: string) => Promise<string | null>;
  onReact: (messageId: number, emoji: ReactionEmoji | null) => void;
  onTyping: (typing: boolean) => void;
  onEmoji: (emoji: string) => void;
};

export function FarewellWall({
  room,
  messages,
  myUserId,
  hosts,
  reactions,
  typers,
  onSend,
  onReact,
  onTyping,
  onEmoji,
}: Props) {
  // The message whose reaction picker is open.
  const [picking, setPicking] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTyping = useRef(false);
  const lastAnnounced = useRef(0);

  // Scrolled to the newest message? If not, new ones wait behind the jump button.
  const listRef = useRef<HTMLDivElement>(null);
  const following = useRef(true);
  const shownCount = useRef(0);
  const [atBottom, setAtBottom] = useState(true);
  const [readCount, setReadCount] = useState(0);
  const lastIsMine = messages.at(-1)?.user_id === myUserId;
  const unseen = atBottom
    ? 0
    : messages.slice(readCount).filter((m) => m.user_id !== myUserId).length;

  // Follow new messages (and typing) while at the bottom, and always after your own. Jump on first show.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const first = shownCount.current === 0;
    shownCount.current = messages.length;
    if (first || following.current || lastIsMine)
      list.scrollTo({
        top: list.scrollHeight,
        behavior: first ? "instant" : "smooth",
      });
  }, [messages.length, typers.length, lastIsMine]);

  function onScroll() {
    const list = listRef.current;
    if (!list) return;
    const bottom = list.scrollHeight - list.scrollTop - list.clientHeight < 80;
    following.current = bottom;
    setAtBottom(bottom);
    if (bottom) setReadCount(messages.length);
  }

  function jumpToEnd() {
    const list = listRef.current;
    list?.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }

  useEffect(
    () => () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    },
    [],
  );

  // A tap anywhere outside the open picker (or Escape) closes it.
  useEffect(() => {
    if (picking === null) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest?.(`[data-reactions="${picking}"]`)) setPicking(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPicking(null);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [picking]);

  function stopTyping() {
    if (typingTimer.current) clearTimeout(typingTimer.current);
    if (isTyping.current) {
      isTyping.current = false;
      onTyping(false);
    }
  }

  function handleChange(value: string) {
    setDraft(value.slice(0, MAX));
    // Re-announce every 2s so the signal doesn't expire mid-sentence for others.
    const t = performance.now();
    if (value && (!isTyping.current || t - lastAnnounced.current > 2000)) {
      isTyping.current = true;
      lastAnnounced.current = t;
      onTyping(true);
    }
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(stopTyping, 2500);
  }

  async function send(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    setSending(true);
    setError(null);
    const err = await onSend(draft);
    setSending(false);
    if (err) return setError(err);
    setDraft("");
    stopTyping();
  }


  return (
    <section aria-label="קיר פרידה" className={styles.view1}>
      <div className={styles.view2}>
        <div
          ref={listRef}
          onScroll={onScroll}
          className={styles.view3}
        >
          <div className={styles.view4}>
            <SystemPill className={styles.view5}>
              {room.status === "exited"
                ? `${iso(room.host_name)} ${g(room.host_gender, "כבר יצא", "כבר יצאה")} מהקבוצה, אבל הקיר נשאר פתוח. מה עוד תרצו להגיד?`
                : `מה תרצו להגיד ל${iso(room.host_name)} לפני ש${g(room.host_gender, "הוא יוצא", "היא יוצאת")}? כל מי שבחדר רואה את ההודעות.`}
            </SystemPill>

            {messages.length === 0 && (
              <p className={styles.view6}>
                עוד אין כאן הודעות. ההודעה הראשונה תהיה שלך.
              </p>
            )}

            <AnimatePresence initial={false}>
              {messages.map((message, index) => <MessageBubble key={message.id} message={message} previous={messages[index - 1]} room={room} myUserId={myUserId} hosts={hosts} reactions={reactions} picking={picking} onPicking={setPicking} onReact={onReact} />)}
            </AnimatePresence>

            <AnimatePresence>
              {typers.length > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={styles.view38}
                >
                  {typers.length === 1
                    ? `${iso(typers[0].name)} מקליד/ה…`
                    : `${typers.length} אנשים מקלידים…`}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* WhatsApp's round "jump to latest" button, with a count of new messages. */}
        <AnimatePresence>
          {!atBottom && (
            <motion.button
              type="button"
              onClick={jumpToEnd}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              aria-label={
                unseen
                  ? `${unseen === 1 ? "הודעה חדשה אחת" : `${unseen} הודעות חדשות`}, מעבר להודעה האחרונה`
                  : "מעבר להודעה האחרונה"
              }
              className={styles.view39}
            >
              <svg
                viewBox="0 0 24 24"
                className={styles.view40}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
              {unseen > 0 && (
                <span className={styles.view41}>
                  {unseen > 99 ? "99+" : unseen}
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Composer */}
      <div className={styles.view42}>
        <div className={styles.view43}>
          <div className={styles.view44}>
            {QUICK_EMOJI.map((emoji) => (
              <motion.button
                key={emoji}
                type="button"
                whileTap={{ scale: 1.4 }}
                onClick={() => onEmoji(emoji)}
                aria-label={`גשם של ${emoji} לכל מי שבחדר`}
                className={styles.view45}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
          {error && <p className={styles.view46}>{error}</p>}
          <form onSubmit={send} className={styles.view47}>
            <div className={styles.view48}>
              <label htmlFor="wall-input" className={styles.view49}>
                הודעת פרידה
              </label>
              <input
                id="wall-input"
                value={draft}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={stopTyping}
                placeholder="הודעת פרידה"
                maxLength={MAX}
                autoComplete="off"
                enterKeyHint="send"
                className={styles.view50}
              />
              {draft.length > MAX - 30 && (
                <span className={styles.view51}>
                  {MAX - draft.length}
                </span>
              )}
            </div>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.9 }}
              disabled={!draft.trim() || sending}
              aria-label="שליחה"
              className={styles.view52}
            >
              <svg
                viewBox="0 0 24 24"
                className={styles.view53}
                fill="currentColor"
                aria-hidden
              >
                <path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z" />
              </svg>
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
}
