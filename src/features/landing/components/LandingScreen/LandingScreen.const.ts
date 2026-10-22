import { LEAVE_REASONS, type LeaveReason } from "@/features/landing/api/rooms.dto";

/** What the chat shows before the host has touched the wizard; the wizard starts on this story. */
export const INITIAL_CHAT = {
  story: LEAVE_REASONS.fired as LeaveReason,
  hostName: "",
  groupName: "",
};
