"use client";

import styles from "./CreateForm.module.scss";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, useTransition } from "react";
import { createRoom } from "@/app/actions";
import { saveAdminToken } from "@/core/admin-storage";
import { addDaysToDate, allSlots } from "@/core/slots";
import { useTranslations } from "@/core/i18n/useLocale";
import type { MessageKey } from "@/core/i18n/messages";
import type { Gender, Reason } from "@/core/types";
import type { CreatedRoom, Draft } from "@/features/landing/types";
import { IdentityStep } from "@/features/landing/components/IdentityStep/IdentityStep";
import { ReasonStep } from "@/features/landing/components/ReasonStep/ReasonStep";
import { ScheduleStep } from "@/features/landing/components/ScheduleStep/ScheduleStep";

const STEPS = [
  { title: "stepReason", sub: "stepReasonSub" },
  { title: "stepWho", sub: "stepWhoSub" },
  { title: "stepWhen", sub: "stepWhenSub" },
];

export type { Draft } from "@/features/landing/types";


function toLocalInput(d: Date) {
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function defaults() {
  const close = new Date();
  close.setHours(close.getHours() + 3, 0, 0, 0);
  return {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    startDate: toLocalInput(new Date()).slice(0, 10),
    closeLocal: toLocalInput(close),
  };
}

export function CreateForm({
  onCreated,
  reason,
  onReason,
  onDraft,
}: {
  onCreated: (c: CreatedRoom) => void;
  reason: Reason | null;
  onReason: (r: Reason | null) => void;
  onDraft: (d: Draft) => void;
}) {
  const t = useTranslations();
  // Mounted only in the browser (see CreateRoom), so local-time defaults are safe here.
  const [init] = useState(defaults);
  const [step, setStep] = useState(0);
  const [hostName, setHostName] = useState("");
  const [gender, setGender] = useState<Gender>("m");
  const [groupName, setGroupName] = useState("");
  const [startDate, setStartDate] = useState(init.startDate);
  const [days, setDays] = useState(2);
  const [fromHour, setFromHour] = useState(9);
  const [toHour, setToHour] = useState(22);
  const [closeLocal, setCloseLocal] = useState(init.closeLocal);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const closeMs = closeLocal ? new Date(closeLocal).getTime() : NaN;
  const openSlots = useMemo(() => {
    if (!startDate || toHour <= fromHour || Number.isNaN(closeMs)) return 0;
    return allSlots({
      timezone: init.timezone,
      window_start: startDate,
      window_end: addDaysToDate(startDate, days - 1),
      day_start_hour: fromHour,
      day_end_hour: toHour,
    }).filter((s) => s.ms >= closeMs).length;
  }, [startDate, days, fromHour, toHour, closeMs, init.timezone]);

  const last = step === STEPS.length - 1;

  // Each step's own required fields pass native validation before we get here,
  // so "next" and Enter both land in submit.
  function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!last) return setStep(step + 1);
    setError(null);
    if (Number.isNaN(closeMs)) return setError(t("chooseClosingTime"));
    startTransition(async () => {
      const result = await createRoom({
        hostName,
        hostGender: gender,
        groupName,
        reason,
        timezone: init.timezone,
        windowStart: startDate,
        days,
        dayStartHour: fromHour,
        dayEndHour: toHour,
        votingClosesAt: new Date(closeMs).toISOString(),
      });
      if (!result.ok) return setError(result.error);
      saveAdminToken(result.slug, result.adminToken);
      onCreated({
        slug: result.slug,
        adminToken: result.adminToken,
        hostName: hostName.trim(),
        gender,
      });
    });
  }

  return (
    <form onSubmit={submit} className={styles.view4}>
      <div className={styles.view5} aria-hidden>
        <div className={styles.view6}>
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className={styles.view7}
            >
              <motion.div
                className={styles.view8}
                initial={false}
                animate={{ width: i <= step ? "100%" : "0%" }}
                transition={{ type: "spring", damping: 26, stiffness: 220 }}
              />
            </div>
          ))}
        </div>
        <span dir="ltr" className={styles.view9}>
          {step + 1}/{STEPS.length}
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.fieldset
          key={step}
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.18 }}
          className={styles.view10}
        >
          <legend className={styles.view11}>
            <span className={styles.view12}>
              {t(STEPS[step].title as MessageKey)}
            </span>
            <span className={styles.view13}>
              {t(STEPS[step].sub as MessageKey)}
            </span>
          </legend>

          {step === 1 && <IdentityStep hostName={hostName} onHostName={setHostName} groupName={groupName} onGroupName={setGroupName} onDraft={onDraft} gender={gender} onGender={setGender} />}
          {step === 0 && <ReasonStep reason={reason} onReason={onReason} gender={gender} />}
          {step === 2 && <ScheduleStep startDate={startDate} onStartDate={setStartDate} days={days} onDays={setDays} fromHour={fromHour} onFromHour={setFromHour} toHour={toHour} onToHour={setToHour} closeLocal={closeLocal} onCloseLocal={setCloseLocal} openSlots={openSlots} />}
        </motion.fieldset>
      </AnimatePresence>

      {error && (
        <p
          role="alert"
          className={styles.view40}
        >
          {error}
        </p>
      )}

      <div className={styles.view41}>
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className={styles.view42}
          >
            {t("back")}
          </button>
        )}
        <motion.button
          type="submit"
          disabled={pending || (last && openSlots === 0)}
          whileTap={{ scale: 0.97 }}
          className={styles.view43}
        >
          {pending
            ? t("creatingRoom")
            : last
              ? t("createRoom")
              : step === 0 && !reason
                ? t("skip")
                : t("next")}
        </motion.button>
      </div>
    </form>
  );
}
