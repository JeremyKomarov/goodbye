import { champions, GAME_META } from "@/lib/games";
import { formatHour, formatSlot, g, iso } from "@/lib/hebrew";
import { mostLoved, type ReactionMap } from "@/lib/reactions";
import type { LeaderboardRow, Room, WallMessage } from "@/lib/types";

/** Opens WhatsApp with the text ready to send. WhatsApp can't pick the chat, so you do. */
export function whatsappLink(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export type ExitStats = {
  voterCount: number;
  messageCount: number;
  loved: { name: string; body: string; count: number } | null;
  champions: { title: string; name: string }[];
};

export function exitStats({
  voterCount,
  messages,
  reactions,
  leaderboard,
}: {
  voterCount: number;
  messages: WallMessage[];
  reactions: ReactionMap;
  leaderboard: LeaderboardRow[];
}): ExitStats {
  const loved = mostLoved(messages, reactions);
  return {
    voterCount,
    messageCount: messages.length,
    loved: loved
      ? {
          name: loved.message.display_name,
          body: loved.message.body,
          count: loved.count,
        }
      : null,
    champions: champions(leaderboard).map(({ game, top }) => ({
      title: GAME_META[game].title,
      name: top.display_name,
    })),
  };
}

function votersLine(count: number) {
  return count === 1 ? "אדם אחד הצביע" : `${count} הצביעו`;
}

function messagesLine(count: number) {
  return count === 1 ? "הודעת פרידה אחת" : `${count} הודעות פרידה`;
}

/** Right after voting locks: the decision, in the same voice as the invite. */
export function resultMessage(
  room: Room,
  url: string,
  voterCount: number,
  drawn: boolean,
) {
  const he = room.host_gender;
  const when = room.locked_slot
    ? formatSlot(Date.parse(room.locked_slot), room.timezone)
    : "";
  return [
    `🗳️ הקבוצה החליטה: ${iso(room.host_name)} ${g(he, "יוצא", "יוצאת")} מהקבוצה ${when}${drawn ? " (היה תיקו, וההגרלה בחרה 🎲)" : ""}`,
    `${votersLine(voterCount)}. ספירה לאחור, משחקים וקיר פרידה כאן: ${url}`,
  ].join("\n");
}

/** The host's last message, sent just before leaving. */
export function goodbyeMessage(room: Room, url: string, stats: ExitStats) {
  const he = room.host_gender;
  const at = room.locked_slot
    ? ` בשעה שבחרתם, ${formatHour(Date.parse(room.locked_slot), room.timezone)}`
    : "";
  const lines = [
    `👋 זהו, הגיע הזמן. ${g(he, "אני יוצא", "אני יוצאת")} מהקבוצה${at}.`,
    "",
    `🗳️ ${votersLine(stats.voterCount)} · 💬 ${messagesLine(stats.messageCount)}`,
  ];
  if (stats.loved)
    lines.push(
      `❤️ ההודעה הכי אהובה: "${iso(stats.loved.body)}" (${iso(stats.loved.name)})`,
    );
  for (const c of stats.champions) lines.push(`👑 ${c.title}: ${iso(c.name)}`);
  lines.push("", `תודה על הכל! הקיר נשאר פתוח: ${url}`);
  return lines.join("\n");
}

/** From the host to a player who needs their code on another device. */
export function codeMessage(name: string, code: string, url: string) {
  return [
    `היי ${iso(name)} 👋 הקוד שלך לחדר: ${code}`,
    `נכנסים כאן, כותבים ${iso(name)} ואז את הקוד: ${url}`,
  ].join("\n");
}

/** The host's admin link, sent to themselves (to manage the room from another device). */
export function adminLinkMessage(groupName: string, adminUrl: string) {
  return `קישור הניהול שלי לחדר של ${iso(groupName)} (לא לשלוח לקבוצה): ${adminUrl}`;
}
