import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { HERO_NAMESPACE, heroKeys } from "@/features/room/components/Hero/Hero.keys.const";
import type { HostExit } from "@/features/room/hooks/useHostExit";
import { Button, BUTTON_VARIANTS } from "@/shared/components/Button";
import { Icon, ICON_NAMES } from "@/shared/components/Icon";
import { cn } from "@/shared/utils/cn";
import { exitRowClasses } from "./ExitRow.classes";

interface ExitRowProps {
  /** From the close to the chosen hour, 0 to 1. */
  progress: number;
  isOvertime: boolean;
  /** The host's browser: the row is their button for marking the exit. */
  hostExit: HostExit | null;
}

/**
 * WhatsApp's red "Exit group" row from the group's info screen, filling up as the hour nears. For
 * everyone it shows the way; for the host it is the real thing.
 */
export function ExitRow({ progress, isOvertime, hostExit }: ExitRowProps) {
  const t = useTranslations(HERO_NAMESPACE);
  const end = hostExit?.isBusy
    ? t(heroKeys.exitRow.wait)
    : hostExit && isOvertime
      ? t(heroKeys.exitRow.tapHere)
      : `${Math.floor(progress * 100)}%`;

  const row = (
    <div
      className={cn(
        exitRowClasses.root,
        hostExit && exitRowClasses.action,
        hostExit && isOvertime && exitRowClasses.urgent,
      )}
    >
      <motion.div
        className={exitRowClasses.fill}
        initial={false}
        animate={{ width: `${progress * 100}%` }}
        transition={{ ease: "linear", duration: 0.25 }}
      />
      <div className={exitRowClasses.body}>
        <Icon name={ICON_NAMES.exit} />
        <span className={exitRowClasses.label}>{t(heroKeys.exitRow.label)}</span>
        <span className={exitRowClasses.end}>{end}</span>
      </div>
    </div>
  );

  if (!hostExit) return row;
  return (
    <Button
      variant={BUTTON_VARIANTS.bare}
      aria-label={t(heroKeys.exitRow.mark)}
      disabled={hostExit.isBusy}
      className={exitRowClasses.button}
      onClick={hostExit.onExit}
    >
      {row}
    </Button>
  );
}
