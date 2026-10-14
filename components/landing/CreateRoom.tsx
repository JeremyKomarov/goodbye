"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { createRoom } from "@/app/actions";
import { Sheet } from "@/components/ui/Sheet";
import { saveAdminToken } from "@/lib/admin-storage";
import { g } from "@/lib/hebrew";
import { addDaysToDate, allSlots } from "@/lib/slots";
import type { Gender, Reason } from "@/lib/types";

const REASON_CHIPS: { id: Reason; label: string }[] = [
  { id: "fired", label: "פוטרתי" },
  { id: "quit", label: "התפטרתי" },
  { id: "fed_up", label: "סתם נמאס לי" },
];

const field =
  "w-full rounded-xl bg-raised px-4 py-3 text-base text-ink placeholder:text-mute/70 outline-none focus:ring-2 focus:ring-pill/70";
const label = "mb-1.5 block text-sm text-mute";

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

type Created = {
  slug: string;
  adminToken: string;
  hostName: string;
  gender: Gender;
};

export function CreateRoom() {
  const [open, setOpen] = useState(false);
  const [created, setCreated] = useState<Created | null>(null);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.97 }}
        className="w-full rounded-2xl bg-exit px-6 py-4 text-lg font-semibold text-night shadow-[0_10px_40px_-10px] shadow-exit/60 transition-colors hover:bg-[#f47684]"
      >
        פתיחת חדר הצבעה
      </motion.button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={created ? "החדר מוכן" : "חדר הצבעה חדש"}
      >
        {created ? (
          <Success created={created} />
        ) : (
          open && <CreateForm onCreated={setCreated} />
        )}
      </Sheet>
    </>
  );
}

function CreateForm({ onCreated }: { onCreated: (c: Created) => void }) {
  // Mounted only on the client when the sheet opens, so local-time defaults are safe here.
  const [init] = useState(defaults);
  const [hostName, setHostName] = useState("");
  const [gender, setGender] = useState<Gender>("m");
  const [groupName, setGroupName] = useState("");
  const [reason, setReason] = useState<Reason | null>(null);
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

  const name = hostName.trim() || "ג׳רמי";

  function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (Number.isNaN(closeMs)) return setError("צריך לבחור מתי ההצבעה נסגרת");
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
    <form onSubmit={submit} className="flex flex-col gap-5 pb-2">
      <div>
        <label htmlFor="host" className={label}>
          איך קוראים לך?
        </label>
        <input
          id="host"
          className={field}
          value={hostName}
          onChange={(e) => setHostName(e.target.value)}
          maxLength={30}
          placeholder="ג׳רמי"
          required
          autoComplete="given-name"
        />
      </div>

      <fieldset>
        <legend className={label}>איך יופיע בקבוצה?</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["m", "f"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setGender(option)}
              aria-pressed={gender === option}
              className={`rounded-xl px-3 py-3 text-sm transition-colors ${gender === option ? "bg-bubble text-ink ring-2 ring-signal/60" : "bg-raised text-mute"}`}
            >
              {name} {g(option, "יצא", "יצאה")} מהקבוצה
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="group" className={label}>
          מאיזו קבוצה יוצאים?
        </label>
        <input
          id="group"
          className={field}
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          maxLength={60}
          placeholder="צוות מוצר 🚀"
          required
        />
      </div>

      <fieldset>
        <legend className={label}>למה? (לא חובה)</legend>
        <div className="flex flex-wrap gap-2">
          {REASON_CHIPS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              aria-pressed={reason === chip.id}
              onClick={() => setReason(reason === chip.id ? null : chip.id)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${reason === chip.id ? "bg-kraft text-night" : "bg-raised text-ink/80"}`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div>
          <label htmlFor="start" className={label}>
            מאיזה יום אפשר לצאת?
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
          <span className={label}>כמה ימים?</span>
          <div className="flex items-center rounded-xl bg-raised">
            <button
              type="button"
              className="px-3 py-3 text-lg text-mute disabled:opacity-30"
              onClick={() => setDays(days - 1)}
              disabled={days <= 1}
              aria-label="פחות ימים"
            >
              −
            </button>
            <span className="w-6 text-center tabular-nums" aria-live="polite">
              {days}
            </span>
            <button
              type="button"
              className="px-3 py-3 text-lg text-mute disabled:opacity-30"
              onClick={() => setDays(days + 1)}
              disabled={days >= 7}
              aria-label="עוד ימים"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div>
        <span className={label}>באילו שעות ביום?</span>
        <div className="flex items-center gap-2">
          <select
            aria-label="משעה"
            className={field}
            value={fromHour}
            onChange={(e) => setFromHour(Number(e.target.value))}
          >
            {Array.from({ length: 24 }, (_, h) => (
              <option key={h} value={h}>
                {h.toString().padStart(2, "0")}:00
              </option>
            ))}
          </select>
          <span className="text-mute">עד</span>
          <select
            aria-label="עד שעה"
            className={field}
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
          מתי נסגרת ההצבעה?
        </label>
        <input
          id="close"
          type="datetime-local"
          className={field}
          value={closeLocal}
          onChange={(e) => setCloseLocal(e.target.value)}
          required
        />
        <p
          className={`mt-2 text-sm ${openSlots > 0 ? "text-mute" : "text-exit"}`}
        >
          {toHour <= fromHour
            ? "שעת הסיום צריכה להיות אחרי שעת ההתחלה"
            : openSlots > 0
              ? `יהיו ${openSlots} שעות לבחירה. שעות שלפני סגירת ההצבעה לא יופיעו.`
              : "אין שעות לבחירה אחרי סגירת ההצבעה. כדאי להוסיף ימים או לסגור מוקדם יותר."}
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-exit/15 px-4 py-3 text-sm text-exit"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || openSlots === 0}
        className="rounded-2xl bg-exit px-6 py-4 text-lg font-semibold text-night transition-opacity disabled:opacity-50"
      >
        {pending ? "פותחים את החדר…" : "פתיחת חדר הצבעה"}
      </button>
    </form>
  );
}

function CopyRow({
  value,
  label: text,
  tone = "ink",
}: {
  value: string;
  label: string;
  tone?: "ink" | "pill";
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <div
        className={`mb-1.5 text-sm ${tone === "pill" ? "text-pill" : "text-mute"}`}
      >
        {text}
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-raised p-1.5 ps-3">
        <span
          dir="ltr"
          className="min-w-0 flex-1 truncate text-left text-sm text-ink/80"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }}
          className="shrink-0 rounded-lg bg-line px-3 py-2 text-sm"
        >
          {copied ? "הועתק" : "העתקה"}
        </button>
      </div>
    </div>
  );
}

function Success({ created }: { created: Created }) {
  const [origin] = useState(() => window.location.origin);
  const roomUrl = `${origin}/r/${created.slug}`;
  const adminUrl = `${roomUrl}/admin#k=${created.adminToken}`;
  const name = created.hostName;
  const shareText = `${name} ${g(created.gender, "יוצא", "יוצאת")} מהקבוצה, ואתם מחליטים מתי 🫡\nהצביעו כאן: ${roomUrl}`;

  return (
    <div className="flex flex-col gap-5 pb-2">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 14, stiffness: 260 }}
        className="mx-auto grid size-20 place-items-center rounded-full bg-bubble text-4xl"
        aria-hidden
      >
        🗳️
      </motion.div>
      <p className="text-center text-ink/80">
        עכשיו שולחים את הקישור לקבוצה. כל מי שנכנס בוחר שעה, ואת השאר תעשה
        הדמוקרטיה.
      </p>

      <a
        href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 rounded-2xl bg-signal px-6 py-4 text-lg font-semibold text-night"
      >
        שליחה לקבוצה בוואטסאפ
      </a>

      <CopyRow value={roomUrl} label="קישור לחדר" />
      <CopyRow
        value={adminUrl}
        label="קישור הניהול שלך. רק איתו אפשר לנעול את ההצבעה ולסמן שיצאת, אז כדאי לשמור אותו ולא לשלוח לקבוצה."
        tone="pill"
      />

      <Link
        href={`/r/${created.slug}`}
        className="rounded-2xl bg-raised px-6 py-4 text-center font-semibold"
      >
        כניסה לחדר
      </Link>
    </div>
  );
}
