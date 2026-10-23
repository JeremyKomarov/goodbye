import { useEffect, useRef, useState } from "react";
import {
  ANSWERS, OPTIONS, type OptionId, type QuestionId, RIGHT_POINTS, SPEED_POINTS, TRIVIA_ROUND,
  TRIVIA_SECONDS,
} from "@/features/games/content/trivia.const";

/** A question as asked: its options in this round's order. */
export interface AskedQuestion {
  id: QuestionId;
  options: OptionId[];
}

/** No answer yet, the option picked, or `null` when the time ran out. */
export type Pick = OptionId | null | undefined;

const SECONDS_MS = TRIVIA_SECONDS * 1000;

function shuffle<T>(list: readonly T[]): T[] {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const buildRound = (): AskedQuestion[] =>
  shuffle(Object.keys(ANSWERS) as QuestionId[])
    .slice(0, TRIVIA_ROUND)
    .map((id) => ({ id, options: shuffle(OPTIONS) }));

/** One round of Trivia: ten questions, each on its own clock; a quick right answer earns more. */
export function useTriviaRound(onFinish: (score: number) => void) {
  const [round, setRound] = useState<AskedQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Pick>(undefined);
  const [deadline, setDeadline] = useState(0);
  const [score, setScore] = useState(0);
  const [gained, setGained] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function ask(i: number) {
    setIndex(i);
    setPicked(undefined);
    setGained(0);
    setDeadline(Date.now() + SECONDS_MS);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPicked((current) => current ?? null), SECONDS_MS);
  }

  function start() {
    setRound(buildRound());
    setScore(0);
    ask(0);
  }

  function answer(choice: OptionId) {
    if (!round || picked !== undefined) return;
    clearTimeout(timer.current);
    setPicked(choice);
    const isRight = choice === ANSWERS[round[index].id];
    const left = Math.max(0, deadline - Date.now());
    const points = isRight ? RIGHT_POINTS + Math.round((SPEED_POINTS * left) / SECONDS_MS) : 0;
    navigator.vibrate?.(isRight ? 12 : [30, 40, 30]);
    setGained(points);
    setScore((s) => s + points);
  }

  const isLast = index === TRIVIA_ROUND - 1;
  const next = () => (isLast ? onFinish(score) : ask(index + 1));

  return {
    question: round?.[index] ?? null,
    index,
    picked,
    deadline,
    score,
    gained,
    isLast,
    start,
    answer,
    next,
  };
}
