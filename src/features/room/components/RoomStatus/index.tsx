"use client";

import { ExitActions } from "@/features/room/components/ExitActions";
import { Hero } from "@/features/room/components/Hero";
import { useRoomContext } from "@/features/room/hooks/useRoomContext";
import { useNow } from "@/shared/hooks/useNow";

/**
 * The status card as the room shows it — in the side column on wide screens, above the hour grid
 * on a phone: the hero, from the room as last read, with the actions under it.
 */
export function RoomStatus() {
  const { snapshot, leader, hostExit } = useRoomContext();
  const now = useNow();

  return (
    <Hero
      room={snapshot.room}
      now={now}
      leader={leader}
      voterCount={snapshot.votes.length}
      hostExit={hostExit}
      actions={<ExitActions />}
    />
  );
}
