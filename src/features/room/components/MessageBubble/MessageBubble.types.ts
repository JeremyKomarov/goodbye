import type { HostGender, ReactionEmoji } from "@/core/constants/room.const";
import type { WallMessage } from "@/features/room/types/wall.types";

/** A message's reactions, and this browser's hand in them. */
export interface BubbleReactions {
  /** By person. */
  byUser: Record<string, ReactionEmoji> | undefined;
  /** This browser's reaction, if any; null when it can't react (it hasn't joined). */
  mine: ReactionEmoji | null | undefined;
  isPicking: boolean;
  onPicking: (isOpen: boolean) => void;
  /** Set, change, or (null) take back this browser's reaction. */
  onReact: (emoji: ReactionEmoji | null) => void;
}

export interface MessageBubbleProps {
  message: WallMessage;
  /** The same person's message just before: no name, no tail. */
  isFollowUp: boolean;
  isMine: boolean;
  /** Posted by the host — a badge beside the name, gendered. */
  hostGender: HostGender | null;
  /** "HH:MM" in the room's timezone. */
  time: string;
  reactions: BubbleReactions;
}
