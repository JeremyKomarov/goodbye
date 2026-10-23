"use client";

import type { Route } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { type ComponentType, useState } from "react";
import type { GameId } from "@/core/constants/games.const";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { ROOM_SECTIONS, roomSectionPath } from "@/core/constants/routes.const";
import { CatchGame } from "@/features/games/components/CatchGame";
import { GamesClosed } from "@/features/games/components/GamesClosed";
import { RecordLine } from "@/features/games/components/RecordLine";
import { RunawayGame } from "@/features/games/components/RunawayGame";
import { useSubmitScore } from "@/features/games/hooks/useSubmitScore";
import type { GameProps } from "@/features/games/types/games.types";
import { celebrate } from "@/features/games/utils/celebrate";
import { Icon, ICON_NAMES } from "@/shared/components/Icon";
import { useGameWords } from "@/shared/hooks/useGameWords";
import { useRecords } from "@/shared/hooks/useRecords";
import { useRoomFrame } from "@/shared/hooks/useRoomFrame";
import { placeOf, rankRecords } from "@/shared/utils/records";
import { GameResult, type Result } from "./GameResult";
import { gameScreenClasses } from "./GameScreen.classes";
import { GAME_SCREEN_NAMESPACE, gameScreenKeys } from "./GameScreen.keys.const";

// Each game, as its step of phase 08 builds it.
const GAMES: Partial<Record<GameId, ComponentType<GameProps>>> = {
  runaway: RunawayGame,
  catch: CatchGame,
};

/** One game: played round after round, each score kept and placed against the room's. */
export function GameScreen({ game }: { game: GameId }) {
  const t = useTranslations(GAME_SCREEN_NAMESPACE);
  const words = useGameWords();
  const { room, meId } = useRoomFrame();
  const { data: records = [] } = useRecords(room.slug);
  const submit = useSubmitScore(room.slug);
  const [result, setResult] = useState<Result | null>(null);
  const [round, setRound] = useState(0);
  const hubHref = roomSectionPath(room.slug, ROOM_SECTIONS.games) as Route;
  const Game = GAMES[game];

  function finish(score: number) {
    // Placed against the records as they were, before this score reaches them.
    const place = meId ? placeOf(records, game, meId, score) : { isBest: true, rank: 1, total: 1 };
    submit.mutate({ game, score });
    setResult({ score, ...place });
    if (place.isBest && place.rank === 1) void celebrate();
  }

  function again() {
    submit.reset();
    setResult(null);
    setRound((r) => r + 1);
  }

  return (
    <section className={gameScreenClasses.root}>
      <header className={gameScreenClasses.head}>
        <Link href={hubHref} className={gameScreenClasses.back} aria-label={t(gameScreenKeys.back)}>
          <Icon name={ICON_NAMES.back} />
        </Link>
        <div className={gameScreenClasses.heading}>
          <h2 className={gameScreenClasses.title}>{words.title(game)}</h2>
          <RecordLine game={game} top={rankRecords(records, game)[0]} meId={meId} />
        </div>
      </header>
      <div className={gameScreenClasses.stage}>
        {result ? (
          <GameResult
            game={game}
            result={result}
            error={submit.error}
            hubHref={hubHref}
            onAgain={again}
          />
        ) : room.status === ROOM_STATUSES.exited ? (
          <GamesClosed room={room} />
        ) : (
          Game && <Game key={round} onFinish={finish} />
        )}
      </div>
    </section>
  );
}
