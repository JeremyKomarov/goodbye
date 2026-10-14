"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { g, peopleLabel, REASONS } from "@/lib/hebrew";
import type { Room } from "@/lib/types";

type Props = {
  room: Room;
  voterCount: number;
  onJoin: (name: string) => Promise<string | null>;
};

export function JoinGate({ room, voterCount, onJoin }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const he = room.host_gender;

  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const err = await onJoin(name);
    setPending(false);
    if (err) setError(err);
  }

  const verb =
    room.status === "exited"
      ? g(he, "כבר יצא", "כבר יצאה")
      : room.status === "locked"
        ? g(he, "יוצא", "יוצאת")
        : g(he, "צריך לצאת", "צריכה לצאת");

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-night/95 backdrop-blur-sm">
      <motion.form
        onSubmit={submit}
        className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-6 py-10 short:gap-4 short:py-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 220 }}
      >
        <div>
          <p className="text-mute">{room.group_name}</p>
          <h1 className="mt-1 font-display text-[min(4.25rem,17vw)] font-bold short:text-[3.25rem] leading-[0.85]">
            {room.status === "voting"
              ? `מתי ${room.host_name} ${verb} מהקבוצה?`
              : `${room.host_name} ${verb} מהקבוצה`}
          </h1>
          <p className="mt-4 text-lg text-ink/80">
            {room.reason
              ? `${room.host_name} ${REASONS[room.reason][he]}. `
              : ""}
            {room.status === "voting" ? "אתם מחליטים באיזו שעה. " : ""}
            {voterCount > 0
              ? `${peopleLabel(voterCount)} כבר ${voterCount === 1 ? "הצביע" : "הצביעו"}.`
              : ""}
          </p>
        </div>

        <div>
          <label htmlFor="join-name" className="mb-1.5 block text-sm text-mute">
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
            className="w-full rounded-xl bg-raised px-4 py-3.5 text-lg outline-none focus:ring-2 focus:ring-pill/70"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-exit">
            {error}
          </p>
        )}

        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          disabled={pending || !name.trim()}
          className="rounded-2xl bg-signal px-6 py-4 text-lg font-semibold text-night disabled:opacity-50"
        >
          {pending ? "נכנסים…" : "כניסה לחדר"}
        </motion.button>
      </motion.form>
    </div>
  );
}
