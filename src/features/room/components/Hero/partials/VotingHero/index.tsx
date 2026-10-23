import { useTranslations } from "next-intl";
import { heroClasses } from "@/features/room/components/Hero/Hero.classes";
import { HERO_NAMESPACE, heroKeys } from "@/features/room/components/Hero/Hero.keys.const";
import type { HeroProps } from "@/features/room/components/Hero/Hero.types";
import { useSlotFormat } from "@/shared/hooks/useSlotFormat";
import { ROOM_NAMESPACE, roomKeys } from "@/features/room/strings/room.keys.const";
import { SystemPill } from "@/shared/components/SystemPill";
import { isolate } from "@/shared/utils/isolate";
import { Countdown } from "@/features/room/components/Hero/partials/Countdown";

// A tie lists this many hours, then "and N more".
const TIED_SHOWN = 3;

/** While the group votes: who is leaving and why, the time left to vote, and who is leading. */
export function VotingHero({ room, now, leader, voterCount }: HeroProps) {
  const t = useTranslations(HERO_NAMESPACE);
  const tRoom = useTranslations(ROOM_NAMESPACE);
  const format = useSlotFormat(room.timezone);
  const name = isolate(room.hostName);
  const gender = room.hostGender;
  const remaining = room.votingClosesAt - now;
  // The moment after the close, before the database has locked the winner.
  const counting = now > 0 && remaining <= 0;
  const votes = (count: number) => tRoom(roomKeys.votes, { count });

  return (
    <section className={heroClasses.root} aria-label={t(heroKeys.label)}>
      <SystemPill className={heroClasses.pill}>
        {room.reason &&
          `${t(heroKeys.voting.because, {
            name,
            reason: tRoom(roomKeys.reason, { reason: room.reason, gender }),
          })} `}
        {t(heroKeys.voting.deciding, { gender, group: isolate(room.groupName) })}
      </SystemPill>
      <p className={heroClasses.label}>
        {t(heroKeys.voting.closesIn, { counting: String(counting) })}
      </p>
      <Countdown ms={Math.max(0, remaining)} isTicking={now > 0} />
      {leader && leader.tied.length > 1 ? (
        <div className={heroClasses.note}>
          <span className={heroClasses.tie}>
            <span aria-hidden>⚖️</span>
            {t(heroKeys.voting.tie, { count: leader.tied.length })}
          </span>
          <p className={heroClasses.tied}>
            {t(heroKeys.voting.tied, {
              slots: leader.tied.slice(0, TIED_SHOWN).map(format.slot).join(", "),
              more: Math.max(0, leader.tied.length - TIED_SHOWN),
              votes: votes(leader.count),
              counting: String(counting),
            })}
          </p>
        </div>
      ) : (
        <p className={heroClasses.note}>
          {leader
            ? t(heroKeys.voting.leading, {
                slot: format.slot(leader.ms),
                votes: votes(leader.count),
                voters: voterCount,
              })
            : t(heroKeys.voting.noVotes)}
        </p>
      )}
    </section>
  );
}
