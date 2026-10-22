"use client";

import { AnimatePresence, MotionConfig } from "motion/react";
import { useMemo, useState } from "react";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import type { RoomSnapshotDto } from "@/features/room/api/room.dto";
import { Hero } from "@/features/room/components/Hero";
import { JoinGate } from "@/features/room/components/JoinGate";
import { MeSheet } from "@/features/room/components/MeSheet";
import { RoomHeader } from "@/features/room/components/RoomHeader";
import { RoomSkeleton } from "@/features/room/components/RoomSkeleton";
import { VoteHeatmap } from "@/features/room/components/VoteHeatmap";
import { Welcome } from "@/features/room/components/Welcome";
import { useAutoFinalize } from "@/features/room/hooks/useAutoFinalize";
import { useEnsureLoginCode } from "@/features/room/hooks/useEnsureLoginCode";
import { IDENTITY_STATES, useIdentity } from "@/features/room/hooks/useIdentity";
import { useRename } from "@/features/room/hooks/useRename";
import { useRoom } from "@/features/room/hooks/useRoom";
import { useRoomRealtime } from "@/features/room/hooks/useRoomRealtime";
import { useSignInAs } from "@/features/room/hooks/useSignInAs";
import { useSwitchUser } from "@/features/room/hooks/useSwitchUser";
import { useVote } from "@/features/room/hooks/useVote";
import { sameName } from "@/features/room/utils/names";
import { leadingSlot, tallyVotes } from "@/features/room/utils/tally";
import { useNow } from "@/shared/hooks/useNow";
import { roomScreenClasses } from "./RoomScreen.classes";

interface RoomScreenProps {
  slug: string;
  /** The room as the page read it on the server, so the first paint is the real room. */
  initial: RoomSnapshotDto;
}

/** The room: its header, the status card and the vote, under the join gate until you're in. */
export function RoomScreen({ slug, initial }: RoomScreenProps) {
  const { data: snapshot } = useRoom(slug, initial);
  const identity = useIdentity(slug, snapshot);
  const { me, isHost } = identity;
  const vote = useVote(slug);
  const rename = useRename(slug);
  const signInAs = useSignInAs();
  const switchUser = useSwitchUser();
  const loginCode = useEnsureLoginCode(me, isHost);
  const [isMeOpen, setIsMeOpen] = useState(false);
  const now = useNow();
  const room = snapshot?.room;
  const votes = snapshot?.votes;
  const leader = useMemo(() => (votes ? leadingSlot(tallyVotes(votes)) : null), [votes]);
  useAutoFinalize(room, now);
  useRoomRealtime(slug, room?.id);
  if (!snapshot || !room) return <RoomSkeleton />;

  async function signInAsPlayer(name: string, code: string) {
    const player = snapshot?.players.find((candidate) => sameName(candidate.name, name));
    if (!player) throw new ApiError(API_ERROR_CODES.not_found, 404);
    await signInAs.mutateAsync({ userId: player.userId, code });
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className={roomScreenClasses.root}>
        <RoomHeader
          room={room}
          me={me}
          playerCount={snapshot.players.length}
          onMe={isHost ? undefined : () => setIsMeOpen(true)}
        />
        <div className={roomScreenClasses.body}>
          <div className={roomScreenClasses.side}>
            <Hero room={room} now={now} leader={leader} voterCount={snapshot.votes.length} />
          </div>
          <main className={roomScreenClasses.main}>
            <VoteHeatmap
              snapshot={snapshot}
              now={now}
              me={me}
              canVote={!isHost}
              onVote={(slotMs) => vote.mutateAsync({ userId: me?.userId ?? "", slotMs })}
            />
          </main>
        </div>
      </div>

      <Welcome key={me?.userId} me={me} isReturning={identity.returning} />
      {me && (
        <MeSheet
          me={me}
          open={isMeOpen}
          onClose={() => setIsMeOpen(false)}
          onRename={rename.mutateAsync}
          onLoginCode={loginCode.mutateAsync}
          onSwitch={() => switchUser.mutate()}
        />
      )}
      <AnimatePresence>
        {identity.state !== IDENTITY_STATES.ready && (
          <JoinGate
            key="gate"
            room={room}
            voterCount={snapshot.votes.length}
            isChecking={identity.state === IDENTITY_STATES.checking}
            onJoin={identity.join.mutateAsync}
            onSignInAs={signInAsPlayer}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
