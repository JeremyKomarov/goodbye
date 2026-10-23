"use client";

import { useTranslations } from "next-intl";
import { useId, useMemo, useState } from "react";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { VoteLegend } from "@/features/room/components/VoteLegend";
import { useSlotFormat } from "@/shared/hooks/useSlotFormat";
import { ROOM_NAMESPACE, roomKeys } from "@/features/room/strings/room.keys.const";
import type { Player, RoomSnapshot } from "@/features/room/types/room.types";
import { tallyVotes } from "@/shared/utils/tally";
import { isolate } from "@/shared/utils/isolate";
import { buildSlotDays } from "@/shared/utils/slots";
import { DayStrip } from "./partials/DayStrip";
import { HourGrid } from "./partials/HourGrid";
import { VoteDetail } from "./partials/VoteDetail";
import { voteHeatmapClasses } from "./VoteHeatmap.classes";
import { VOTE_HEATMAP_NAMESPACE, voteHeatmapKeys } from "./VoteHeatmap.keys.const";
import type { SlotMarks, VoteErrorCode, VotingState } from "./VoteHeatmap.types";

interface VoteHeatmapProps {
  snapshot: RoomSnapshot;
  now: number;
  me: Player | null;
  /** False for the host: the group picks when they leave, so they only watch. */
  canVote: boolean;
  /** Vote for an hour, or `null` to take the vote back. Rejects with an `ApiError`. */
  onVote: (slotMs: number | null) => Promise<unknown>;
}

/** Pick a day, then an hour. Hours are tinted by their votes, so the popular ones stand out. */
export function VoteHeatmap({ snapshot, now, me, canVote, onVote }: VoteHeatmapProps) {
  const t = useTranslations(VOTE_HEATMAP_NAMESPACE);
  const tRoom = useTranslations(ROOM_NAMESPACE);
  const { room, votes, players } = snapshot;
  const format = useSlotFormat(room.timezone);
  const days = useMemo(() => buildSlotDays(room), [room]);
  const tally = useMemo(() => tallyVotes(votes), [votes]);
  const [pickedDay, setPickedDay] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [error, setError] = useState<VoteErrorCode | null>(null);
  const titleId = useId();

  const closesAt = room.votingClosesAt;
  const isOpen = room.status === ROOM_STATUSES.voting && (now === 0 || now < closesAt);
  const voting: VotingState = { closesAt, isOpen, canCast: isOpen && canVote && !!me };
  const mine = votes.find((vote) => vote.userId === me?.userId)?.slotMs ?? null;
  const marks: SlotMarks = { mine, winner: room.lockedSlot, anchor: mine ?? room.lockedSlot };

  // Until a day is picked: the one with the anchor, else the first that can still be voted on.
  const anchorDay = days.findIndex((day) =>
    day.slots.some((s) => s && (marks.anchor !== null ? s.ms === marks.anchor : s.ms >= closesAt)),
  );
  const dayIndex = Math.min(pickedDay ?? Math.max(0, anchorDay), days.length - 1);
  const day = days[dayIndex];

  async function cast(ms: number) {
    setError(null);
    navigator.vibrate?.(10);
    try {
      await onVote(mine === ms ? null : ms);
    } catch (failure) {
      const code = failure instanceof ApiError ? failure.code : null;
      const known = code === API_ERROR_CODES.voting_closed || code === API_ERROR_CODES.forbidden;
      setError(known ? code : "failed");
    }
  }

  const names = new Map(players.map((player) => [player.userId, player.name]));
  const detailMs = focused ?? mine ?? room.lockedSlot;
  const showingMine = detailMs !== null && detailMs === mine && focused === null;
  const voters = detailMs === null ? [] : (tally.get(detailMs) ?? []);
  const voterName = (userId: string) =>
    userId === me?.userId
      ? t(voteHeatmapKeys.you)
      : isolate(names.get(userId) ?? t(voteHeatmapKeys.someone));
  const detail = detailMs === null ? null : {
    slot: showingMine
      ? t(voteHeatmapKeys.yourVote, { slot: format.slot(detailMs) })
      : format.slot(detailMs),
    votes: tRoom(roomKeys.votes, { count: voters.length }),
    names: voters.map((vote) => voterName(vote.userId)).join(", "),
  };
  const gender = room.hostGender;
  const idle =
    room.status === ROOM_STATUSES.exited
      ? t(voteHeatmapKeys.idle.leftMidVote, { name: isolate(room.hostName), gender })
      : !isOpen
        ? t(voteHeatmapKeys.idle.counting)
        : canVote
          ? t(voteHeatmapKeys.idle.howTo, { closes: format.slot(closesAt) })
          : t(voteHeatmapKeys.idle.hostWatches, { gender, closes: format.slot(closesAt) });
  const hint =
    days.length === 1
      ? format.day(day.ms)
      : !isOpen
        ? t(voteHeatmapKeys.hint.closed)
        : t(canVote ? voteHeatmapKeys.hint.pick : voteHeatmapKeys.hint.groupDecides);

  return (
    <section className={voteHeatmapClasses.root} aria-labelledby={titleId}>
      <div className={voteHeatmapClasses.head}>
        <h2 id={titleId} className={voteHeatmapClasses.title}>
          {t(voteHeatmapKeys.title, { isOpen: String(isOpen) })}
        </h2>
        <span className={voteHeatmapClasses.hint}>{hint}</span>
      </div>
      {days.length > 1 && (
        <DayStrip
          days={days}
          dayIndex={dayIndex}
          onPick={setPickedDay}
          tally={tally}
          marks={marks}
          format={format}
        />
      )}
      <HourGrid
        day={day}
        tally={tally}
        marks={marks}
        voting={voting}
        onCast={cast}
        onFocus={setFocused}
        format={format}
      />
      <VoteLegend />
      <VoteDetail
        error={error && t(voteHeatmapKeys.errors[error])}
        detail={detail}
        idle={idle}
        onWithdraw={isOpen && showingMine && mine !== null ? () => cast(mine) : undefined}
      />
    </section>
  );
}
