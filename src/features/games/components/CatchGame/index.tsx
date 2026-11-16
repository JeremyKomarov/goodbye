"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { type MouseEvent, useEffect, useRef } from "react";
import { GAME_IDS } from "@/core/constants/games.const";
import { CATCH_SECONDS, NOTICE_KINDS, type NoticeKind } from "@/features/games/content/catch.const";
import { useCatchRound } from "@/features/games/hooks/useCatchRound";
import type { GameProps } from "@/features/games/types/games.types";
import { BUTTON_SIZES, Button } from "@/shared/components/Button";
import { useGameWords } from "@/shared/hooks/useGameWords";
import { cn } from "@/shared/utils/cn";
import { catchGameClasses } from "./CatchGame.classes";
import { CATCH_GAME_NAMESPACE, catchGameKeys } from "./CatchGame.keys.const";

type Lines = typeof catchGameKeys.lines;
type LineKey = { [K in NoticeKind]: Lines[K][keyof Lines[K]] }[NoticeKind];

const LINES = Object.fromEntries(
  Object.values(NOTICE_KINDS).map((kind) => [kind, Object.values(catchGameKeys.lines[kind])]),
) as Record<NoticeKind, LineKey[]>;
const LINE_COUNTS = Object.fromEntries(
  Object.entries(LINES).map(([kind, lines]) => [kind, lines.length]),
) as Record<NoticeKind, number>;
// The last seconds are counted in red.
const HURRY_SECONDS = 5;

/** Pop the falling notifications for points in 30 seconds; the boss costs you. */
export function CatchGame({ onFinish }: GameProps) {
  const t = useTranslations(CATCH_GAME_NAMESPACE);
  const words = useGameWords();
  const locale = useLocale();
  const arena = useRef<HTMLDivElement>(null);
  const { isPlaying, frame, popups, start, pop } = useCatchRound(arena, LINE_COUNTS, onFinish);
  const left = Math.ceil(isPlaying ? frame.left : CATCH_SECONDS);
  const signed = new Intl.NumberFormat(locale, { signDisplay: "always" });

  // Played from the keyboard: started with Enter or Space, or a notice popped with one.
  const byKeyboard = useRef(false);

  // A click with no pointer behind it (detail 0) is Enter or Space. Starting that way puts focus
  // on the arena, so the first Tab reaches the first notice.
  function onStart(event: MouseEvent) {
    byKeyboard.current = event.detail === 0;
    start();
    if (byKeyboard.current) arena.current?.focus();
  }

  // Enter or Space on a notice pops it, and focus moves to a neighbour so the next one is a key
  // away. A pointer pops on its way down, not here.
  function onKeyPop(event: MouseEvent<HTMLButtonElement>, id: number) {
    if (event.detail !== 0) return;
    byKeyboard.current = true;
    const notices = [...(arena.current?.querySelectorAll("button") ?? [])];
    const at = notices.indexOf(event.currentTarget);
    (notices[at + 1] ?? notices[at - 1] ?? arena.current)?.focus();
    pop(id);
  }

  // A notice that falls out of the arena takes focus with it; the arena takes it back, so a
  // keyboard player is not dropped to the top of the page mid-round.
  useEffect(() => {
    if (isPlaying && byKeyboard.current && document.activeElement === document.body) {
      arena.current?.focus();
    }
  }, [isPlaying, frame]);

  return (
    <div className={catchGameClasses.root}>
      <div className={catchGameClasses.bar}>
        <span className={catchGameClasses.count}>{words.score(GAME_IDS.catch, frame.score)}</span>
        <span
          className={cn(
            catchGameClasses.count,
            isPlaying && frame.left < HURRY_SECONDS && catchGameClasses.hurry,
          )}
        >
          {t(catchGameKeys.left, { seconds: left })}
        </span>
      </div>
      <div ref={arena} className={catchGameClasses.arena} tabIndex={-1}>
        {isPlaying ? (
          frame.notices.map((notice) => (
            <button
              key={notice.id}
              type="button"
              className={cn(catchGameClasses.notice, catchGameClasses.kind[notice.kind])}
              style={{ left: `${notice.x}%`, transform: `translateY(${notice.y}px)` }}
              onPointerDown={(event) => {
                event.preventDefault();
                pop(notice.id);
              }}
              onClick={(event) => onKeyPop(event, notice.id)}
            >
              {t(LINES[notice.kind][notice.line])}
            </button>
          ))
        ) : (
          <div className={catchGameClasses.intro}>
            <p className={catchGameClasses.lead}>{t(catchGameKeys.intro)}</p>
            <p className={catchGameClasses.rules}>{t(catchGameKeys.rules)}</p>
            <Button size={BUTTON_SIZES.lg} onClick={onStart}>
              {t(catchGameKeys.start)}
            </Button>
          </div>
        )}
        <AnimatePresence>
          {popups.map((popup) => (
            <motion.span
              key={popup.id}
              className={cn(catchGameClasses.points, popup.points < 0 && catchGameClasses.lost)}
              style={{ left: `${popup.x + 8}%`, top: popup.y }}
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -50, scale: 1.2 }}
              transition={{ duration: 0.7 }}
              dir="ltr"
              aria-hidden
            >
              {signed.format(popup.points)}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
