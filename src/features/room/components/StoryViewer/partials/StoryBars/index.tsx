import type { RefObject } from "react";
import { storyViewerClasses } from "@/features/room/components/StoryViewer/StoryViewer.classes";
import { cn } from "@/shared/utils/cn";

interface StoryBarsProps {
  count: number;
  current: number;
  /** The current bar's fill, whose width the viewer writes on every frame. */
  barRef: RefObject<HTMLDivElement | null>;
}

/** One bar per fact in the group: full behind, filling now, empty ahead. Decorative. */
export function StoryBars({ count, current, barRef }: StoryBarsProps) {
  return (
    <div className={storyViewerClasses.bars} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={storyViewerClasses.bar}>
          {index < current && (
            <div className={cn(storyViewerClasses.fill, storyViewerClasses.full)} />
          )}
          {index === current && <div ref={barRef} className={storyViewerClasses.fill} />}
        </div>
      ))}
    </div>
  );
}
