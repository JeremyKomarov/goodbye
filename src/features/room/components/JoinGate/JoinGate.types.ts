import type { SaveNameInput } from "@/features/room/api/players.dto";
import type { Room } from "@/features/room/types/room.types";

export interface JoinGateProps {
  room: Room;
  voterCount: number;
  /** Still finding out who this browser is: cover the room, but don't ask for a name yet. */
  isChecking: boolean;
  /** Rejects with an `ApiError` — `name_taken` when someone has the name. */
  onJoin: (input: SaveNameInput) => Promise<unknown>;
  /** Comes in as the player with this name, with their code. Rejects with an `ApiError`. */
  onSignInAs: (name: string, code: string) => Promise<unknown>;
}
