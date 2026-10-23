import { useState } from "react";
import { PICTURE_POINTS, PICTURE_ROUND } from "@/features/games/content/pictures.const";
import { matches } from "@/features/games/utils/answers";
import { type Card, dealPictures } from "@/features/games/utils/rounds";

export const PICTURE_STATUSES = {
  asking: "asking",
  right: "right",
  wrong: "wrong",
  skipped: "skipped",
} as const;

export type PictureStatus = (typeof PICTURE_STATUSES)[keyof typeof PICTURE_STATUSES];

// The pictures of recent rounds, on this screen: a new round deals the others first.
let seen: ReadonlySet<string> = new Set();

// Loaded ahead, so the reveal shows the picture whole.
function warm(cards: Card[]) {
  const icons = cards.flatMap(({ puzzle }) => [...puzzle.top, ...puzzle.bottom]);
  for (const icon of new Set(icons.map((layer) => layer.icon)))
    new window.Image().src = `/picture-game/${icon}.svg`;
}

/** One round of the Picture game: six pictures, one guess each; only the real thing counts. */
export function usePictureRound(onFinish: (score: number) => void) {
  const [round, setRound] = useState<Card[] | null>(null);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<PictureStatus>(PICTURE_STATUSES.asking);
  const [score, setScore] = useState(0);
  const card = round?.[index] ?? null;

  function start() {
    const dealt = dealPictures(seen);
    seen = dealt.seen;
    const cards = dealt.cards;
    warm(cards);
    setRound(cards);
    setIndex(0);
    setStatus(PICTURE_STATUSES.asking);
    setScore(0);
  }

  function reveal(outcome: Exclude<PictureStatus, "asking">) {
    setStatus(outcome);
    if (outcome === PICTURE_STATUSES.right) setScore((s) => s + PICTURE_POINTS);
    navigator.vibrate?.(outcome === PICTURE_STATUSES.right ? 12 : [30, 40, 30]);
  }

  /** In a trick picture, naming the top thing is just a wrong guess. */
  function guess(text: string) {
    if (!card || status !== PICTURE_STATUSES.asking || !text.trim()) return;
    const answer = card.honest ? card.puzzle.decoy : card.puzzle.truth;
    reveal(matches(text, answer.answers) ? PICTURE_STATUSES.right : PICTURE_STATUSES.wrong);
  }

  const isLast = !!round && index === round.length - 1;
  function next() {
    if (isLast) return onFinish(score);
    setIndex((i) => i + 1);
    setStatus(PICTURE_STATUSES.asking);
  }

  return {
    card,
    answer: card ? (card.honest ? card.puzzle.decoy : card.puzzle.truth) : null,
    index,
    count: round?.length ?? PICTURE_ROUND,
    status,
    score,
    isLast,
    start,
    guess,
    skip: () => reveal(PICTURE_STATUSES.skipped),
    next,
  };
}
