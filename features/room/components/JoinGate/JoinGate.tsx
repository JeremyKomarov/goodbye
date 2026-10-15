"use client";

import styles from "./JoinGate.module.scss";
import { motion } from "motion/react";
import { useState } from "react";
import { g, iso, peopleLabel, REASONS } from "@/core/hebrew";
import { NAME_TAKEN } from "@/core/hooks/useRoom";
import { sameName } from "@/core/login";
import type { Room } from "@/core/types";

type Props = {
  room: Room;
  /** Still finding out who you are: cover the room, but don't ask for a name yet. */
  checking: boolean;
  voterCount: number;
  onJoin: (name: string) => Promise<string | null>;
  /** Come in as someone who already joined on another device, with their code. */
  onSignInAs: (name: string, code: string) => Promise<string | null>;
};

export function JoinGate({
  room,
  checking,
  voterCount,
  onJoin,
  onSignInAs,
}: Props) {
  const [name, setName] = useState("");
  // Set when the name is taken: maybe it's you, on another device.
  const [askCode, setAskCode] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const he = room.host_gender;

  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const err = askCode ? await onSignInAs(name, code) : await onJoin(name);
    setPending(false);
    if (err === NAME_TAKEN && sameName(name, room.host_name))
      setError(
        `זה השם של ${iso(room.host_name)}. אם זה את/ה, פותחים כאן את קישור הניהול שלך.`,
      );
    else if (err === NAME_TAKEN) setAskCode(true);
    else if (err) setError(err);
  }

  function pickAnotherName() {
    setAskCode(false);
    setCode("");
    setError(null);
  }

  const verb =
    room.status === "exited"
      ? g(he, "כבר יצא", "כבר יצאה")
      : room.status === "locked"
        ? g(he, "יוצא", "יוצאת")
        : g(he, "צריך לצאת", "צריכה לצאת");

  return (
    <motion.div
      className={styles.view1}
      aria-busy={checking}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      {!checking && (
        <motion.form
          onSubmit={submit}
          className={styles.view2}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 220 }}
        >
          <div>
            <p className={styles.view3}>
              <bdi>{room.group_name}</bdi>
            </p>
            <h1 className={styles.view4}>
              {room.status === "voting"
                ? `מתי ${iso(room.host_name)} ${verb} מהקבוצה?`
                : `${iso(room.host_name)} ${verb} מהקבוצה`}
            </h1>
            <p className={styles.view5}>
              {room.reason
                ? `${iso(room.host_name)} ${REASONS[room.reason][he]}. `
                : ""}
              {room.status === "voting" ? "אתם מחליטים באיזו שעה. " : ""}
              {room.status === "exited"
                ? `הקיר עוד פתוח, ואפשר להשאיר ל${iso(room.host_name)} הודעת פרידה.`
                : voterCount > 0
                  ? `${peopleLabel(voterCount)} כבר ${voterCount === 1 ? "הצביע" : "הצביעו"}.`
                  : ""}
            </p>
          </div>

          {askCode ? (
            <div>
              <p className={styles.view6}>
                {`כבר יש בחדר ${iso(name.trim())}. זה את/ה, ממכשיר אחר?`}
              </p>
              <label
                htmlFor="join-code"
                className={styles.view7}
              >
                {`הקוד של ${iso(name.trim())}`}
              </label>
              <input
                id="join-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={10}
                autoFocus
                autoCapitalize="characters"
                autoComplete="one-time-code"
                spellCheck={false}
                enterKeyHint="go"
                dir="ltr"
                className={styles.view8}
              />
              <p className={styles.view9}>
                {`את הקוד רואים במכשיר שבו נכנסת: לוחצים על "שלום ${iso(name.trim())}" בראש החדר. לא זוכר/ת ואין את המכשיר? ${iso(room.host_name)} ${g(he, "יכול", "יכולה")} לשלוח לך אותו.`}
              </p>
            </div>
          ) : (
            <div>
              <label
                htmlFor="join-name"
                className={styles.view7}
              >
                איך קוראים לך? ככה יראו אותך בחדר
              </label>
              <input
                id="join-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                autoFocus
                autoComplete="nickname"
                enterKeyHint="go"
                className={styles.view10}
              />
            </div>
          )}

          {error && (
            <p role="alert" className={styles.view11}>
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={pending || !name.trim() || (askCode && !code.trim())}
            className={styles.view12}
          >
            {pending
              ? "נכנסים…"
              : askCode
                ? `כניסה בתור ${iso(name.trim())}`
                : "כניסה לחדר"}
          </motion.button>
          {askCode && (
            <button
              type="button"
              onClick={pickAnotherName}
              className={styles.view13}
            >
              זה לא אני, אבחר שם אחר
            </button>
          )}
        </motion.form>
      )}
    </motion.div>
  );
}
