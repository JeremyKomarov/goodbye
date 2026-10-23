import type { Room } from "@/shared/types/room.types";
import type { HostExit } from "@/features/room/hooks/useHostExit";
import type { Lead } from "@/shared/utils/tally";

export interface HeroProps {
  room: Room;
  /** The shared clock; 0 until it starts in the browser. */
  now: number;
  leader: Lead | null;
  /** How many have voted. */
  voterCount: number;
  /** The host's browser, once the hour is set: the exit row is their button. */
  hostExit?: HostExit | null;
}
