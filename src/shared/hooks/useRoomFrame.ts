import { createContext, useContext } from "react";
import type { Room } from "@/shared/types/room.types";

/**
 * The room as another feature's section sees it, provided by the room's shell around every
 * section (docs/DECISIONS.md #9): the room as last read, and who this browser is in it.
 */
export interface RoomFrame {
  room: Room;
  /** This browser's user id once it is in the room — the shell's gate covers the rest. */
  meId: string | null;
  isHost: boolean;
}

export const RoomFrameContext = createContext<RoomFrame | null>(null);

export function useRoomFrame(): RoomFrame {
  const value = useContext(RoomFrameContext);
  if (!value) throw new Error("useRoomFrame: render the section inside the room's shell.");
  return value;
}
