"use client";

import { AnimatePresence, MotionConfig } from "motion/react";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { FEATURE_KEYS } from "@/core/config/features.const";
import { ROOM_SECTIONS, roomPath, roomSectionPath } from "@/core/constants/routes.const";
import type { RoomSnapshotDto } from "@/features/room/api/room.dto";
import { EmojiRain } from "@/features/room/components/EmojiRain";
import { PARTY_EMOJI } from "@/features/room/components/EmojiRain/EmojiRain.const";
import { ExitActions } from "@/features/room/components/ExitActions";
import { Hero } from "@/features/room/components/Hero";
import { JoinGate } from "@/features/room/components/JoinGate";
import { MeSheet } from "@/features/room/components/MeSheet";
import { RoomHeader } from "@/features/room/components/RoomHeader";
import { ROOM_NAV_VARIANTS, RoomNav } from "@/features/room/components/RoomNav";
import { StatusStories } from "@/features/room/components/StatusStories";
import { StoryRing } from "@/features/room/components/StoryRing";
import { StoryViewer } from "@/features/room/components/StoryViewer";
import type { StoryPosition } from "@/features/room/content/stories.const";
import { RoomSkeleton } from "@/features/room/components/RoomSkeleton";
import { Welcome } from "@/features/room/components/Welcome";
import { useAutoFinalize } from "@/features/room/hooks/useAutoFinalize";
import { useDoorAtTheHour } from "@/features/room/hooks/useDoorAtTheHour";
import { useEnsureLoginCode } from "@/features/room/hooks/useEnsureLoginCode";
import { useHostExit } from "@/features/room/hooks/useHostExit";
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
import { leadingSlot, tallyVotes } from "@/shared/utils/tally";
import { useNow } from "@/shared/hooks/useNow";
import { RoomFrameContext } from "@/shared/hooks/useRoomFrame";
import { initialOf } from "@/shared/utils/avatar";
import { roomShellClasses } from "./RoomShell.classes";

interface RoomShellProps {
  slug: string;
  /** The room as the layout read it on the server, so the first paint is the real room. */
  initial: RoomSnapshotDto;
  /** The section's page: the vote, the wall, the games. */
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
  const signInAs = useSignInAs(snapshot?.players);
  const switchUser = useSwitchUser();
  const loginCode = useEnsureLoginCode(me, isHost);
  const [isMeOpen, setIsMeOpen] = useState(false);
  const [story, setStory] = useState<StoryPosition | null>(null);
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
  const hostExit = useHostExit(room, identity.adminToken);
  const typing = useTypingLine(live.typers);
  useDoorAtTheHour(room, now, live.rain);
  if (!snapshot || !room) return <RoomSkeleton />;
  const lastMessage = wall?.messages.at(-1);
  const nav = { snapshot, leader, lastMessage, unread, typing, meId: me?.userId ?? null };

  return (
    <MotionConfig reducedMotion="user">
      <RoomContext
        value={{ slug, snapshot, me, isHost, leader, live, typing, openStory: setStory, hostExit }}
      >
        {/* Under the join gate the room is shown but out of reach: no focus, no screen reader. */}
        <div className={roomShellClasses.root} inert={identity.state !== IDENTITY_STATES.ready}>
          <RoomHeader
            room={room}
            me={me}
            live={{ online: live.online.length, typing }}
            avatar={<StoryRing onOpen={setStory}>{initialOf(room.groupName)}</StoryRing>}
            now={isOnVote ? undefined : now}
            onMe={isHost ? undefined : () => setIsMeOpen(true)}
            actions={{
              onParty: () => live.sendEmoji(PARTY_EMOJI),
              adminHref: identity.adminToken ? roomPath(FEATURE_KEYS.admin, slug) : undefined,
            }}
          />
          <div className={roomShellClasses.body}>
            <aside className={roomShellClasses.side}>
              <StatusStories onOpen={setStory} />
              <Hero
                room={room}
                now={now}
                leader={leader}
                voterCount={snapshot.votes.length}
                hostExit={hostExit}
                actions={<ExitActions />}
              />
              <RoomNav {...nav} variant={ROOM_NAV_VARIANTS.list} />
            </aside>
            <main className={roomShellClasses.main}>
              <RoomFrameContext value={{ room, meId: me?.userId ?? null, isHost }}>
                {children}
              </RoomFrameContext>
            </main>
          </div>
          <RoomNav {...nav} variant={ROOM_NAV_VARIANTS.bar} />
        </div>
      </RoomContext>

      <EmojiRain subscribe={live.onRain} />
      <AnimatePresence>
        {story && <StoryViewer key="stories" start={story} onClose={() => setStory(null)} />}
      </AnimatePresence>
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
            onSignInAs={signInAs}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
