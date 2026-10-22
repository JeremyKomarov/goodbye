import { useTranslations } from "next-intl";
import { FlipDigits } from "@/features/room/components/FlipDigits";
import { HERO_NAMESPACE, heroKeys } from "@/features/room/components/Hero/Hero.keys.const";
import { useDuration } from "@/features/room/hooks/useDuration";
import { cn } from "@/shared/utils/cn";
import { pad, splitCountdown } from "@/shared/utils/countdown";
import { countdownClasses } from "./Countdown.classes";
import { COUNTDOWN_TONES, type CountdownTone } from "./Countdown.const";

// Before the page's clock starts (on the server, while hydrating) the digits are a placeholder.
const NOT_TICKING = "--:--:--";

/** Days in words above `HH:MM:SS` in rolling digits, and the whole of it spoken for readers. */
export function Countdown({
  ms,
  isTicking,
  tone = COUNTDOWN_TONES.plain,
}: {
  ms: number;
  isTicking: boolean;
  tone?: CountdownTone;
}) {
  const t = useTranslations(HERO_NAMESPACE);
  const { exact } = useDuration();
  const { days, hours, minutes, seconds } = splitCountdown(Math.abs(ms));
  const clock = isTicking ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : NOT_TICKING;

  return (
    <div className={countdownClasses.root}>
      {isTicking && days > 0 && (
        <div className={countdownClasses.days}>{t(heroKeys.days, { count: days })}</div>
      )}
      <FlipDigits
        value={clock}
        className={cn(countdownClasses.digits, countdownClasses.tone[tone])}
      />
      {isTicking && <span className={countdownClasses.spoken}>{exact(ms)}</span>}
    </div>
  );
}

export { COUNTDOWN_TONES, type CountdownTone };
