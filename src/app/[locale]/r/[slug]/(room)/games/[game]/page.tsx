import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FEATURE_KEYS } from "@/core/config/features.const";
import { GAME_IDS, type GameId } from "@/core/constants/games.const";
import { GameScreen } from "@/features/games/components/GameScreen";
import { featurePage } from "@/shared/utils/featurePage";
import { onEveryRequest } from "@/shared/utils/onEveryRequest";

type GamePageProps = PageProps<"/[locale]/r/[slug]/games/[game]">;

const isGame = (value: string): value is GameId => Object.values<string>(GAME_IDS).includes(value);

// The game is the request's, so it is read inside <Suspense>; an unknown one is the not-found page.
async function LoadedGame({ params }: GamePageProps) {
  const { game } = await params;
  if (!isGame(game)) notFound();
  return <GameScreen game={game} />;
}

function GamePage(props: GamePageProps) {
  return (
    <Suspense>
      <LoadedGame {...props} />
    </Suspense>
  );
}

export default onEveryRequest(featurePage(FEATURE_KEYS.games, GamePage));
