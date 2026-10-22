"use client";

import { AnimatePresence, MotionConfig } from "motion/react";
import type { RoomSnapshotDto } from "@/features/room/api/room.dto";
import { JoinGate } from "@/features/room/components/JoinGate";
import { RoomHeader } from "@/features/room/components/RoomHeader";
import { RoomSkeleton } from "@/features/room/components/RoomSkeleton";
import { Welcome } from "@/features/room/components/Welcome";
import { VoteHeatmap } from "@/features/room/components/VoteHeatmap";
import { IDENTITY_STATES, useIdentity } from "@/features/room/hooks/useIdentity";
import { useRoom } from "@/features/room/hooks/useRoom";
import { useVote } from "@/features/room/hooks/useVote";
import { useNow } from "@/shared/hooks/useNow";
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
  const vote = useVote(slug);
  const now = useNow();
  if (!snapshot) return <RoomSkeleton />;
  const { room } = snapshot;
  const { me } = identity;

  return (
    <MotionConfig reducedMotion="user">
      <div className={roomScreenClasses.root}>
        <RoomHeader room={room} me={identity.me} playerCount={snapshot.players.length} />
        <main className={roomScreenClasses.main}>
          <VoteHeatmap
            snapshot={snapshot}
            now={now}
            me={me}
            canVote={!identity.isHost}
            onVote={(slotMs) => vote.mutateAsync({ userId: me?.userId ?? "", slotMs })}
          />
        </main>
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
