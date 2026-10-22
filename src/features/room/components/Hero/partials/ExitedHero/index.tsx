import { useTranslations } from "next-intl";
import { heroClasses } from "@/features/room/components/Hero/Hero.classes";
import { HERO_NAMESPACE, heroKeys } from "@/features/room/components/Hero/Hero.keys.const";
import type { HeroProps } from "@/features/room/components/Hero/Hero.types";
import { useDuration } from "@/features/room/hooks/useDuration";
import { verdict } from "@/features/room/utils/verdict";
import { SystemPill } from "@/shared/components/SystemPill";
import { cn } from "@/shared/utils/cn";
import { isolate } from "@/shared/utils/isolate";

/** The host has left: the notice, and how it went against the hour the group chose. */
export function ExitedHero({ room }: Pick<HeroProps, "room">) {
  const t = useTranslations(HERO_NAMESPACE);
  const { rough } = useDuration();
  const gender = room.hostGender;
  const outcome = verdict(room);

  return (
    <section className={cn(heroClasses.root, heroClasses.exited)} aria-label={t(heroKeys.label)}>
      <SystemPill>{t(heroKeys.exited.left, { name: isolate(room.hostName), gender })}</SystemPill>
      {outcome && (
        <p className={heroClasses.verdict}>
          {t(heroKeys.exited.verdict, {
            kind: outcome.kind,
            gender,
            by: "diffMs" in outcome ? rough(outcome.diffMs) : "",
          })}
        </p>
      )}
    </section>
  );
}
