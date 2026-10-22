export const SKELETON_SHAPES = {
  line: "line",
  block: "block",
  circle: "circle",
} as const;

export type SkeletonShape = (typeof SKELETON_SHAPES)[keyof typeof SKELETON_SHAPES];
