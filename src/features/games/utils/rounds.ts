// The rules a round is played by, apart from the React that plays it: what an answer earns, which
// pictures are dealt, which notice falls next. `random` is `Math.random` unless a test fixes it.
import { NOTICE_KINDS, NOTICES, type NoticeKind } from "@/features/games/content/catch.const";
import { PICTURE_ROUND, PICTURES, type PicturePuzzle } from "@/features/games/content/pictures.const";
import { RIGHT_POINTS, SPEED_POINTS, TRIVIA_SECONDS } from "@/features/games/content/trivia.const";
import { shuffle } from "./shuffle";

/** A Trivia answer's points: none if wrong; 100 if right, and up to 50 more for the time left. */
export function triviaPoints(isRight: boolean, leftMs: number) {
  if (!isRight) return 0;
  const left = Math.min(Math.max(0, leftMs), TRIVIA_SECONDS * 1000);
  return RIGHT_POINTS + Math.round((SPEED_POINTS * left) / (TRIVIA_SECONDS * 1000));
}

/** A picture as dealt: honest ones really are the thing at the top. */
export interface Card {
  puzzle: PicturePuzzle;
  honest: boolean;
}

/**
 * A round of the Picture game: pictures not in `seen` first, exactly one of them honest. Returns
 * the cards and what is seen after it — emptied first once every picture has had its turn.
 */
export function dealPictures(seen: ReadonlySet<string>, random: () => number = Math.random) {
  const fresh = shuffle(PICTURES.filter((p) => !seen.has(p.id)), random);
  const rest = shuffle(PICTURES.filter((p) => seen.has(p.id)), random);
  const picked = shuffle([...fresh, ...rest].slice(0, PICTURE_ROUND), random);
  const nowSeen = new Set(fresh.length <= PICTURE_ROUND ? [] : seen);
  for (const p of picked) nowSeen.add(p.id);
  const honest = Math.floor(random() * picked.length);
  const cards: Card[] = picked.map((puzzle, i) => ({ puzzle, honest: i === honest }));
  return { cards, seen: nowSeen };
}

/** Which kind of notice falls next in Catch, by the kinds' weights; `r` is in [0, 1). */
export function pickNoticeKind(r: number = Math.random()): NoticeKind {
  for (const kind of Object.values(NOTICE_KINDS)) {
    r -= NOTICES[kind].weight;
    if (r <= 0) return kind;
  }
  return NOTICE_KINDS.message;
}
