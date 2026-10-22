import { createContext, useContext } from "react";
import type { Player, RoomSnapshot } from "@/features/room/types/room.types";
import type { Lead } from "@/features/room/utils/tally";

/**
 * What every section of the room shares, provided by `RoomShell` around the section's page: the
 * room as last read, and who this browser is in it. Data still comes from the queries — this only
 * passes along what the shell already holds, so a section never asks twice.
 */
export interface RoomContextValue {
  slug: string;
  snapshot: RoomSnapshot;
  me: Player | null;
  isHost: boolean;
  leader: Lead | null;
}

export const RoomContext = createContext<RoomContextValue | null>(null);

export function useRoomContext(): RoomContextValue {
  const value = useContext(RoomContext);
  if (!value) throw new Error("useRoomContext: render the section inside RoomShell.");
  return value;
}
