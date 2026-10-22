import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { HERO_NAMESPACE, heroKeys } from "@/features/room/components/Hero/Hero.keys.const";
import { Icon, ICON_NAMES } from "@/shared/components/Icon";
import { exitRowClasses } from "./ExitRow.classes";

/**
 * The red "Exit group" row, its fill showing how far the room has come from the close to the
 * chosen hour. Here it only shows the way; the host's button to mark the exit is the admin phase's.
 */
export function ExitRow({ progress }: { progress: number }) {
  const t = useTranslations(HERO_NAMESPACE);

  return (
    <div className={exitRowClasses.root}>
      <motion.div
        className={exitRowClasses.fill}
        initial={false}
        animate={{ width: `${progress * 100}%` }}
        transition={{ ease: "linear", duration: 0.25 }}
      />
      <div className={exitRowClasses.body}>
        <Icon name={ICON_NAMES.exit} />
        <span className={exitRowClasses.label}>{t(heroKeys.exitRow.label)}</span>
        <span className={exitRowClasses.end}>{Math.floor(progress * 100)}%</span>
      </div>
    </div>
  );
}
