"use client";

import { AnimatePresence, MotionConfig } from "motion/react";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import { ROOM_SECTIONS, roomSectionPath } from "@/core/constants/routes.const";
import type { RoomSnapshotDto } from "@/features/room/api/room.dto";
import { Hero } from "@/features/room/components/Hero";
import { JoinGate } from "@/features/room/components/JoinGate";
import { MeSheet } from "@/features/room/components/MeSheet";
import { RoomHeader } from "@/features/room/components/RoomHeader";
import { ROOM_NAV_VARIANTS, RoomNav } from "@/features/room/components/RoomNav";
import { RoomSkeleton } from "@/features/room/components/RoomSkeleton";
import { Welcome } from "@/features/room/components/Welcome";
import { useAutoFinalize } from "@/features/room/hooks/useAutoFinalize";
import { useEnsureLoginCode } from "@/features/room/hooks/useEnsureLoginCode";
import { IDENTITY_STATES, useIdentity } from "@/features/room/hooks/useIdentity";
import { useRename } from "@/features/room/hooks/useRename";
import { useRoom } from "@/features/room/hooks/useRoom";
import { RoomContext } from "@/features/room/hooks/useRoomContext";
import { useRoomChannel } from "@/features/room/hooks/useRoomChannel";
import { useTypingLine } from "@/features/room/hooks/useTypingLine";
import { useSignInAs } from "@/features/room/hooks/useSignInAs";
import { useSwitchUser } from "@/features/room/hooks/useSwitchUser";
import { useWall } from "@/features/room/hooks/useWall";
import { useWallUnread } from "@/features/room/hooks/useWallUnread";
import { sameName } from "@/features/room/utils/names";
import { leadingSlot, tallyVotes } from "@/features/room/utils/tally";
import { useNow } from "@/shared/hooks/useNow";
import { roomShellClasses } from "./RoomShell.classes";

interface RoomShellProps {
  slug: string;
  /** The room as the layout read it on the server, so the first paint is the real room. */
  initial: RoomSnapshotDto;
  /** The section's page: the vote, the wall. */
  children: ReactNode;
}

/**
 * The room around its sections: the header, the side column on wide screens, the join gate until
 * you're in, the hello and the "you in the room" sheet — and the room's live channel, which stays
 * up as you move between sections.
 */
export function RoomShell({ slug, initial, children }: RoomShellProps) {
  const { data: snapshot } = useRoom(slug, initial);
  const identity = useIdentity(slug, snapshot);
  const { me, isHost } = identity;
  const rename = useRename(slug);
  const signInAs = useSignInAs();
  const switchUser = useSwitchUser();
  const loginCode = useEnsureLoginCode(me, isHost);
  const [isMeOpen, setIsMeOpen] = useState(false);
  const now = useNow();
  const room = snapshot?.room;
  const votes = snapshot?.votes;
  const leader = useMemo(() => (votes ? leadingSlot(tallyVotes(votes)) : null), [votes]);
  const { data: wall } = useWall(slug);
  const pathname = usePathname();
  const isOnWall = pathname === roomSectionPath(slug, ROOM_SECTIONS.wall);
  const isOnVote = pathname === roomSectionPath(slug, ROOM_SECTIONS.vote);
  const unread = useWallUnread(wall?.messages, me?.userId, isOnWall);
  useAutoFinalize(room, now);
  const live = useRoomChannel(slug, room?.id, me);
  const typing = useTypingLine(live.typers);
  if (!snapshot || !room) return <RoomSkeleton />;
  const nav = { snapshot, leader, lastMessage: wall?.messages.at(-1), unread, typing };

  async function signInAsPlayer(name: string, code: string) {
    const player = snapshot?.players.find((candidate) => sameName(candidate.name, name));
    if (!player) throw new ApiError(API_ERROR_CODES.not_found, 404);
    await signInAs.mutateAsync({ userId: player.userId, code });
  }

  return (
    <MotionConfig reducedMotion="user">
      <RoomContext value={{ slug, snapshot, me, isHost, leader, live, typing }}>
        {/* Under the join gate the room is shown but out of reach: no focus, no screen reader. */}
        <div className={roomShellClasses.root} inert={identity.state !== IDENTITY_STATES.ready}>
          <RoomHeader
            room={room}
            me={me}
            online={live.online.length}
            typing={typing}
            now={isOnVote ? undefined : now}
            onMe={isHost ? undefined : () => setIsMeOpen(true)}
          />
          <div className={roomShellClasses.body}>
            <aside className={roomShellClasses.side}>
              <Hero room={room} now={now} leader={leader} voterCount={snapshot.votes.length} />
              <RoomNav {...nav} variant={ROOM_NAV_VARIANTS.list} />
            </aside>
            <main className={roomShellClasses.main}>{children}</main>
          </div>
          <RoomNav {...nav} variant={ROOM_NAV_VARIANTS.bar} />
        </div>
      </RoomContext>

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
