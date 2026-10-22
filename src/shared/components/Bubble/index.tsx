import { cn } from "@/shared/utils/cn";
import { bubbleClasses } from "./Bubble.classes";
import { BUBBLE_SIDES, type BubbleSide } from "./Bubble.const";
import type { BubbleProps } from "./Bubble.types";

/** A WhatsApp chat bubble. It places itself on its side of a column. */
export function Bubble({
  side = BUBBLE_SIDES.in,
  hasTail = true,
  meta,
  className,
  children,
  ...rest
}: BubbleProps) {
  return (
    <div
      {...rest}
      className={cn(
        bubbleClasses.root,
        bubbleClasses.side[side],
        hasTail && bubbleClasses.tail,
        className,
      )}
    >
      {children}
      {meta && <div className={bubbleClasses.meta}>{meta}</div>}
    </div>
  );
}

export { BUBBLE_SIDES, type BubbleSide };
