/** How a line arrives: rises a little and settles, on a spring. */
export const CHAT_LINE_MOTION = {
  layout: true,
  initial: { opacity: 0, y: 12, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0 },
  transition: { type: "spring", damping: 22, stiffness: 300 },
} as const;
