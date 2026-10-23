import type { RefObject } from "react";
import { storyPlayerClasses } from "@/features/room/components/StoryPlayer/StoryPlayer.classes";
import { cn } from "@/shared/utils/cn";

interface StoryBarsProps {
  count: number;
  current: number;
  /** The current bar's fill, whose width the viewer writes on every frame. */
  barRef: RefObject<HTMLDivElement | null>;
}

/** One bar per slide: full behind, filling now, empty ahead. Decorative. */
export function StoryBars({ count, current, barRef }: StoryBarsProps) {
  return (
    <div className={storyPlayerClasses.bars} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={storyPlayerClasses.bar}>
          {index < current && (
            <div className={cn(storyPlayerClasses.fill, storyPlayerClasses.full)} />
          )}
          {index === current && <div ref={barRef} className={storyPlayerClasses.fill} />}
        </div>
      ))}
    </div>
  );
}
