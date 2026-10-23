import { z } from "zod";
import { HOST_GENDERS, LEAVE_REASONS, ROOM_STATUSES } from "@/core/constants/room.const";

// A room as every handler that answers with one sends it — the room screen's snapshot and the admin
// page alike. The admin token's hash never leaves the server, so it is not here.
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

export type RoomDto = z.infer<typeof RoomDtoSchema>;
