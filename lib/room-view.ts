import { formatDurationRough, g, iso } from "@/lib/hebrew";
import type { Room } from "@/lib/types";

/** Within this many minutes of the voted hour counts as "on time". */
export const ON_TIME_MINUTES = 10;

export type Verdict =
  | { kind: "on_time" | "late" | "early"; diffMs: number }
  // Left while the group was still voting, so there was no hour to be early or late for.
  | { kind: "mid_vote" };

export function verdict(room: Room): Verdict | null {
  if (!room.exited_at) return null;
  if (!room.locked_slot) return { kind: "mid_vote" };
  const diffMs = Date.parse(room.exited_at) - Date.parse(room.locked_slot);
  if (Math.abs(diffMs) <= ON_TIME_MINUTES * 60_000)
    return { kind: "on_time", diffMs };
  return { kind: diffMs > 0 ? "late" : "early", diffMs };
}

/** "בדיוק בזמן", "איחר ב-7 דקות", "ברחה 2 שעות מוקדם"; null before the exit. */
export function verdictText(room: Room) {
  const v = verdict(room);
  if (!v) return null;
  const he = room.host_gender;
  if (v.kind === "mid_vote") return `${g(he, "ברח", "ברחה")} באמצע ההצבעה`;
  if (v.kind === "on_time") return "בדיוק בזמן";
  if (v.kind === "late")
    return `${g(he, "איחר", "איחרה")} ב-${formatDurationRough(v.diffMs)}`;
  return `${g(he, "ברח", "ברחה")} ${formatDurationRough(v.diffMs)} מוקדם`;
}

export function leftLine(room: Room) {
  return `${iso(room.host_name)} ${g(room.host_gender, "יצא", "יצאה")} מהקבוצה`;
}
