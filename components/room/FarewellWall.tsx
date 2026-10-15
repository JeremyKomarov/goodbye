"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SystemPill } from "@/components/ui/SystemPill";
import { Ticks } from "@/components/ui/Ticks";
import { nameColor } from "@/lib/colors";
import { formatHour, g, iso } from "@/lib/hebrew";
import type { Typer } from "@/lib/hooks/useRoom";
import {
  type ReactionEmoji,
  type ReactionMap,
  REACTIONS,
  reactionCounts,
} from "@/lib/reactions";
import type { Room, WallMessage } from "@/lib/types";

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

  const tz = room.timezone;

  return (
    <section aria-label="קיר פרידה" className="flex min-h-0 flex-1 flex-col">
      <div className="relative min-h-0 flex-1">
        <div
          ref={listRef}
          onScroll={onScroll}
          className="h-full overflow-y-auto overscroll-contain"
        >
          <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-end gap-1.5 px-3 pb-3 pt-3 lg:px-8">
            <SystemPill className="mb-3">
              {room.status === "exited"
                ? `${iso(room.host_name)} ${g(room.host_gender, "כבר יצא", "כבר יצאה")} מהקבוצה, אבל הקיר נשאר פתוח. מה עוד תרצו להגיד?`
                : `מה תרצו להגיד ל${iso(room.host_name)} לפני ש${g(room.host_gender, "הוא יוצא", "היא יוצאת")}? כל מי שבחדר רואה את ההודעות.`}
            </SystemPill>

            {messages.length === 0 && (
              <p className="py-10 text-center text-mute">
                עוד אין כאן הודעות. ההודעה הראשונה תהיה שלך.
              </p>
            )}

            <AnimatePresence initial={false}>
              {messages.map((m, i) => {
                const mine = m.user_id === myUserId;
                const prev = messages[i - 1];
                const grouped = prev && prev.user_id === m.user_id;
                const chips = reactionCounts(reactions[m.id]);
                const myReaction = myUserId
                  ? reactions[m.id]?.[myUserId]
                  : undefined;
                return (
                  <motion.div
                    key={m.id}
                    layout="position"
                    initial={{ opacity: 0, y: 14, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", damping: 24, stiffness: 320 }}
                    className={`flex ${mine ? "justify-end" : "justify-start"} ${grouped ? "" : "mt-1.5"} ${chips.length ? "pb-3" : ""}`}
                  >
                    <div
                      data-reactions={m.id}
                      className={`relative max-w-[80%] ${mine ? "me-2" : "ms-2"}`}
                    >
                      {/* Tap a bubble to react, like a long-press in WhatsApp. */}
                      <AnimatePresence>
                        {picking === m.id && (
                          <motion.div
                            role="menu"
                            aria-label="תגובה להודעה"
                            initial={{ opacity: 0, y: 6, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`absolute bottom-full z-10 mb-1 flex gap-0.5 rounded-full bg-raised p-1 shadow-lg ${mine ? "end-0" : "start-0"}`}
                          >
                            {REACTIONS.map((emoji) => (
                              <motion.button
                                key={emoji}
                                type="button"
                                role="menuitemradio"
                                aria-checked={myReaction === emoji}
                                whileTap={{ scale: 1.35 }}
                                onClick={() => {
                                  onReact(
                                    m.id,
                                    myReaction === emoji ? null : emoji,
                                  );
                                  setPicking(null);
                                }}
                                className={`grid size-9 place-items-center rounded-full text-xl ${myReaction === emoji ? "bg-line" : "hover:bg-line/60"}`}
                              >
                                {emoji}
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div
                        role="button"
                        tabIndex={0}
                        aria-haspopup="menu"
                        aria-expanded={picking === m.id}
                        onClick={() =>
                          setPicking(picking === m.id ? null : m.id)
                        }
                        onKeyDown={(e) => {
                          if (e.key !== "Enter" && e.key !== " ") return;
                          e.preventDefault();
                          setPicking(picking === m.id ? null : m.id);
                        }}
                        className={`${grouped ? "rounded-xl" : mine ? "bubble-out" : "bubble-in"} ${
                          grouped ? (mine ? "bg-bubble" : "bg-raised") : ""
                        } cursor-pointer px-3 pb-1.5 pt-1 outline-none focus-visible:ring-2 focus-visible:ring-pill/70`}
                      >
                        {!mine && !grouped && (
                          <div
                            className="flex items-center gap-1.5 text-[13px] font-semibold"
                            style={{ color: nameColor(m.user_id) }}
                          >
                            <bdi>{m.display_name}</bdi>
                            {hosts.includes(m.user_id) && (
                              <span className="rounded bg-exit/15 px-1.5 text-[11px] font-medium text-exit">
                                {g(room.host_gender, "היוצא", "היוצאת")}
                              </span>
                            )}
                          </div>
                        )}
                        <p
                          dir="auto"
                          className="whitespace-pre-wrap break-words text-[15px] leading-snug"
                        >
                          {m.body}
                        </p>
                        <div
                          className={`mt-0.5 flex items-center justify-start gap-1 text-[11px] ${mine ? "text-ink/60" : "text-mute"}`}
                          dir="ltr"
                        >
                          {formatHour(Date.parse(m.created_at), tz)}
                          {mine && <Ticks />}
                        </div>
                      </div>
                      {chips.length > 0 && (
                        <div
                          className={`absolute -bottom-4 flex gap-1 ${mine ? "end-2" : "start-2"}`}
                        >
                          {chips.map(({ emoji, count }) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() =>
                                onReact(
                                  m.id,
                                  myReaction === emoji ? null : emoji,
                                )
                              }
                              aria-label={`${emoji} ${count}${myReaction === emoji ? ", כולל שלך" : ""}`}
                              aria-pressed={myReaction === emoji}
                              className={`flex h-6 items-center gap-0.5 rounded-full border-2 border-night px-1.5 text-xs shadow ${myReaction === emoji ? "bg-bubble" : "bg-raised"}`}
                            >
                              <span aria-hidden>{emoji}</span>
                              {count > 1 && (
                                <span
                                  className="tabular-nums text-ink/80"
                                  aria-hidden
                                >
                                  {count}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <AnimatePresence>
              {typers.length > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="ms-3 mt-1 text-sm text-signal"
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
              className="absolute bottom-3 end-3 grid size-10 place-items-center rounded-full bg-raised text-mute shadow-lg lg:end-6"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-5"
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
                <span className="absolute -top-2 start-0 grid h-5 min-w-5 place-items-center rounded-full bg-signal px-1 text-[11px] font-bold text-night">
                  {unseen > 99 ? "99+" : unseen}
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-line/40 bg-night/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-2 pb-2 pt-2 lg:px-6">
          <div className="no-scrollbar mb-2 flex gap-2 overflow-x-auto px-1">
            {QUICK_EMOJI.map((emoji) => (
              <motion.button
                key={emoji}
                type="button"
                whileTap={{ scale: 1.4 }}
                onClick={() => onEmoji(emoji)}
                aria-label={`גשם של ${emoji} לכל מי שבחדר`}
                className="grid size-10 shrink-0 place-items-center rounded-full bg-panel/95 text-xl shadow-lg backdrop-blur"
              >
                {emoji}
              </motion.button>
            ))}
          </div>
          {error && <p className="mb-1.5 px-3 text-sm text-exit">{error}</p>}
          <form onSubmit={send} className="flex items-end gap-2">
            <div className="flex flex-1 items-center rounded-3xl bg-raised px-4 shadow-lg">
              <label htmlFor="wall-input" className="sr-only">
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
                className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-mute"
              />
              {draft.length > MAX - 30 && (
                <span className="ms-2 text-xs tabular-nums text-mute">
                  {MAX - draft.length}
                </span>
              )}
            </div>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.9 }}
              disabled={!draft.trim() || sending}
              aria-label="שליחה"
              className="grid size-12 shrink-0 place-items-center rounded-full bg-signal text-night shadow-lg disabled:opacity-50"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-5 -scale-x-100"
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
