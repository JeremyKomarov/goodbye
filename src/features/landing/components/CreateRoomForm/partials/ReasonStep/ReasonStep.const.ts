import { LEAVE_REASONS, type LeaveReason } from "@/features/landing/api/rooms.dto";

/** Each story, in the order the cards show, with its emoji. */
export const REASON_CARDS: readonly { value: LeaveReason; emoji: string }[] = [
  { value: LEAVE_REASONS.fired, emoji: "📦" },
  { value: LEAVE_REASONS.quit, emoji: "🫡" },
  { value: LEAVE_REASONS.fedUp, emoji: "💅" },
];
