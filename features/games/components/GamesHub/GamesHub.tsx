"use client";

import styles from "./GamesHub.module.scss";
import { motion } from "motion/react";
import { useState } from "react";
import { CatchGame } from "@/features/games/components/CatchGame/CatchGame";
import { PictureGame } from "@/features/games/components/PictureGame/PictureGame";
import { RunawayGame } from "@/features/games/components/RunawayGame/RunawayGame";
import { TriviaGame } from "@/features/games/components/TriviaGame/TriviaGame";
import { GAME_META, rankRows } from "@/core/games";
import { RecordLine } from "@/features/games/components/GameRecordLine/GameRecordLine";
import { TILES } from "@/features/games/content/gameTiles";
import type { GameId, LeaderboardRow } from "@/core/types";

type Props = {
  game: GameId | null;
  onGameChange: (game: GameId | null) => void;
  leaderboard: LeaderboardRow[];
  myUserId: string | null;
  onScore: (game: GameId, score: number) => void;
  /** Once the host has left: why the games are closed. The records stay as they are. */
  closed?: string | null;
  onBoard?: () => void;
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
  closed = null,
  onBoard,
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

  if (game && !closed) {
    const meta = GAME_META[game];
    return (
      <div className={styles.view7}>
        <div className={styles.view8}>
          <button
            type="button"
            onClick={() => {
              setResult(null);
              onGameChange(null);
            }}
            className={styles.view9}
            aria-label="חזרה למשחקים"
          >
            <svg
              viewBox="0 0 24 24"
              className={styles.view10}
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
          <div className={styles.view11}>
            <h2 className={styles.view12}>
              {meta.title}
            </h2>
            <RecordLine game={game} top={top(game)} myUserId={myUserId} />
          </div>
        </div>

        {result?.game === game ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.view13}
          >
            <p className={styles.view14}>
              {result.best && result.rank === 1
                ? "השיא החדש של החדר 👑"
                : result.best
                  ? "שיא אישי חדש"
                  : "התוצאה שלך"}
            </p>
            <p className={styles.view15}>
              {meta.format(result.score)}
            </p>
            <p className={styles.view16}>
              {result.total === 1
                ? "את/ה הראשון/ה בטבלה"
                : `מקום ${result.rank} מתוך ${result.total}`}
            </p>
            <div className={styles.view17}>
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setRound((r) => r + 1);
                }}
                className={styles.view18}
              >
                עוד סיבוב
              </button>
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  onGameChange(null);
                }}
                className={styles.view19}
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
    <div className={styles.view20}>
      {closed && (
        <div className={styles.view21}>
          <p className={styles.view22}>🏁 המשחקים נסגרו</p>
          <p className={styles.view23}>{closed}</p>
          {onBoard && (
            <button
              type="button"
              onClick={onBoard}
              className={styles.view24}
            >
              לטבלת השיאים
            </button>
          )}
        </div>
      )}
      <div className={styles.view25}>
        {TILES.map((tile, i) => {
          const best = myBest(tile.id);
          const record = top(tile.id);
          const mineRecord = !!record && record.user_id === myUserId;
          return (
            <motion.button
              key={tile.id}
              type="button"
              disabled={!!closed}
              onClick={() => onGameChange(tile.id)}
              whileTap={closed ? undefined : { scale: 0.98 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: closed ? 0.6 : 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={[styles.view26, closed ? styles.view27 : styles.view28, styles.view29].filter(Boolean).join(" ")}
            >
              <span
                className={styles.view30}
                style={{
                  background: `color-mix(in oklab, ${tile.accent} 22%, transparent)`,
                }}
              >
                {tile.art}
              </span>
              <span className={styles.view11}>
                <span className={styles.view31}>
                  {GAME_META[tile.id].title}
                </span>
                <span className={styles.view32}>
                  {tile.blurb}
                </span>
                <span className={styles.view33}>
                  <span aria-hidden>👑</span>
                  {record ? (
                    <span className={styles.view34}>
                      <bdi className={styles.view35}>
                        {mineRecord ? "השיא שלך" : record.display_name}
                      </bdi>{" "}
                      <span className={styles.view14}>
                        {GAME_META[tile.id].format(record.score)}
                      </span>
                    </span>
                  ) : (
                    <span className={styles.view14}>עוד אין שיא</span>
                  )}
                </span>
                {best !== undefined && !mineRecord && (
                  <span className={styles.view36}>
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
