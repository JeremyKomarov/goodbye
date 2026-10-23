import type { Room } from "@/shared/types/room.types";

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
