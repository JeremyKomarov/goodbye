import { GAME_META, rankRows } from "@/core/games";
import { formatHour, formatSlot, iso, onlineLabel } from "@/core/hebrew";
import { leftLine } from "@/core/room-view";
import { leadingSlot } from "@/core/slots";
import type { GameId, LeaderboardRow, Room, WallMessage } from "@/core/types";
import type { SectionSummary, Tab } from "@/features/room/components/RoomNavigation/RoomNavigation";
import type { Me } from "@/core/hooks/useRoom";

type Args = {
  room: Room;
  drawn: boolean;
  leader: ReturnType<typeof leadingSlot>;
  voterCount: number;
  leaderboard: LeaderboardRow[];
  me: Me | null;
  lastMessage: WallMessage | undefined;
  typingText: string | null;
  onlineCount: number;
  gamesClosed: boolean;
};

export function buildRoomSummaries({ room, drawn, leader, voterCount, leaderboard, me, lastMessage, typingText, onlineCount, gamesClosed }: Args) {
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
  const players = new Set(leaderboard.map((r) => r.user_id)).size;
  const recordHolders = [
    ...new Set(
      (Object.keys(GAME_META) as GameId[]).flatMap((g) => {
        const top = rankRows(leaderboard, g)[0];
        return top
          ? [top.user_id === me?.userId ? "את/ה" : iso(top.display_name)]
          : [];
      }),
    ),
  ];

  const summaries: Record<Tab, SectionSummary> = {
    vote: {
      subtitle: voteStatus,
      meta: voterCount ? `${voterCount} הצביעו` : undefined,
    },
    games: {
      subtitle: gamesClosed
        ? `🏁 המשחקים נסגרו${recordHolders.length ? ` · 👑 ${recordHolders.join(", ")}` : ""}`
        : recordHolders.length
          ? `👑 בשיאים: ${recordHolders.join(", ")}`
          : "כפתור בורח, טריוויה, 99+ הודעות ומה בתמונה?",
    },
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
    games: {
      text: gamesClosed
        ? "המשחקים נסגרו, והשיאים סופיים"
        : "השיאים נכנסים לטבלה של החדר",
    },
    wall: typingText
      ? { text: typingText, highlight: true }
      : { text: onlineLabel(onlineCount) },
    board: {
      text: gamesClosed ? "השיאים הסופיים של החדר" : "השיאים של כולם בחדר",
    },
  };

  return { summaries, paneSubtitle };
}
