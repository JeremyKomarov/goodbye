"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { CatchGame } from "@/components/games/CatchGame";
import { PictureGame } from "@/components/games/PictureGame";
import { RunawayGame } from "@/components/games/RunawayGame";
import { TriviaGame } from "@/components/games/TriviaGame";
import { GAME_META, rankRows } from "@/lib/games";
import type { GameId, LeaderboardRow } from "@/lib/types";

const TILES: { id: GameId; art: string; blurb: string; accent: string }[] = [
  {
    id: "runaway",
    art: "🚪",
    blurb: "הכפתור בורח. כמה מהר תתפסו אותו?",
    accent: "var(--color-exit)",
  },
  {
    id: "trivia",
    art: "🧠",
    blurb: "10 שאלות על וואטסאפ, משרדים ואנשים שפוטרו והצליחו",
    accent: "var(--color-kraft)",
  },
  {
    id: "catch",
    art: "🔔",
    blurb: "פוצצו התראות לפני שהן קוברות אתכם. רק לא את הבוס",
    accent: "var(--color-tick)",
  },
  {
    id: "picture",
    art: "🖼️",
    blurb: "רואים רבע תמונה ובטוחים שזה ברור. ואז רואים את השאר",
    accent: "var(--color-pill)",
  },
];

/** The room's record for a game, under its title while playing (like a chat's subtitle). Pops when the record changes. */
function RecordLine({
  game,
  top,
  myUserId,
}: {
  game: GameId;
  top: LeaderboardRow | undefined;
  myUserId: string | null;
}) {
  const mine = !!top && top.user_id === myUserId;
  return (
    <div aria-live="polite" className="h-6 overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.p
          key={top ? `${top.user_id}:${top.score}` : "none"}
          initial={{ opacity: 0, y: -12, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "spring", damping: 18, stiffness: 320 }}
          className="flex h-6 items-center gap-1.5 text-sm"
        >
          <span aria-hidden>👑</span>
          {top ? (
            <>
              <span className="shrink-0 text-mute">
                {mine ? "השיא שלך" : "השיא:"}
              </span>
              {!mine && (
                <bdi className="min-w-0 truncate font-semibold text-ink">
                  {top.display_name}
                </bdi>
              )}
              <span className="shrink-0 font-display text-xl leading-none text-pill tabular-nums">
                {GAME_META[game].format(top.score)}
              </span>
            </>
          ) : (
            <span className="truncate text-mute">
              עוד אין שיא בחדר. תהיו הראשונים
            </span>
          )}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

type Props = {
  game: GameId | null;
  onGameChange: (game: GameId | null) => void;
  leaderboard: LeaderboardRow[];
  myUserId: string | null;
  onScore: (game: GameId, score: number) => void;
};

type Result = {
  game: GameId;
  score: number;
  rank: number;
  total: number;
  best: boolean;
};

export function GamesHub({
  game,
  onGameChange,
  leaderboard,
  myUserId,
  onScore,
}: Props) {
  const [result, setResult] = useState<Result | null>(null);
  const [round, setRound] = useState(0);

  const top = (id: GameId) => rankRows(leaderboard, id)[0];

  function myBest(id: GameId) {
    return leaderboard.find((r) => r.game === id && r.user_id === myUserId)
      ?.score;
  }

  function finish(id: GameId, score: number) {
    const lower = GAME_META[id].lowerWins;
    const previous = myBest(id);
    const best =
      previous === undefined || (lower ? score < previous : score > previous);
    const others = rankRows(leaderboard, id).filter(
      (r) => r.user_id !== myUserId,
    );
    const myScore = best ? score : previous!;
    const rank =
      others.filter((r) => (lower ? r.score < myScore : r.score > myScore))
        .length + 1;
    onScore(id, score);
    setResult({ game: id, score, rank, total: others.length + 1, best });
    if (best && rank === 1) {
      import("canvas-confetti").then(({ default: confetti }) =>
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#f15c6d", "#ffd279", "#25d366"],
          disableForReducedMotion: true,
        }),
      );
    }
  }

  if (game) {
    const meta = GAME_META[game];
    return (
      <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col px-3 pb-3 pt-2 tiny:pb-2 tiny:pt-1 lg:py-5 lg:short:py-3">
        <div className="mb-2 flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setResult(null);
              onGameChange(null);
            }}
            className="grid size-10 shrink-0 place-items-center rounded-full text-mute hover:bg-raised"
            aria-label="חזרה למשחקים"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-semibold leading-tight">
              {meta.title}
            </h2>
            <RecordLine game={game} top={top(game)} myUserId={myUserId} />
          </div>
        </div>

        {result?.game === game ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="my-auto rounded-3xl bg-panel/90 p-6 text-center short:p-5 tiny:p-4"
          >
            <p className="text-mute">
              {result.best && result.rank === 1 ? "השיא החדש של החדר 👑" : result.best ? "שיא אישי חדש" : "התוצאה שלך"}
            </p>
            <p className="my-2 font-display text-[5rem] font-bold leading-none short:text-[4rem] tiny:my-1 tiny:text-[3rem]">
              {meta.format(result.score)}
            </p>
            <p className="text-lg">
              {result.total === 1
                ? "את/ה הראשון/ה בטבלה"
                : `מקום ${result.rank} מתוך ${result.total}`}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2 short:mt-4 tiny:mt-3">
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setRound((r) => r + 1);
                }}
                className="rounded-2xl bg-ink px-4 py-3.5 font-semibold text-night"
              >
                עוד סיבוב
              </button>
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  onGameChange(null);
                }}
                className="rounded-2xl bg-raised px-4 py-3.5 font-semibold"
              >
                כל המשחקים
              </button>
            </div>
          </motion.div>
        ) : game === "runaway" ? (
          <RunawayGame key={round} onFinish={(s) => finish("runaway", s)} />
        ) : game === "trivia" ? (
          <TriviaGame key={round} onFinish={(s) => finish("trivia", s)} />
        ) : game === "catch" ? (
          <CatchGame key={round} onFinish={(s) => finish("catch", s)} />
        ) : (
          <PictureGame key={round} onFinish={(s) => finish("picture", s)} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4 pt-3 short:pb-3 short:pt-2 lg:px-6 lg:py-6">
    <div className="mx-auto grid max-w-3xl gap-3 short:gap-2 tiny:grid-cols-2 lg:grid-cols-2 lg:short:gap-3">
      {TILES.map((tile, i) => {
        const best = myBest(tile.id);
        const record = top(tile.id);
        const mineRecord = !!record && record.user_id === myUserId;
        return (
          <motion.button
            key={tile.id}
            type="button"
            onClick={() => onGameChange(tile.id)}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-4 rounded-3xl bg-panel/90 p-4 text-start transition-colors hover:bg-raised/80 short:p-3 tiny:gap-3 lg:flex-col lg:items-start lg:p-5 lg:short:flex-row lg:short:items-center lg:short:p-4"
          >
            <span
              className="grid size-16 shrink-0 place-items-center rounded-2xl text-3xl short:size-14 tiny:size-12 tiny:text-2xl"
              style={{
                background: `color-mix(in oklab, ${tile.accent} 22%, transparent)`,
              }}
            >
              {tile.art}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">
                {GAME_META[tile.id].title}
              </span>
              <span className="mt-0.5 block text-sm leading-snug text-ink/70 tiny:hidden">
                {tile.blurb}
              </span>
              <span className="mt-2 flex items-center gap-1.5 text-xs">
                <span aria-hidden>👑</span>
                {record ? (
                  <span className="min-w-0 truncate">
                    <bdi className="font-semibold text-pill">{mineRecord ? "השיא שלך" : record.display_name}</bdi>{" "}
                    <span className="text-mute">{GAME_META[tile.id].format(record.score)}</span>
                  </span>
                ) : (
                  <span className="text-mute">עוד אין שיא</span>
                )}
              </span>
              {best !== undefined && !mineRecord && (
                <span className="mt-1 block text-xs text-mute">
                  השיא שלך: {GAME_META[tile.id].format(best)}
                </span>
              )}
            </span>
          </motion.button>
        );
      })}
    </div>
    </div>
  );
}
