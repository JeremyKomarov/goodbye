import type { HostGender, LeaveReason } from "@/features/landing/api/rooms.dto";
import type { CreatedRoom } from "./room.types";

/** What the hero chat mirrors from the wizard while the host fills it in. */
export interface ChatPreview {
  story: LeaveReason | null;
  hostName: string;
  hostGender: HostGender;
  groupName: string;
}

/** A room just opened, with what the success card needs to word the invitation. */
export interface OpenedRoom {
  room: CreatedRoom;
  hostName: string;
  hostGender: HostGender;
}
