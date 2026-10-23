import { useState } from "react";
import {
  PICTURE_POINTS, PICTURE_ROUND, PICTURES, type PicturePuzzle,
} from "@/features/games/content/pictures.const";
import { matches } from "@/features/games/utils/answers";

export const PICTURE_STATUSES = {
  asking: "asking",
  right: "right",
  wrong: "wrong",
  skipped: "skipped",
} as const;

export type PictureStatus = (typeof PICTURE_STATUSES)[keyof typeof PICTURE_STATUSES];

/** A picture as dealt: honest ones really are the thing at the top. */
export interface Card {
  puzzle: PicturePuzzle;
  honest: boolean;
}

function shuffle<T>(list: readonly T[]): T[] {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// The pictures of recent rounds, on this screen: a new round deals the others first.
let seen = new Set<string>();

function dealRound(): Card[] {
  const fresh = shuffle(PICTURES.filter((p) => !seen.has(p.id)));
  const rest = shuffle(PICTURES.filter((p) => seen.has(p.id)));
  const picked = shuffle([...fresh, ...rest].slice(0, PICTURE_ROUND));
  // Once every picture has had its turn, the cycle starts again from this round.
  if (fresh.length <= PICTURE_ROUND) seen = new Set();
  for (const p of picked) seen.add(p.id);
  // Exactly one picture a round is honest, at a random place in it.
  const honest = Math.floor(Math.random() * picked.length);
  return picked.map((puzzle, i) => ({ puzzle, honest: i === honest }));
}

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
    const cards = dealRound();
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
