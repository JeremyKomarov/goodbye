"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { HERO_NAMESPACE, heroKeys } from "@/features/room/components/Hero/Hero.keys.const";
import { Button, BUTTON_VARIANTS } from "@/shared/components/Button";
import { SystemPill } from "@/shared/components/SystemPill";
import { useDuration } from "@/shared/hooks/useDuration";
import { useExitSummary } from "@/shared/hooks/useExitSummary";
import { useRecords } from "@/shared/hooks/useRecords";
import type { Room } from "@/shared/types/room.types";
import { CELEBRATIONS, celebrate } from "@/shared/utils/celebrate";
import { isolate } from "@/shared/utils/isolate";
import { champions } from "@/shared/utils/records";
import { verdict } from "@/shared/utils/verdict";
import { finaleClasses } from "./Finale.classes";
import { FINALE_NAMESPACE, finaleKeys } from "./Finale.keys.const";
import { FinaleHighlights } from "./partials/FinaleHighlights";
import { FinaleStats } from "./partials/FinaleStats";

// The confetti waits for the notice to land.
const CONFETTI_DELAY_MS = 900;
const VIBRATION = [40, 60, 120];
const appear = (delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay },
});

/**
 * The host has left: the WhatsApp notice drops in, then how it went against the hour, the room in
 * numbers, the most loved goodbye and the champions — over the whole room, with confetti.
 */
export function Finale({ room, onClose }: { room: Room; onClose: () => void }) {
  const t = useTranslations(FINALE_NAMESPACE);
  const tHero = useTranslations(HERO_NAMESPACE);
  const { rough } = useDuration();
  const { data: summary } = useExitSummary(room.slug);
  const { data: records } = useRecords(room.slug);
  const outcome = verdict(room);
  const gender = room.hostGender;
  const left = tHero(heroKeys.exited.left, { name: isolate(room.hostName), gender });

  useEffect(() => {
    const timer = setTimeout(() => void celebrate(CELEBRATIONS.finale), CONFETTI_DELAY_MS);
    navigator.vibrate?.(VIBRATION);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={left}
      className={finaleClasses.root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={finaleClasses.column}>
        <motion.div
          className={finaleClasses.notice}
          initial={{ y: -80, opacity: 0, scale: 0.6 }}
          animate={{ y: 0, opacity: 1, scale: [0.6, 1.25, 1] }}
          transition={{ duration: 0.7, times: [0, 0.6, 1], delay: 0.3 }}
        >
          <SystemPill>{left}</SystemPill>
        </motion.div>
        {outcome && (
          <motion.h2
            className={finaleClasses.headline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, type: "spring", damping: 16 }}
          >
            {tHero(heroKeys.exited.verdict, {
              kind: outcome.kind,
              gender,
              by: "diffMs" in outcome ? rough(outcome.diffMs) : "",
            })}
          </motion.h2>
        )}
        {summary && (
          <motion.div className={finaleClasses.body} {...appear(1.6)}>
            <FinaleStats room={room} summary={summary} />
            <FinaleHighlights loved={summary.loved} champions={champions(records ?? [])} />
          </motion.div>
        )}
        <motion.div {...appear(2.3)}>
          <Button variant={BUTTON_VARIANTS.primary} onClick={onClose} autoFocus>
            {t(finaleKeys.back)}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
