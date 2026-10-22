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

/** The wall allows 1–140 characters once trimmed. */
export const MAX_WALL_MESSAGE = 140;

export const PostMessageInputSchema = z.object({
  body: z.string().trim().min(1).max(MAX_WALL_MESSAGE),
});

export const ReactInputSchema = z.object({
  emoji: z.enum(REACTION_EMOJIS),
});

export type PostMessageInput = z.input<typeof PostMessageInputSchema>;
export type ReactInput = z.input<typeof ReactInputSchema>;
