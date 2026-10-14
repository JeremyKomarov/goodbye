"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { CatchGame } from "@/components/games/CatchGame";
import { RunawayGame } from "@/components/games/RunawayGame";
import { TriviaGame } from "@/components/games/TriviaGame";
import { GAME_META, rankRows } from "@/components/room/Leaderboard";
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
];

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
      <div className="pt-3">
        <div className="mb-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setResult(null);
              onGameChange(null);
            }}
            className="grid size-10 place-items-center rounded-full text-mute hover:bg-raised"
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
          <h2 className="text-lg font-semibold">{meta.title}</h2>
        </div>

        {result?.game === game ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-panel/90 p-6 text-center"
          >
            <p className="text-mute">
              {result.best ? "שיא אישי חדש" : "התוצאה שלך"}
            </p>
            <p className="my-2 font-display text-[5rem] font-bold leading-none">
              {meta.format(result.score)}
            </p>
            <p className="text-lg">
              {result.total === 1
                ? "את/ה הראשון/ה בטבלה"
                : `מקום ${result.rank} מתוך ${result.total}`}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2">
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
        ) : (
          <CatchGame key={round} onFinish={(s) => finish("catch", s)} />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pt-3">
      {TILES.map((tile, i) => {
        const best = myBest(tile.id);
        return (
          <motion.button
            key={tile.id}
            type="button"
            onClick={() => onGameChange(tile.id)}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-4 rounded-3xl bg-panel/90 p-4 text-start"
          >
            <span
              className="grid size-16 shrink-0 place-items-center rounded-2xl text-3xl"
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
              <span className="mt-0.5 block text-sm leading-snug text-ink/70">
                {tile.blurb}
              </span>
              {best !== undefined && (
                <span className="mt-1 block text-xs text-mute">
                  השיא שלך: {GAME_META[tile.id].format(best)}
                </span>
              )}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
