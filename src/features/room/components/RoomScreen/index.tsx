"use client";

import { AnimatePresence, MotionConfig } from "motion/react";
import type { RoomSnapshotDto } from "@/features/room/api/room.dto";
import { JoinGate } from "@/features/room/components/JoinGate";
import { RoomHeader } from "@/features/room/components/RoomHeader";
import { RoomSkeleton } from "@/features/room/components/RoomSkeleton";
import { Welcome } from "@/features/room/components/Welcome";
import { IDENTITY_STATES, useIdentity } from "@/features/room/hooks/useIdentity";
import { useRoom } from "@/features/room/hooks/useRoom";
import { roomScreenClasses } from "./RoomScreen.classes";

interface RoomScreenProps {
  slug: string;
  /** The room as the page read it on the server, so the first paint is the real room. */
  initial: RoomSnapshotDto;
}

/** The room: its header and the vote, under the join gate until this browser has a name here. */
export function RoomScreen({ slug, initial }: RoomScreenProps) {
  const { data: snapshot } = useRoom(slug, initial);
  const identity = useIdentity(slug, snapshot);
  if (!snapshot) return <RoomSkeleton />;
  const { room } = snapshot;

  return (
    <MotionConfig reducedMotion="user">
      <div className={roomScreenClasses.root}>
        <RoomHeader room={room} me={identity.me} playerCount={snapshot.players.length} />
        <main className={roomScreenClasses.main} />
      </div>

      <Welcome key={identity.me?.userId} me={identity.me} isReturning={identity.returning} />
      <AnimatePresence>
        {identity.state !== IDENTITY_STATES.ready && (
          <JoinGate
            key="gate"
            room={room}
            voterCount={snapshot.votes.length}
            isChecking={identity.state === IDENTITY_STATES.checking}
            onJoin={identity.join.mutateAsync}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
