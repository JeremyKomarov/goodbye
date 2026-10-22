"use client";

import { useNow } from "@/shared/hooks/useNow";
import { pad, splitCountdown } from "@/shared/utils/countdown";
import { closingCountdownClasses } from "./ClosingCountdown.classes";

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

/** Counts down to the next three-hour mark. Decorative: no room is behind it. */
export function ClosingCountdown() {
  const now = useNow();
  const { hours, minutes, seconds } = splitCountdown(
    Math.ceil(now / THREE_HOURS_MS) * THREE_HOURS_MS - now,
  );

  return (
    <span dir="ltr" className={closingCountdownClasses.root}>
      {now ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : "--:--:--"}
    </span>
  );
}
