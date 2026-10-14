import { g, iso } from "@/lib/hebrew";
import type { Room } from "@/lib/types";

/** Within this many minutes of the voted hour counts as "on time". */
const ON_TIME_MINUTES = 10;

export type Verdict = { kind: "on_time" | "late" | "early"; diffMs: number };

export function verdict(room: Room): Verdict | null {
  if (!room.exited_at || !room.locked_slot) return null;
  const diffMs = Date.parse(room.exited_at) - Date.parse(room.locked_slot);
  if (Math.abs(diffMs) <= ON_TIME_MINUTES * 60_000) return { kind: "on_time", diffMs };
  return { kind: diffMs > 0 ? "late" : "early", diffMs };
}

export function leftLine(room: Room) {
  return `${iso(room.host_name)} ${g(room.host_gender, "יצא", "יצאה")} מהקבוצה`;
}
