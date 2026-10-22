import type { HTMLAttributes, ReactNode } from "react";
import type { BubbleSide } from "./Bubble.const";

export interface BubbleProps extends HTMLAttributes<HTMLDivElement> {
  side?: BubbleSide;
  /** The first bubble of a run has a tail; the ones grouped under it do not. */
  hasTail?: boolean;
  /** Time, ticks — set small at the bottom end, the way WhatsApp does. */
  meta?: ReactNode;
}
