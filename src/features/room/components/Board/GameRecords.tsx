"use client";

import type { Route } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { GameId } from "@/core/constants/games.const";
import { useGameWords } from "@/shared/hooks/useGameWords";
import type { GameRecord } from "@/shared/types/records.types";
import { initialOf, senderColor } from "@/shared/utils/avatar";
import { cn } from "@/shared/utils/cn";
import { boardClasses } from "./Board.classes";
import { BOARD_NAMESPACE, boardKeys } from "./Board.keys.const";

// A game's board shows its top ten.
const TOP = 10;

interface GameRecordsProps {
  game: GameId;
  /** The game's records, best first. */
  ranked: GameRecord[];
  meId: string | null;
  /** The game's page while the games are open — nobody's played, so play first. */
  playHref: Route | null;
}

/** One game's top ten: place, avatar, name and score; your own row tinted. */
export function GameRecords({ game, ranked, meId, playHref }: GameRecordsProps) {
  const t = useTranslations(BOARD_NAMESPACE);
  const words = useGameWords();

  return (
    <section className={boardClasses.card}>
      <h2 className={boardClasses.title}>{words.title(game)}</h2>
      {ranked.length === 0 ? (
        <p className={boardClasses.empty}>
          {playHref ? t(boardKeys.games.notYet) : t(boardKeys.games.nobody)}
          {playHref && (
            <Link href={playHref} className={boardClasses.play}>
              {t(boardKeys.games.playFirst)}
            </Link>
          )}
        </p>
      ) : (
        <ol className={boardClasses.rows}>
          {ranked.slice(0, TOP).map((record, i) => (
            <li
              key={record.userId}
              className={cn(boardClasses.row, record.userId === meId && boardClasses.mine)}
            >
              <span className={cn(boardClasses.rank, i === 0 && boardClasses.first)}>{i + 1}</span>
              <span
                className={boardClasses.avatar}
                style={{ background: senderColor(record.userId) }}
                aria-hidden
              >
                {initialOf(record.name)}
              </span>
              <span className={boardClasses.name}>
                <bdi>{record.name}</bdi>
                {record.userId === meId && (
                  <span className={boardClasses.you}> {t(boardKeys.games.you)}</span>
                )}
              </span>
              <span className={boardClasses.score}>{words.score(game, record.score)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
