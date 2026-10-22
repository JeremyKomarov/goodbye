import { pad } from "@/shared/utils/countdown";

/** The hours a day can start at (00–23) and end at (01–24, exclusive), as `<option>`s. */
export const START_HOURS = Array.from({ length: 24 }, (_, hour) => hour);
export const END_HOURS = Array.from({ length: 24 }, (_, hour) => hour + 1);

export function hourLabel(hour: number): string {
  return `${pad(hour)}:00`;
}
