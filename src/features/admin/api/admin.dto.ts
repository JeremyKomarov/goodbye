import { z } from "zod";
import { RoomDtoSchema } from "@/shared/api/room.dto";

// The host's view of their room, as GET /api/rooms/[slug]/admin sends it to the admin token:
// the room, everyone in it with their login code, and the newest goodbyes on the wall.

export const AdminPlayerDtoSchema = z.object({
  user_id: z.string(),
  display_name: z.string(),
  is_host: z.boolean(),
  /** Null until the player's browser has made one. */
  code: z.string().nullable(),
});

export const AdminMessageDtoSchema = z.object({
  id: z.number().int(),
  display_name: z.string(),
  body: z.string(),
  created_at: z.string(),
});

export const AdminRoomDtoSchema = z.object({
  room: RoomDtoSchema,
  players: z.array(AdminPlayerDtoSchema),
  /** Newest first. */
  messages: z.array(AdminMessageDtoSchema),
});

export type AdminRoomDto = z.infer<typeof AdminRoomDtoSchema>;
