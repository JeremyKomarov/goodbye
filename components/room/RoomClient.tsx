"use client";

import { AnimatePresence, MotionConfig } from "motion/react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { GamesHub } from "@/components/games/GamesHub";
import {
  PaneHeader,
  RoomHeader,
  type SectionSummary,
  SideNav,
  type Tab,
  TabBar,
} from "@/components/room/Chrome";
import { EmojiRain } from "@/components/room/EmojiRain";
import { FarewellWall } from "@/components/room/FarewellWall";
import { Finale } from "@/components/room/Finale";
import { Hero } from "@/components/room/Hero";
import { JoinGate } from "@/components/room/JoinGate";
import { GAME_META, Leaderboard, rankRows } from "@/components/room/Leaderboard";
import { StatusStories } from "@/components/room/StatusStories";
import { VoteHeatmap } from "@/components/room/VoteHeatmap";
import { loadAdminToken } from "@/lib/admin-storage";
import { formatHour, formatSlot, iso, onlineLabel } from "@/lib/hebrew";
import { useNow } from "@/lib/hooks/useNow";
import { useRoom } from "@/lib/hooks/useRoom";
import { leftLine } from "@/lib/room-view";
import { leadingSlot, slotMs, tallyVotes, wonByDraw } from "@/lib/slots";
import type { GameId, Room } from "@/lib/types";

const noop = () => () => {};

/** Scrollable content area for a tab; keyed by tab so each starts at the top. */
function Scroll({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-h-0 flex-1 overflow-y-auto overscroll-contain ${className}`}
    >
      {children}
    </div>
  );
}

export function RoomClient({ initialRoom }: { initialRoom: Room }) {
  const api = useRoom(initialRoom);
  const { room, me, votes, messages } = api;
  const now = useNow();
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

  const [tab, setTab] = useState<Tab>("vote");
  const [game, setGame] = useState<GameId | null>(null);
  const [finaleDismissed, setFinaleDismissed] = useState(false);
  const [lastSeenMessageId, setLastSeenMessageId] = useState<number | null>(
    null,
  );

  const voteList = useMemo(() => Object.values(votes), [votes]);
  const tally = useMemo(() => tallyVotes(voteList), [voteList]);
  const leader = useMemo(() => leadingSlot(tally), [tally]);
  const drawn = wonByDraw(leader, room.locked_slot);
  const myVote = me ? votes[me.userId] : undefined;
  const mySlot = myVote ? slotMs(myVote.slot_start) : null;

  const adminToken = mounted ? loadAdminToken(room.slug) : null;
  const adminHref = adminToken ? `/r/${room.slug}/admin#k=${adminToken}` : null;

  // Once voting time is up, ask the database to lock the winner (retry if our clock runs ahead).
  const votingOver =
    room.status === "voting" &&
    now > 0 &&
    now >= Date.parse(room.voting_closes_at);
  const { finalize } = api;
  useEffect(() => {
    if (!votingOver) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const attempt = async () => {
      const result = await finalize();
      if (!cancelled && result?.status === "voting")
        timer = setTimeout(attempt, 4000);
    };
    attempt();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [votingOver, finalize]);

  const typers = Object.values(api.typers).filter(
    (t) => t.until > now && t.userId !== me?.userId,
  );
  const typingText =
    typers.length === 1
      ? `${iso(typers[0].name)} מקליד/ה…`
      : typers.length > 1
        ? `${typers.length} אנשים מקלידים…`
        : null;

  const lastMessage = messages.at(-1);
  const newestMessageId = lastMessage?.id ?? 0;
  const seenUpTo = lastSeenMessageId ?? api.baselineMessageId ?? Infinity;
  const unread =
    tab === "wall"
      ? 0
      : messages.filter((m) => m.id > seenUpTo && m.user_id !== me?.userId)
          .length;

  function changeTab(next: Tab) {
    if (tab === "wall" || next === "wall")
      setLastSeenMessageId(newestMessageId);
    if (next !== "games") setGame(null);
    setTab(next);
  }

  const tz = room.timezone;
  const voteStatus =
    room.status === "exited"
      ? leftLine(room)
      : room.status === "locked" && room.locked_slot
        ? `${drawn ? "נבחרה בהגרלה" : "נבחרה"}: ${formatSlot(Date.parse(room.locked_slot), tz)}`
        : leader && leader.tied.length > 1
          ? `⚖️ תיקו בין ${leader.tied.length} שעות`
          : leader
          ? `מובילה: ${formatSlot(leader.ms, tz)}`
          : "עוד אף אחד לא הצביע";
  const players = new Set(api.leaderboard.map((r) => r.user_id)).size;
  const recordHolders = [
    ...new Set(
      (Object.keys(GAME_META) as GameId[]).flatMap((g) => {
        const top = rankRows(api.leaderboard, g)[0];
        return top ? [top.user_id === me?.userId ? "את/ה" : iso(top.display_name)] : [];
      }),
    ),
  ];

  const summaries: Record<Tab, SectionSummary> = {
    vote: {
      subtitle: voteStatus,
      meta: voteList.length ? `${voteList.length} הצביעו` : undefined,
    },
    games: { subtitle: recordHolders.length ? `👑 בשיאים: ${recordHolders.join(", ")}` : "כפתור בורח, טריוויה, 99+ הודעות ומה בתמונה?" },
    wall: typingText
      ? { subtitle: typingText, highlight: true }
      : lastMessage
        ? {
            subtitle: `${iso(lastMessage.display_name)}: ${iso(lastMessage.body)}`,
            meta: formatHour(Date.parse(lastMessage.created_at), tz),
          }
        : { subtitle: "עוד אין הודעות פרידה" },
    board: {
      subtitle: players
        ? `${players} ${players === 1 ? "שחקן" : "שחקנים"} בטבלה`
        : "עוד אף אחד לא שיחק",
    },
  };
  const paneSubtitle: Record<Tab, { text: string; highlight?: boolean }> = {
    vote: {
      text:
        room.status === "voting"
          ? `ההצבעה נסגרת ${formatSlot(Date.parse(room.voting_closes_at), tz)}`
          : voteStatus,
    },
    games: { text: "השיאים נכנסים לטבלה של החדר" },
    wall: typingText
      ? { text: typingText, highlight: true }
      : { text: onlineLabel(api.online.length) },
    board: { text: "השיאים של כולם בחדר" },
  };

  const showFinale =
    room.status === "exited" && !finaleDismissed && api.authState === "ready";
  const myUserId = me?.userId ?? null;
  const party = () => api.sendEmoji("🎉");
  const heroProps = {
    room,
    now,
    leader,
    voterCount: voteList.length,
    onReplayFinale: () => setFinaleDismissed(false),
  };

  return (
    <MotionConfig reducedMotion="user">
      {/* App shell: exactly one viewport tall; only the content area scrolls.
          Short desktop windows drop the outer frame to keep every pixel. */}
      <div className="h-dvh overflow-hidden lg:p-5 lg:short:p-0">
        <div className="mx-auto flex h-full max-w-xl flex-col bg-night/40 lg:max-w-[1440px] lg:flex-row lg:overflow-hidden lg:rounded-2xl lg:border lg:border-line/60 lg:shadow-2xl lg:short:rounded-none lg:short:border-0">
          {/* Desktop sidebar */}
          <aside className="hidden w-[25rem] shrink-0 flex-col border-e border-line/60 bg-panel lg:flex">
            <RoomHeader
              room={room}
              now={now}
              online={api.online}
              typers={typers}
              showClock={false}
              adminHref={adminHref}
              onParty={party}
            />
            <Scroll className="flex flex-col">
              <StatusStories />
              <div className="my-auto">
                <Hero {...heroProps} />
              </div>
            </Scroll>
            {/* The sections stay pinned, so they never scroll out of reach. */}
            <SideNav
              tab={tab}
              onChange={changeTab}
              unread={unread}
              summaries={summaries}
              className="shrink-0 border-t border-line/60"
            />
          </aside>

          {/* Main column (the whole app on phones) */}
          <section className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="lg:hidden">
              <RoomHeader
                room={room}
                now={now}
                online={api.online}
                typers={typers}
                showClock={tab !== "vote"}
                adminHref={adminHref}
                onParty={party}
              />
            </div>
            <PaneHeader
              tab={tab}
              subtitle={paneSubtitle[tab].text}
              highlight={paneSubtitle[tab].highlight}
            />

            <main className="flex min-h-0 flex-1 flex-col">
              {/* Countdown on top and the grid filling the rest; side by side on landscape phones. */}
              {tab === "vote" && (
                <div className="flex min-h-0 flex-1 flex-col gap-2 px-3 pb-3 tiny:flex-row tiny:items-center tiny:gap-4 tiny:pt-2 lg:px-6 lg:py-6 lg:short:py-4">
                  <div className="shrink-0 tiny:max-h-full tiny:w-2/5 tiny:overflow-y-auto lg:hidden">
                    <Hero {...heroProps} compact />
                  </div>
                  <VoteHeatmap
                    room={room}
                    now={now}
                    tally={tally}
                    players={api.players}
                    myUserId={myUserId}
                    mySlot={mySlot}
                    onVote={api.vote}
                    className="mx-auto w-full max-w-3xl tiny:max-h-full tiny:flex-1"
                  />
                </div>
              )}
              {tab === "games" && (
                <GamesHub
                  game={game}
                  onGameChange={setGame}
                  leaderboard={api.leaderboard}
                  myUserId={myUserId}
                  onScore={api.submitScore}
                />
              )}
              {tab === "wall" && (
                <FarewellWall
                  room={room}
                  messages={messages}
                  myUserId={myUserId}
                  typers={typers}
                  onSend={api.postMessage}
                  onTyping={api.setTyping}
                  onEmoji={api.sendEmoji}
                />
              )}
              {tab === "board" && (
                <Scroll key="board" className="px-3 pb-4 lg:px-6 lg:py-6">
                  <Leaderboard
                    room={room}
                    tally={tally}
                    leaderboard={api.leaderboard}
                    myUserId={myUserId}
                    onPlay={(g) => {
                      changeTab("games");
                      setGame(g);
                    }}
                  />
                </Scroll>
              )}
            </main>

            <TabBar tab={tab} onChange={changeTab} unread={unread} />
          </section>
        </div>
      </div>

      <EmojiRain subscribe={api.onRain} />

      <AnimatePresence>
        {showFinale && (
          <Finale
            room={room}
            drawn={drawn}
            voterCount={voteList.length}
            messageCount={messages.length}
            leaderboard={api.leaderboard}
            onClose={() => setFinaleDismissed(true)}
          />
        )}
      </AnimatePresence>

      {api.authState === "join" && (
        <JoinGate room={room} voterCount={voteList.length} onJoin={api.join} />
      )}
    </MotionConfig>
  );
}
