import { useTranslations } from "next-intl";
import { finaleClasses } from "@/features/room/components/Finale/Finale.classes";
import { FINALE_NAMESPACE, finaleKeys } from "@/features/room/components/Finale/Finale.keys.const";
import { useGameWords } from "@/shared/hooks/useGameWords";
import type { GameRecord } from "@/shared/types/records.types";
import type { LovedMessage } from "@/shared/types/summary.types";

interface FinaleHighlightsProps {
  loved: LovedMessage | null;
  /** Each game's record holder, in the hub's order. */
  champions: GameRecord[];
}

/** The goodbye the room loved most, and each game's champion — each only if there is one. */
export function FinaleHighlights({ loved, champions }: FinaleHighlightsProps) {
  const t = useTranslations(FINALE_NAMESPACE);
  const words = useGameWords();

  return (
    <>
      {loved && (
        <figure className={finaleClasses.loved}>
          <figcaption className={finaleClasses.label}>
            {t(finaleKeys.loved, { count: loved.reactions })}
          </figcaption>
          <blockquote dir="auto" className={finaleClasses.quote}>
            {loved.body}
          </blockquote>
          <div className={finaleClasses.author}>
            <bdi>{loved.name}</bdi>
          </div>
        </figure>
      )}
      {champions.length > 0 && (
        <div className={finaleClasses.champions}>
          <h3 className={finaleClasses.championsTitle}>{t(finaleKeys.champions)}</h3>
          <ul className={finaleClasses.list}>
            {champions.map((top) => (
              <li key={top.game} className={finaleClasses.champion}>
                <span className={finaleClasses.game}>{words.title(top.game)}</span>
                <span className={finaleClasses.holder}>
                  <bdi>{top.name}</bdi>, {words.score(top.game, top.score)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
