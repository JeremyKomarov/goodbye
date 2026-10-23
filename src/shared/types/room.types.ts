import type { HostGender, LeaveReason, RoomStatus } from "@/core/constants/room.const";
import type { RoomWindow } from "@/shared/utils/slots";

/** A room, with its times as epoch milliseconds. It is a `RoomWindow`, so it builds its slots. */
export interface Room extends RoomWindow {
  id: string;
  slug: string;
  hostName: string;
  hostGender: HostGender;
  groupName: string;
  reason: LeaveReason | null;
  votingClosesAt: number;
  status: RoomStatus;
  /** The winning hour, once voting has closed. */
  lockedSlot: number | null;
  /** When the host marked that they left the group. */
  exitedAt: number | null;
}
