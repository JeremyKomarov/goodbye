"use client";

import styles from "./ScheduleStep.module.scss";
import { useTranslations } from "@/core/i18n/useLocale";

type Props = { startDate: string; onStartDate: (value: string) => void; days: number; onDays: (value: number) => void; fromHour: number; onFromHour: (value: number) => void; toHour: number; onToHour: (value: number) => void; closeLocal: string; onCloseLocal: (value: string) => void; openSlots: number };

export function ScheduleStep({ startDate, onStartDate: setStartDate, days, onDays: setDays, fromHour, onFromHour: setFromHour, toHour, onToHour: setToHour, closeLocal, onCloseLocal: setCloseLocal, openSlots }: Props) {
  const t = useTranslations();
  const field = styles.field;
  const label = styles.label;
  return (
<>
              <div className={styles.view32}>
                <div>
                  <label htmlFor="start" className={label}>
                    {t("startDay")}
                  </label>
                  <input
                    id="start"
                    type="date"
                    className={field}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <span className={label}>{t("howManyDays")}</span>
                  <div className={styles.view33}>
                    <button
                      type="button"
                      className={styles.view34}
                      onClick={() => setDays(days - 1)}
                      disabled={days <= 1}
                      aria-label={t("fewerDays")}
                    >
                      −
                    </button>
                    <span
                      className={styles.view35}
                      aria-live="polite"
                    >
                      {days}
                    </span>
                    <button
                      type="button"
                      className={styles.view34}
                      onClick={() => setDays(days + 1)}
                      disabled={days >= 7}
                      aria-label={t("moreDays")}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.view14}>
                <div>
                  <span className={label}>{t("hoursOfDay")}</span>
                  <div className={styles.view36}>
                    <select
                      aria-label={t("fromHour")}
                      className={["", field, styles.view37].filter(Boolean).join(" ")}
                      value={fromHour}
                      onChange={(e) => setFromHour(Number(e.target.value))}
                    >
                      {Array.from({ length: 24 }, (_, h) => (
                        <option key={h} value={h}>
                          {h.toString().padStart(2, "0")}:00
                        </option>
                      ))}
                    </select>
                    <span className={styles.view38}>{t("until")}</span>
                    <select
                      aria-label={t("untilHour")}
                      className={["", field, styles.view37].filter(Boolean).join(" ")}
                      value={toHour}
                      onChange={(e) => setToHour(Number(e.target.value))}
                    >
                      {Array.from({ length: 24 }, (_, i) => i + 1).map((h) => (
                        <option key={h} value={h}>
                          {h.toString().padStart(2, "0")}:00
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="close" className={label}>
                    {t("votingCloses")}
                  </label>
                  <input
                    id="close"
                    type="datetime-local"
                    className={field}
                    value={closeLocal}
                    onChange={(e) => setCloseLocal(e.target.value)}
                    required
                  />
                </div>
              </div>

              <p
                className={[styles.view20, openSlots > 0 ? styles.view38 : styles.view39, ""].filter(Boolean).join(" ")}
              >
                {toHour <= fromHour
                  ? t("invalidHourRange")
                  : openSlots > 0
                    ? t("slotsAvailable", { count: openSlots })
                    : t("noOpenSlots")}
              </p>
            </>
  );
}
