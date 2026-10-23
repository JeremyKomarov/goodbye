import { z } from "zod";
import { RoomDtoSchema } from "@/shared/api/room.dto";

// The room as GET /api/rooms/[slug] sends it: the room row (shared/api/room.dto.ts) and everything
// the vote screen draws from — who joined, which of them is the host, and the votes.

export const PlayerDtoSchema = z.object({ user_id: z.string(), display_name: z.string() });
export const VoteDtoSchema = z.object({ user_id: z.string(), slot_start: z.string() });

export const RoomSnapshotDtoSchema = z.object({
  room: RoomDtoSchema,
  players: z.array(PlayerDtoSchema),
  host_ids: z.array(z.string()),
  votes: z.array(VoteDtoSchema),
});

export type RoomSnapshotDto = z.infer<typeof RoomSnapshotDtoSchema>;
