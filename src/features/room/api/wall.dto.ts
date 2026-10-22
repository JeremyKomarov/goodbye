import { z } from "zod";
import { REACTION_EMOJIS } from "@/core/constants/room.const";

// The wall as GET /api/rooms/[slug]/wall sends it: the newest messages, oldest first, and every
// reaction to them.

export const WallMessageDtoSchema = z.object({
  id: z.number().int(),
  user_id: z.string(),
  display_name: z.string(),
  body: z.string(),
  created_at: z.string(),
});

export const WallReactionDtoSchema = z.object({
  message_id: z.number().int(),
  user_id: z.string(),
  emoji: z.enum(REACTION_EMOJIS),
});

export const WallDtoSchema = z.object({
  messages: z.array(WallMessageDtoSchema),
  reactions: z.array(WallReactionDtoSchema),
});

export type WallMessageDto = z.infer<typeof WallMessageDtoSchema>;
export type WallDto = z.infer<typeof WallDtoSchema>;
