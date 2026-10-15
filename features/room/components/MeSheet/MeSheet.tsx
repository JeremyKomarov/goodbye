"use client";

import styles from "./MeSheet.module.scss";
import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet/Sheet";
import { iso } from "@/core/hebrew";
import type { Me } from "@/core/hooks/useRoom";
import { loadLoginCode } from "@/core/login";

type Props = {
  me: Me;
  open: boolean;
  onClose: () => void;
  onRename: (name: string) => Promise<string | null>;
  onSwitch: () => Promise<void>;
  onLoginCode: (fresh?: boolean) => Promise<string | null>;
};

/**
 * You in the room: fix your name, get the code for coming in from another device,
 * or hand the phone to someone else ("not you?").
 */
export function MeSheet({
  me,
  open,
  onClose,
  onRename,
  onSwitch,
  onLoginCode,
}: Props) {
  return (
    <Sheet open={open} onClose={onClose} title={`שלום ${me.name}`}>
      <MeForm
        me={me}
        onClose={onClose}
        onRename={onRename}
        onSwitch={onSwitch}
        onLoginCode={onLoginCode}
      />
    </Sheet>
  );
}

function MeForm({
  me,
  onClose,
  onRename,
  onSwitch,
  onLoginCode,
}: Omit<Props, "open">) {
  const [name, setName] = useState(me.name);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function save(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const err = await onRename(name);
    setPending(false);
    if (err) setError(err);
    else onClose();
  }

  async function switchUser() {
    if (
      !window.confirm(
        `להיכנס בשם אחר? החדר ישכח את ${me.name} בדפדפן הזה, גם בחדרים אחרים.`,
      )
    )
      return;
    onClose();
    await onSwitch();
  }

  return (
    <div className={styles.view1}>
      <form onSubmit={save}>
        <label htmlFor="me-name" className={styles.view2}>
          השם שלך בחדר
        </label>
        <div className={styles.view3}>
          <input
            id="me-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            autoComplete="nickname"
            enterKeyHint="done"
            className={styles.view4}
          />
          <button
            type="submit"
            disabled={pending || !name.trim() || name.trim() === me.name}
            className={styles.view5}
          >
            {pending ? "שומרים…" : "שמירה"}
          </button>
        </div>
        {error && (
          <p role="alert" className={styles.view6}>
            {error}
          </p>
        )}
        <p className={styles.view7}>
          הודעות שכבר נשלחו לקיר נשארות עם השם הקודם.
        </p>
      </form>

      <DeviceCode me={me} onLoginCode={onLoginCode} />

      <div className={styles.view8}>
        <p className={styles.view9}>
          {`לא ${iso(me.name)}? בטלפון משותף אפשר להיכנס בשם אחר.`}
        </p>
        <button
          type="button"
          onClick={switchUser}
          className={styles.view10}
        >
          להיכנס בשם אחר
        </button>
      </div>
    </div>
  );
}

function DeviceCode({ me, onLoginCode }: Pick<Props, "me" | "onLoginCode">) {
  const [code, setCode] = useState(() => loadLoginCode(me.userId));
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  async function show(fresh: boolean) {
    if (
      fresh &&
      !window.confirm(
        "ליצור קוד חדש? הקוד הישן יפסיק לעבוד, ומכשירים אחרים שנכנסו איתו יצטרכו את החדש.",
      )
    )
      return;
    setPending(true);
    setFailed(false);
    const next = await onLoginCode(fresh);
    setPending(false);
    if (next) setCode(next);
    else setFailed(true);
  }

  async function copy() {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className={styles.view8}>
      <p className={styles.view11}>כניסה ממכשיר אחר</p>
      <p className={styles.view12}>
        {`בטלפון או במחשב אחר פותחים את הקישור לחדר, כותבים ${iso(me.name)} ואז את הקוד. ממשיכים מאותו מקום, עם אותו קול ואותם שיאים.`}
      </p>
      {code ? (
        <>
          <div className={styles.view13}>
            <span
              dir="ltr"
              className={styles.view14}
            >
              {code}
            </span>
            <button
              type="button"
              onClick={copy}
              className={styles.view15}
            >
              {copied ? "הועתק" : "העתקה"}
            </button>
          </div>
          <button
            type="button"
            onClick={() => show(true)}
            disabled={pending}
            className={styles.view16}
          >
            {pending ? "יוצרים…" : "קוד חדש"}
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => show(false)}
          disabled={pending}
          className={styles.view17}
        >
          {pending ? "יוצרים קוד…" : "הצגת הקוד שלי"}
        </button>
      )}
      {failed && (
        <p role="alert" className={styles.view6}>
          לא הצלחנו ליצור קוד. נסו שוב
        </p>
      )}
    </div>
  );
}
