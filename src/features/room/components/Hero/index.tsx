"use client";

import { ROOM_STATUSES } from "@/core/constants/room.const";
import type { HeroProps } from "./Hero.types";
import { ExitedHero } from "./partials/ExitedHero";
import { LockedHero } from "./partials/LockedHero";
import { VotingHero } from "./partials/VotingHero";

/**
 * The room's status card. While voting — and the moment after the close, before the database
 * locks the winner — the vote's countdown; once locked, the countdown to the chosen hour; once
 * the host has left, how it went.
 */
export function Hero(props: HeroProps) {
  const { room, actions } = props;
  if (room.status === ROOM_STATUSES.exited) return <ExitedHero room={room} actions={actions} />;
  if (room.status === ROOM_STATUSES.locked && room.lockedSlot !== null)
    return <LockedHero {...props} lockedSlot={room.lockedSlot} />;
  return <VotingHero {...props} />;
}
