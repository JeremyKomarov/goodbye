import { useTranslations } from "next-intl";
import { heroClasses } from "@/features/room/components/Hero/Hero.classes";
import { HERO_NAMESPACE, heroKeys } from "@/features/room/components/Hero/Hero.keys.const";
import type { HeroProps } from "@/features/room/components/Hero/Hero.types";
import { useSlotFormat } from "@/shared/hooks/useSlotFormat";
import { ROOM_NAMESPACE, roomKeys } from "@/features/room/strings/room.keys.const";
import { wonByDraw } from "@/shared/utils/tally";
import { isolate } from "@/shared/utils/isolate";
import { COUNTDOWN_TONES, Countdown } from "@/features/room/components/Hero/partials/Countdown";
import { ExitRow } from "@/features/room/components/Hero/partials/ExitRow";

/** The hour is chosen: the countdown to it, how it was chosen, and the exit row filling up. */
export function LockedHero(props: HeroProps & { lockedSlot: number }) {
  const { room, now, leader, lockedSlot, hostExit, actions } = props;
  const t = useTranslations(HERO_NAMESPACE);
  const tRoom = useTranslations(ROOM_NAMESPACE);
  const format = useSlotFormat(room.timezone);
  const name = isolate(room.hostName);
  const gender = room.hostGender;
  const target = lockedSlot;
  const remaining = target - now;
  const overtime = now > 0 && remaining < 0;
  const span = Math.max(1, target - room.votingClosesAt);
  const progress = now > 0 ? Math.min(1, Math.max(0, (now - room.votingClosesAt) / span)) : 0;
  const slot = format.slot(target);

  const note = overtime
    ? hostExit
      ? t(heroKeys.locked.hostNow)
      : t(heroKeys.locked.waiting, { name, gender })
    : wonByDraw(leader, lockedSlot)
      ? t(heroKeys.locked.drawn, { slot, count: leader?.tied.length ?? 0 })
      : leader
        ? t(heroKeys.locked.decided, {
            slot,
            votes: tRoom(roomKeys.votes, { count: leader.count }),
          })
        : t(heroKeys.locked.decidedPlain, { slot });

  return (
    <section className={heroClasses.root} aria-label={t(heroKeys.label)}>
      <p className={heroClasses.label}>
        {t(heroKeys.locked.leavesIn, { overtime: String(overtime), name, gender })}
      </p>
      <Countdown
        ms={remaining}
        isTicking={now > 0}
        tone={overtime ? COUNTDOWN_TONES.overtime : COUNTDOWN_TONES.plain}
      />
      <p className={heroClasses.note}>{note}</p>
      <ExitRow progress={progress} isOvertime={overtime} hostExit={hostExit ?? null} />
      {actions}
    </section>
  );
}
