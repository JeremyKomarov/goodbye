"use client";

import type { Route } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { GameId } from "@/core/constants/games.const";
import { GAME_ART } from "@/features/games/content/games.const";
import { useGameWords } from "@/shared/hooks/useGameWords";
import type { GameRecord } from "@/shared/types/records.types";
import { cn } from "@/shared/utils/cn";
import { gamesHubClasses } from "./GamesHub.classes";
import { GAMES_HUB_NAMESPACE, gamesHubKeys } from "./GamesHub.keys.const";

interface GameTileProps {
  game: GameId;
  /** The game's page, or nothing once the games are closed. */
  href: Route | null;
  top: GameRecord | undefined;
  /** This player's best, when they have one. */
  myBest: number | undefined;
  meId: string | null;
}

/** One game in the hub: its picture, name and line, the room's record and your best. */
export function GameTile({ game, href, top, myBest, meId }: GameTileProps) {
  const t = useTranslations(GAMES_HUB_NAMESPACE);
  const words = useGameWords();
  const isMine = !!top && top.userId === meId;

  const body = (
    <>
      <span className={cn(gamesHubClasses.art, gamesHubClasses.accent[game])} aria-hidden>
        {GAME_ART[game]}
      </span>
      <span className={gamesHubClasses.text}>
        <span className={gamesHubClasses.title}>{words.title(game)}</span>
        <span className={gamesHubClasses.blurb}>{t(gamesHubKeys.blurb[game])}</span>
        <span className={gamesHubClasses.record}>
          <span aria-hidden>👑</span>
          {top ? (
            <>
              <bdi className={gamesHubClasses.holder}>
                {isMine ? t(gamesHubKeys.record.mine) : top.name}
              </bdi>
              <span className={gamesHubClasses.score}>{words.score(game, top.score)}</span>
            </>
          ) : (
            t(gamesHubKeys.record.none)
          )}
        </span>
        {myBest !== undefined && !isMine && (
          <span className={gamesHubClasses.best}>
            {t(gamesHubKeys.record.myBest, { score: words.score(game, myBest) })}
          </span>
        )}
      </span>
    </>
  );

  return href ? (
    <Link href={href} className={gamesHubClasses.tile}>
      {body}
    </Link>
  ) : (
    <div className={cn(gamesHubClasses.tile, gamesHubClasses.closed)} aria-disabled>
      {body}
    </div>
  );
}
