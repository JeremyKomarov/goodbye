import type { ReactionEmoji } from "@/core/constants/room.const";

export interface WallMessage {
  id: number;
  userId: string;
  /** The poster's name when they posted; a later rename leaves it. */
  name: string;
  body: string;
  createdAt: number;
}

/** Message id → user id → that user's reaction. */
export type ReactionMap = Record<number, Record<string, ReactionEmoji>>;

export interface Wall {
  messages: WallMessage[];
  reactions: ReactionMap;
}
