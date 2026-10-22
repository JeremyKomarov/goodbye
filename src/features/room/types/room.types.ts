import type { HostGender, LeaveReason, RoomStatus } from "@/shared/types/room.const";
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

export interface Player {
  userId: string;
  name: string;
}

export interface Vote {
  userId: string;
  slotMs: number;
}

/** Everything the room screen draws from, read in one request. */
export interface RoomSnapshot {
  room: Room;
  players: Player[];
  /** The host's user ids, one per device they opened the room on. Hosts don't vote. */
  hostIds: string[];
  votes: Vote[];
}
