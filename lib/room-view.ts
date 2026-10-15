import { formatDurationRough, g, iso } from "@/lib/hebrew";
import type { Room } from "@/lib/types";

/** Within this many minutes of the voted hour counts as "on time". */
const ON_TIME_MINUTES = 10;

export type Verdict = { kind: "on_time" | "late" | "early"; diffMs: number };

export function verdict(room: Room): Verdict | null {
  if (!room.exited_at || !room.locked_slot) return null;
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
  if (v.kind === "on_time") return "בדיוק בזמן";
  if (v.kind === "late")
    return `${g(he, "איחר", "איחרה")} ב-${formatDurationRough(v.diffMs)}`;
  return `${g(he, "ברח", "ברחה")} ${formatDurationRough(v.diffMs)} מוקדם`;
}

export function leftLine(room: Room) {
  return `${iso(room.host_name)} ${g(room.host_gender, "יצא", "יצאה")} מהקבוצה`;
}
