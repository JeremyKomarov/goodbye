import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import { storyDiscClasses } from "./StoryDisc.classes";
import { STORY_DISC_SIZES, type StoryDiscSize } from "./StoryDisc.const";

interface StoryDiscProps {
  /** A colour token, `var(--…)`: the ring's second colour, and the disc's fill. */
  color: string;
  isSeen: boolean;
  size?: StoryDiscSize;
  /** A different fill inside the ring — the header's avatar keeps its own. */
  fill?: string;
  children: ReactNode;
}

/** A disc in a status ring. Decorative: whatever it sits in carries the label. */
export function StoryDisc(props: StoryDiscProps) {
  const { color, isSeen, size = STORY_DISC_SIZES.md, fill, children } = props;
  const style = { "--story-color": color, ...(fill && { "--story-fill": fill }) } as CSSProperties;
  return (
    <span
      className={cn(
        storyDiscClasses.root,
        storyDiscClasses.size[size],
        isSeen && storyDiscClasses.seen,
      )}
      style={style}
      aria-hidden
    >
      <span className={storyDiscClasses.inner}>{children}</span>
    </span>
  );
}

export { STORY_DISC_SIZES, type StoryDiscSize };
