import type { CSSProperties } from "react";
import { cn } from "@/shared/utils/cn";
import { skeletonClasses } from "./Skeleton.classes";
import { SKELETON_SHAPES, type SkeletonShape } from "./Skeleton.const";

/** Decorative; the region that is loading carries `aria-busy`. Sizes are CSS lengths. */
export function Skeleton({
  shape = SKELETON_SHAPES.line,
  width,
  height,
  className,
}: {
  shape?: SkeletonShape;
  width?: string;
  height?: string;
  className?: string;
}) {
  const style = { "--skeleton-width": width, "--skeleton-height": height } as CSSProperties;

  return (
    <span
      className={cn(skeletonClasses.root, skeletonClasses.shape[shape], className)}
      style={style}
      aria-hidden
    />
  );
}

export { SKELETON_SHAPES, type SkeletonShape };
