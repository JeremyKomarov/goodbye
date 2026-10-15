"use client";

import { initial, nameColor } from "@/lib/colors";
import { formatSlot, votesLabel } from "@/lib/hebrew";
import { GAME_META, rankRows } from "@/lib/games";
import type { GameId, LeaderboardRow, Room, Vote } from "@/lib/types";

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
    <div className="mx-auto grid max-w-5xl gap-4 pt-3 lg:grid-cols-2 lg:items-start lg:pt-0">
      <section className="rounded-3xl bg-panel/90 p-4 backdrop-blur-sm">
        <h2 className="mb-3 text-lg font-semibold">השעות המבוקשות</h2>
        {topSlots.length === 0 ? (
          <p className="text-mute">עוד אין הצבעות.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {topSlots.map((slot) => (
              <li key={slot.ms}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{formatSlot(slot.ms, room.timezone)}</span>
                  <span className="text-mute">{votesLabel(slot.count)}</span>
                </div>
                <div className="h-2 rounded-full bg-raised">
                  <div
                    className="h-full rounded-full bg-[oklch(0.63_0.14_162)]"
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
            className="rounded-3xl bg-panel/90 p-4 backdrop-blur-sm"
          >
            <h2 className="mb-2 text-lg font-semibold">
              {GAME_META[game].title}
            </h2>
            {rows.length === 0 && !onPlay ? (
              <p className="text-mute">אף אחד לא שיחק.</p>
            ) : rows.length === 0 && onPlay ? (
              <button
                type="button"
                onClick={() => onPlay(game)}
                className="text-start text-mute"
              >
                עוד אף אחד לא שיחק.{" "}
                <span className="text-tick">לשחק ראשון</span>
              </button>
            ) : (
              <ol className="flex flex-col">
                {rows.map((row, i) => {
                  const mine = row.user_id === myUserId;
                  return (
                    <li
                      key={row.user_id}
                      className={`flex items-center gap-3 rounded-xl px-2 py-2 ${mine ? "bg-bubble/40" : ""}`}
                    >
                      <span
                        className={`w-5 text-center font-display text-2xl leading-none ${i === 0 ? "text-pill" : "text-mute"}`}
                      >
                        {i + 1}
                      </span>
                      <span
                        className="grid size-8 place-items-center rounded-full text-sm font-semibold text-night"
                        style={{ background: nameColor(row.user_id) }}
                      >
                        {initial(row.display_name)}
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        <bdi>{row.display_name}</bdi>
                        {mine && <span className="text-mute"> (את/ה)</span>}
                      </span>
                      <span className="tabular-nums text-ink/85">
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
