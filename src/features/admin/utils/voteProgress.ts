import type { AdminPlayer } from "@/features/admin/types/admin.types";

/** How the vote stands among the guests — the host never votes: how many are in, and who isn't. */
export function voteProgress(players: AdminPlayer[]) {
  const guests = players.filter((player) => !player.isHost);
  const waiting = guests.filter((player) => !player.hasVoted);
  return { total: guests.length, voted: guests.length - waiting.length, waiting };
}
