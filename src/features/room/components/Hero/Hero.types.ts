import type { Room } from "@/features/room/types/room.types";
import type { Lead } from "@/features/room/utils/tally";

export interface HeroProps {
  room: Room;
  /** The shared clock; 0 until it starts in the browser. */
  now: number;
  leader: Lead | null;
  /** How many have voted. */
  voterCount: number;
}
