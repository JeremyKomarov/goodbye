"use client";

import styles from "./IdentityStep.module.scss";
import { SystemPill } from "@/components/ui/SystemPill/SystemPill";
import { iso } from "@/core/hebrew";
import { useTranslations } from "@/core/i18n/useLocale";
import type { Gender } from "@/core/types";
import type { Draft } from "@/features/landing/types";

type Props = { hostName: string; onHostName: (value: string) => void; groupName: string; onGroupName: (value: string) => void; onDraft: (draft: Draft) => void; gender: Gender; onGender: (gender: Gender) => void };

export function IdentityStep({ hostName, onHostName: setHostName, groupName, onGroupName: setGroupName, onDraft, gender, onGender: setGender }: Props) {
  const t = useTranslations();
  const name = hostName.trim() || t("namePlaceholder");
  const field = styles.field;
  const label = styles.label;
  return (
<>
              <div className={styles.view14}>
                <div>
                  <label htmlFor="host" className={label}>
                    {t("yourName")}
                  </label>
                  <input
                    id="host"
                    className={field}
                    value={hostName}
                    onChange={(e) => {
                      setHostName(e.target.value);
                      onDraft({ hostName: e.target.value, groupName });
                    }}
                    maxLength={30}
                    placeholder={t("namePlaceholder")}
                    required
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label htmlFor="group" className={label}>
                    {t("groupName")}
                  </label>
                  <input
                    id="group"
                    className={field}
                    value={groupName}
                    onChange={(e) => {
                      setGroupName(e.target.value);
                      onDraft({ hostName, groupName: e.target.value });
                    }}
                    maxLength={60}
                    placeholder={t("groupPlaceholder")}
                    required
                  />
                </div>
              </div>
              <div className={styles.view15}>
                <div
                  role="radiogroup"
                  aria-label={t("genderPrompt")}
                  className={styles.view16}
                >
                  {(["m", "f"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={gender === option}
                      onClick={() => setGender(option)}
                      className={[styles.view17, gender === option ? styles.view18 : styles.view19, ""].filter(Boolean).join(" ")}
                    >
                      {t(option === "m" ? "genderHe" : "genderShe")}
                    </button>
                  ))}
                </div>
                <SystemPill className={styles.view20}>
                  {iso(name)} {t(gender === "m" ? "exitedMasculine" : "exitedFeminine")} {t("fromGroup")}
                </SystemPill>
              </div>
            </>
  );
}
