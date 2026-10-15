"use client";

import styles from "./Leaderboard.module.scss";
import { initial, nameColor } from "@/core/colors";
import { formatSlot, votesLabel } from "@/core/hebrew";
import { GAME_META, rankRows } from "@/core/games";
import type { GameId, LeaderboardRow, Room, Vote } from "@/core/types";

type Props = {
  room: Room;
  tally: Map<number, Vote[]>;
  leaderboard: LeaderboardRow[];
  myUserId: string | null;
  /** Left out once the games are closed. */
  onPlay?: (game: GameId) => void;
};

export function Leaderboard({
  room,
  tally,
  leaderboard,
  myUserId,
  onPlay,
}: Props) {
  const topSlots = [...tally.entries()]
    .map(([ms, list]) => ({ ms, count: list.length }))
    .sort((a, b) => b.count - a.count || a.ms - b.ms)
    .slice(0, 3);
  const maxCount = topSlots[0]?.count ?? 0;

  return (
    <div className={styles.view1}>
      <section className={styles.view2}>
        <h2 className={styles.view3}>השעות המבוקשות</h2>
        {topSlots.length === 0 ? (
          <p className={styles.view4}>עוד אין הצבעות.</p>
        ) : (
          <ul className={styles.view5}>
            {topSlots.map((slot) => (
              <li key={slot.ms}>
                <div className={styles.view6}>
                  <span>{formatSlot(slot.ms, room.timezone)}</span>
                  <span className={styles.view4}>{votesLabel(slot.count)}</span>
                </div>
                <div className={styles.view7}>
                  <div
                    className={styles.view8}
                    style={{ width: `${(slot.count / maxCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {(Object.keys(GAME_META) as GameId[]).map((game) => {
        const rows = rankRows(leaderboard, game).slice(0, 10);
        return (
          <section
            key={game}
            className={styles.view2}
          >
            <h2 className={styles.view9}>
              {GAME_META[game].title}
            </h2>
            {rows.length === 0 && !onPlay ? (
              <p className={styles.view4}>אף אחד לא שיחק.</p>
            ) : rows.length === 0 && onPlay ? (
              <button
                type="button"
                onClick={() => onPlay(game)}
                className={styles.view10}
              >
                עוד אף אחד לא שיחק.{" "}
                <span className={styles.view11}>לשחק ראשון</span>
              </button>
            ) : (
              <ol className={styles.view12}>
                {rows.map((row, i) => {
                  const mine = row.user_id === myUserId;
                  return (
                    <li
                      key={row.user_id}
                      className={[styles.view13, mine ? styles.view14 : "", ""].filter(Boolean).join(" ")}
                    >
                      <span
                        className={[styles.view15, i === 0 ? styles.view16 : styles.view4, ""].filter(Boolean).join(" ")}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={styles.view17}
                        style={{ background: nameColor(row.user_id) }}
                      >
                        {initial(row.display_name)}
                      </span>
                      <span className={styles.view18}>
                        <bdi>{row.display_name}</bdi>
                        {mine && <span className={styles.view4}> (את/ה)</span>}
                      </span>
                      <span className={styles.view19}>
                        {GAME_META[game].format(row.score)}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        );
      })}
    </div>
  );
}
