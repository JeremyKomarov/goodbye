import type { Room } from "@/shared/types/room.types";

export interface AdminPlayer {
  userId: string;
  name: string;
  isHost: boolean;
  /** Null until the player's browser has made one. */
  code: string | null;
  /** Whether they have a vote in; the host never does. */
  hasVoted: boolean;
}

export interface AdminMessage {
  id: number;
  name: string;
  body: string;
  createdAt: number;
}

/** The host's view of their room. */
export interface AdminRoom {
  room: Room;
  players: AdminPlayer[];
  /** Newest first. */
  messages: AdminMessage[];
}
