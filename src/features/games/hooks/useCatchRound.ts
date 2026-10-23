import { useEffect, useRef, useState } from "react";
import { SCORE_RANGES } from "@/core/constants/games.const";
import {
  CATCH_SECONDS, NOTICE_KINDS, NOTICES, type NoticeKind,
} from "@/features/games/content/catch.const";
import { pickNoticeKind } from "@/features/games/utils/rounds";

/** A falling notification: `x` across the arena in %, `y` down it in px. */
export interface Notice {
  id: number;
  kind: NoticeKind;
  /** Which of the kind's lines it says. */
  line: number;
  x: number;
  y: number;
  speed: number;
}

/** The points a popped notice floats up with. */
export interface Popup {
  id: number;
  x: number;
  y: number;
  points: number;
}

const POPUP_MS = 700;

/**
 * One round of Catch: notifications fall faster and thicker for `CATCH_SECONDS`, held in a ref
 * and drawn once a frame. `lines[kind]` is how many things each kind can say.
 */
export function useCatchRound(
  arena: React.RefObject<HTMLDivElement | null>,
  lines: Record<NoticeKind, number>,
  onFinish: (score: number) => void,
) {
  const sim = useRef({ notices: [] as Notice[], score: 0, nextId: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [frame, setFrame] = useState({ notices: [] as Notice[], score: 0, left: CATCH_SECONDS });
  const [popups, setPopups] = useState<Popup[]>([]);
  const finish = useRef(onFinish);
  const lineCounts = useRef(lines);

  useEffect(() => {
    finish.current = onFinish;
    lineCounts.current = lines;
  });

  useEffect(() => {
    if (!isPlaying) return;
    const s = sim.current;
    let raf = 0;
    let last = performance.now();
    const startedAt = last;
    let spawn = 0;

    const loop = (time: number) => {
      const dt = Math.min(50, time - last) / 1000;
      last = time;
      const elapsed = (time - startedAt) / 1000;
      if (elapsed >= CATCH_SECONDS) {
        setIsPlaying(false);
        const { min, max } = SCORE_RANGES.catch;
        finish.current(Math.min(max, Math.max(min, s.score)));
        return;
      }
      const progress = elapsed / CATCH_SECONDS;
      const height = arena.current?.clientHeight ?? 460;
      spawn += dt * 1000;
      const interval = 640 - 380 * progress;
      while (spawn > interval) {
        spawn -= interval;
        const kind = pickNoticeKind();
        const pace = kind === NOTICE_KINDS.exit ? 1.5 : 0.85 + Math.random() * 0.3;
        s.notices.push({
          id: s.nextId++,
          kind,
          line: Math.floor(Math.random() * lineCounts.current[kind]),
          x: 4 + Math.random() * 56,
          y: -48,
          speed: (90 + 140 * progress) * pace,
        });
      }
      for (const notice of s.notices) notice.y += notice.speed * dt;
      s.notices = s.notices.filter((notice) => notice.y < height + 10);
      setFrame({ notices: s.notices.slice(), score: s.score, left: CATCH_SECONDS - elapsed });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, arena]);

  function start() {
    sim.current = { notices: [], score: 0, nextId: 0 };
    setPopups([]);
    setIsPlaying(true);
  }

  function pop(id: number) {
    const s = sim.current;
    const notice = s.notices.find((n) => n.id === id);
    if (!notice) return;
    s.notices = s.notices.filter((n) => n.id !== id);
    const { points } = NOTICES[notice.kind];
    s.score += points;
    navigator.vibrate?.(points < 0 ? [30, 40, 30] : 8);
    setPopups((previous) => [...previous.slice(-12), { id, x: notice.x, y: notice.y, points }]);
    setTimeout(() => setPopups((previous) => previous.filter((p) => p.id !== id)), POPUP_MS);
  }

  return { isPlaying, frame, popups, start, pop };
}
