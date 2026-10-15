"use client";

import styles from "./ReasonStep.module.scss";
import { motion } from "motion/react";
import { useTranslations } from "@/core/i18n/useLocale";
import type { MessageKey } from "@/core/i18n/messages";
import type { Gender, Reason } from "@/core/types";

const REASON_CARDS: {
  id: Reason;
  emoji: string;
  label: MessageKey;
  tagline: MessageKey;
}[] = [
  { id: "fired", emoji: "📦", label: "reasonFired", tagline: "reasonFiredTagline" },
  { id: "quit", emoji: "🫡", label: "reasonQuit", tagline: "reasonQuitTagline" },
  { id: "fed_up", emoji: "💅", label: "reasonFedUp", tagline: "reasonFedUpTagline" },
];

type Props = { reason: Reason | null; onReason: (reason: Reason | null) => void; gender: Gender };

export function ReasonStep({ reason, onReason, gender }: Props) {
  const t = useTranslations();
  return (
<div className={styles.view21}>
              {REASON_CARDS.map((card) => {
                const on = reason === card.id;
                return (
                  <motion.button
                    key={card.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => onReason(on ? null : card.id)}
                    whileTap={{ scale: 0.98 }}
                    className={[styles.view22, on ? styles.view23 : styles.view24, ""].filter(Boolean).join(" ")}
                  >
                    <motion.span
                      className={styles.view25}
                      animate={
                        on
                          ? { rotate: [0, -14, 14, 0], scale: [1, 1.15, 1] }
                          : {}
                      }
                      transition={{ duration: 0.45 }}
                      aria-hidden
                    >
                      {card.emoji}
                    </motion.span>
                    <span className={styles.view26}>
                      <span className={styles.view27}>{t(card.label)}</span>
                      <span className={styles.view28}>
                        {card.id === "quit"
                          ? `${t(gender === "m" ? "leavingMasculine" : "leavingFeminine")} ${t(card.tagline)}`
                          : t(card.tagline)}
                      </span>
                    </span>
                    <span
                      className={[styles.view29, on ? styles.view30 : styles.view31, ""].filter(Boolean).join(" ")}
                      aria-hidden
                    >
                      {on && "✓"}
                    </span>
                  </motion.button>
                );
              })}
            </div>
  );
}
