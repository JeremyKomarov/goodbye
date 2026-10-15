"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ExitActions } from "@/features/room/components/ExitActions/ExitActions";
import { loadAdminToken } from "@/core/admin-storage";
import { loadFinaleSeen, saveFinaleSeen } from "@/core/finale-storage";
import { buildRoomSummaries } from "@/features/room/content/roomSummaries";
import { formatDurationRough, iso } from "@/core/hebrew";
import { useNow } from "@/core/hooks/useNow";
import { useRoom } from "@/core/hooks/useRoom";
import { ON_TIME_MINUTES } from "@/core/room-view";
import { exitStats } from "@/core/share";
import { leadingSlot, slotMs, tallyVotes, wonByDraw } from "@/core/slots";
import type { GameId, Room } from "@/core/types";
import type { Tab } from "@/features/room/components/RoomNavigation/RoomNavigation";

const noop = () => () => {};

export function useRoomScreen(initialRoom: Room) {
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
  // The exit (its time) whose finale was closed here, and whether it's being replayed.
  const [finaleClosedFor, setFinaleClosedFor] = useState<string | null>(null);
  const [replayFinale, setReplayFinale] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [meOpen, setMeOpen] = useState(false);
  const [lastSeenMessageId, setLastSeenMessageId] = useState<number | null>(
    null,
  );

  const voteList = useMemo(() => Object.values(votes), [votes]);
  const tally = useMemo(() => tallyVotes(voteList), [voteList]);
  const leader = useMemo(() => leadingSlot(tally), [tally]);
  const drawn = wonByDraw(leader, room.locked_slot);
  const myVote = me ? votes[me.userId] : undefined;
  const mySlot = myVote ? slotMs(myVote.slot_start) : null;

  // The host plays and posts, but doesn't vote. This browser is the host's if it holds
  // the admin token, or if the database already knows its user as the host.
  const adminToken = mounted ? loadAdminToken(room.slug) : null;
  const adminHref = adminToken ? `/r/${room.slug}/admin#k=${adminToken}` : null;
  const isHost = !!adminToken || (!!me && api.hosts.includes(me.userId));
  const roomUrl = mounted ? `${window.location.origin}/r/${room.slug}` : "";
  const stats = useMemo(
    () =>
      exitStats({
        voterCount: voteList.length,
        messages,
        reactions: api.reactions,
        leaderboard: api.leaderboard,
      }),
    [voteList.length, messages, api.reactions, api.leaderboard],
  );

  // Once voting time is up, ask the database to lock the winner (retry if our clock runs ahead).
  const votingOver =
    room.status === "voting" &&
    now > 0 &&
    now >= Date.parse(room.voting_closes_at);
  const { finalize } = api;
  // The voted hour arrives: a moment on every screen that's open (each has the clock).
  const lockedAt =
    room.status === "locked" && room.locked_slot
      ? Date.parse(room.locked_slot)
      : null;
  const timeUp = lockedAt !== null && now > 0 && now >= lockedAt;
  const ticking = now > 0;
  const wasTimeUp = useRef<boolean | null>(null);
  const { rain } = api;
  useEffect(() => {
    if (!ticking) return;
    const before = wasTimeUp.current;
    wasTimeUp.current = timeUp;
    if (before === false && timeUp) {
      rain("🚪");
      navigator.vibrate?.([60, 80, 60]);
    }
  }, [ticking, timeUp, rain]);

  // After the exit the games close (the database turns new scores away too); the wall stays open.
  const gamesClosed = room.status === "exited";

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

  const { summaries, paneSubtitle } = buildRoomSummaries({ room, drawn, leader, voterCount: voteList.length, leaderboard: api.leaderboard, me, lastMessage, typingText, onlineCount: api.online.length, gamesClosed });

  // The finale plays by itself once per exit on each browser; after that, the hero replays it.
  const exitedAt = room.status === "exited" ? room.exited_at : null;
  const finaleSeen =
    !!exitedAt &&
    (finaleClosedFor === exitedAt ||
      (mounted && loadFinaleSeen(room.slug) === exitedAt));
  const showFinale =
    !!exitedAt &&
    api.authState === "ready" &&
    (replayFinale || !finaleSeen);
  function closeFinale() {
    setReplayFinale(false);
    setFinaleClosedFor(exitedAt);
    if (exitedAt) saveFinaleSeen(room.slug, exitedAt);
  }

  /** The host's own "I left": early is allowed, but they're told how it'll look. */
  async function exitGroup() {
    const left = lockedAt === null ? 0 : lockedAt - Date.now();
    const ask =
      left > ON_TIME_MINUTES * 60_000
        ? `עוד ${formatDurationRough(left)} לשעה שהקבוצה בחרה. לסמן שיצאת כבר עכשיו? כולם בחדר יראו שברחת מוקדם 😅`
        : "שלחת הודעת פרידה ויצאת מהקבוצה בוואטסאפ? אחרי הלחיצה כולם בחדר יראו שיצאת.";
    if (!window.confirm(ask)) return;
    setExiting(true);
    const err = await api.markExit();
    setExiting(false);
    if (err) window.alert(err);
  }

  const myUserId = me?.userId ?? null;
  const party = () => api.sendEmoji("🎉");
  const heroProps = {
    room,
    now,
    leader,
    voterCount: voteList.length,
    onReplayFinale: () => setReplayFinale(true),
    onExit: isHost && room.status === "locked" ? exitGroup : undefined,
    exiting,
    actions:
      roomUrl &&
      (room.status === "locked" || (room.status === "exited" && isHost)) ? (
        <ExitActions
          room={room}
          url={roomUrl}
          isHost={isHost}
          stats={stats}
          drawn={drawn}
          calendar={room.status === "locked" && !timeUp}
        />
      ) : null,
  };
  const openMe = isHost ? undefined : () => setMeOpen(true);

  return { api, room, me, messages, now, tab, game, setGame, meOpen, setMeOpen,
    voteList, tally, leader, drawn, mySlot, adminHref, isHost, typers, unread,
    changeTab, summaries, paneSubtitle, showFinale, closeFinale, heroProps,
    openMe, myUserId, party, gamesClosed };
}
