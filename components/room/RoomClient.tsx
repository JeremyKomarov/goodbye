"use client";

import { AnimatePresence, MotionConfig } from "motion/react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { GamesHub } from "@/components/games/GamesHub";
import { RoomHeader, TabBar, type Tab } from "@/components/room/Chrome";
import { EmojiRain } from "@/components/room/EmojiRain";
import { FarewellWall } from "@/components/room/FarewellWall";
import { Finale } from "@/components/room/Finale";
import { Hero } from "@/components/room/Hero";
import { JoinGate } from "@/components/room/JoinGate";
import { Leaderboard } from "@/components/room/Leaderboard";
import { StatusStories } from "@/components/room/StatusStories";
import { VoteHeatmap } from "@/components/room/VoteHeatmap";
import { loadAdminToken } from "@/lib/admin-storage";
import { useNow } from "@/lib/hooks/useNow";
import { useRoom } from "@/lib/hooks/useRoom";
import { leadingSlot, slotMs, tallyVotes } from "@/lib/slots";
import type { GameId, Room } from "@/lib/types";

const noop = () => () => {};

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

  const typers = Object.values(api.typers).filter((t) => t.until > now && t.userId !== me?.userId);

  const newestMessageId = messages.at(-1)?.id ?? 0;
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
    window.scrollTo({ top: 0 });
  }

  const showFinale =
    room.status === "exited" && !finaleDismissed && api.authState === "ready";

  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto min-h-dvh max-w-md">
        <RoomHeader
          room={room}
          now={now}
          online={api.online}
          typers={typers}
          showClock={tab !== "vote"}
          adminHref={adminHref}
          onParty={() => api.sendEmoji("🎉")}
        />

        <main className="px-3 pb-28">
          {tab === "vote" && (
            <>
              <StatusStories />
              <Hero
                room={room}
                now={now}
                leader={leader}
                voterCount={voteList.length}
                onReplayFinale={() => setFinaleDismissed(false)}
              />
              <VoteHeatmap
                room={room}
                now={now}
                tally={tally}
                players={api.players}
                myUserId={me?.userId ?? null}
                mySlot={mySlot}
                onVote={api.vote}
              />
            </>
          )}
          {tab === "games" && (
            <GamesHub
              game={game}
              onGameChange={setGame}
              leaderboard={api.leaderboard}
              myUserId={me?.userId ?? null}
              onScore={api.submitScore}
            />
          )}
          {tab === "wall" && (
            <FarewellWall
              room={room}
              messages={messages}
              myUserId={me?.userId ?? null}
              typers={typers}
              onSend={api.postMessage}
              onTyping={api.setTyping}
              onEmoji={api.sendEmoji}
            />
          )}
          {tab === "board" && (
            <Leaderboard
              room={room}
              tally={tally}
              leaderboard={api.leaderboard}
              myUserId={me?.userId ?? null}
              onPlay={(g) => {
                changeTab("games");
                setGame(g);
              }}
            />
          )}
        </main>
      </div>

      <TabBar tab={tab} onChange={changeTab} unread={unread} />
      <EmojiRain subscribe={api.onRain} />

      <AnimatePresence>
        {showFinale && (
          <Finale
            room={room}
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
