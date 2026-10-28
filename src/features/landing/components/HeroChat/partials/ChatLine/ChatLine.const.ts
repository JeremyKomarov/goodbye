/**
 * How a line arrives: it rises and fades in, and the lines above glide up to make room — one soft
 * spring for both, so the chat moves as one.
 */
export const CHAT_LINE_MOTION = {
  layout: "position",
  initial: { opacity: 0, y: 16, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0 },
  transition: {
    type: "spring",
    stiffness: 210,
    damping: 26,
    opacity: { duration: 0.3, ease: "easeOut" },
  },
} as const;
