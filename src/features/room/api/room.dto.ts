import { z } from "zod";
import { HOST_GENDERS, LEAVE_REASONS, ROOM_STATUSES } from "@/core/constants/room.const";

// The room as GET /api/rooms/[slug] sends it: the room row and everything the vote screen draws
// from — who joined, which of them is the host, and the votes. The admin token's hash never leaves
// the server, so it is not here.

export const RoomDtoSchema = z.object({
  id: z.string(),
  slug: z.string(),
  host_name: z.string(),
  host_gender: z.enum(HOST_GENDERS),
  group_name: z.string(),
  reason: z.enum(LEAVE_REASONS).nullable(),
  timezone: z.string(),
  window_start: z.iso.date(),
  window_end: z.iso.date(),
  day_start_hour: z.number().int(),
  day_end_hour: z.number().int(),
  voting_closes_at: z.string(),
  status: z.enum(ROOM_STATUSES),
  locked_slot: z.string().nullable(),
  exited_at: z.string().nullable(),
});

export const PlayerDtoSchema = z.object({ user_id: z.string(), display_name: z.string() });
export const VoteDtoSchema = z.object({ user_id: z.string(), slot_start: z.string() });

export const RoomSnapshotDtoSchema = z.object({
  room: RoomDtoSchema,
  players: z.array(PlayerDtoSchema),
  host_ids: z.array(z.string()),
  votes: z.array(VoteDtoSchema),
});

export type RoomDto = z.infer<typeof RoomDtoSchema>;
export type RoomSnapshotDto = z.infer<typeof RoomSnapshotDtoSchema>;
