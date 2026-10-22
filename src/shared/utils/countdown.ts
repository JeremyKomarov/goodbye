/** A duration in ms → whole days, hours, minutes and seconds; never negative. */
export function splitCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/** Two digits: `pad(7)` → "07". */
export function pad(n: number): string {
  return n.toString().padStart(2, "0");
}
