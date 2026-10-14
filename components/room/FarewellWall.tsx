"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SystemPill } from "@/components/ui/SystemPill";
import { Ticks } from "@/components/ui/Ticks";
import { nameColor } from "@/lib/colors";
import { formatHour, g } from "@/lib/hebrew";
import type { Typer } from "@/lib/hooks/useRoom";
import type { Room, WallMessage } from "@/lib/types";

export const QUICK_EMOJI = ["👋", "😢", "🎉", "🫡", "❤️", "😂"];
const MAX = 140;

type Props = {
  room: Room;
  messages: WallMessage[];
  myUserId: string | null;
  typers: Typer[];
  onSend: (body: string) => Promise<string | null>;
  onTyping: (typing: boolean) => void;
  onEmoji: (emoji: string) => void;
};

export function FarewellWall({
  room,
  messages,
  myUserId,
  typers,
  onSend,
  onTyping,
  onEmoji,
}: Props) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTyping = useRef(false);
  const lastAnnounced = useRef(0);


  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, typers.length]);

  useEffect(
    () => () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    },
    [],
  );

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
    <section aria-label="קיר פרידה" className="flex flex-col">
      <div className="flex flex-col gap-1.5 px-1 pb-40 pt-3">
        <SystemPill className="mb-3">
          {`מה תרצו להגיד ל${room.host_name} לפני ש${g(room.host_gender, "הוא יוצא", "היא יוצאת")}? כל מי שבחדר רואה את ההודעות.`}
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
            return (
              <motion.div
                key={m.id}
                layout="position"
                initial={{ opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 24, stiffness: 320 }}
                className={`flex ${mine ? "justify-end" : "justify-start"} ${grouped ? "" : "mt-1.5"}`}
              >
                <div
                  className={`${grouped ? "rounded-xl" : mine ? "bubble-out me-2" : "bubble-in ms-2"} ${
                    grouped ? (mine ? "me-2 bg-bubble" : "ms-2 bg-raised") : ""
                  } max-w-[80%] px-3 pb-1.5 pt-1`}
                >
                  {!mine && !grouped && (
                    <div
                      className="text-[13px] font-semibold"
                      style={{ color: nameColor(m.user_id) }}
                    >
                      {m.display_name}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap break-words text-[15px] leading-snug">
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
                ? `${typers[0].name} מקליד/ה…`
                : `${typers.length} אנשים מקלידים…`}
            </motion.p>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* Composer, pinned above the tab bar. */}
      <div className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-20">
        <div className="mx-auto max-w-md px-2 pb-2">
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
