"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import {
  type AdminResult,
  deleteWallMessage,
  getAdminRoom,
  lockVoting,
  markExited,
  reopenVoting,
  undoExit,
} from "@/app/r/[slug]/admin/actions";
import { SystemPill } from "@/components/ui/SystemPill";
import { loadAdminToken, saveAdminToken } from "@/lib/admin-storage";
import { formatHour, formatSlot } from "@/lib/hebrew";
import { getBrowserClient } from "@/lib/supabase/browser";
import type { Room, WallMessage } from "@/lib/types";

const noop = () => () => {};

function readToken(slug: string) {
  const fromHash = new URLSearchParams(window.location.hash.slice(1)).get("k");
  if (fromHash) {
    saveAdminToken(slug, fromHash);
    return fromHash;
  }
  return loadAdminToken(slug) ?? "";
}

function toLocalInput(ms: number) {
  const d = new Date(ms);
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function AdminPanel({ slug }: { slug: string }) {
  const token = useSyncExternalStore(
    noop,
    () => readToken(slug),
    () => null,
  );
  const [state, setState] = useState<AdminResult | null>(null);

  useEffect(() => {
    if (token === null) return;
    let cancelled = false;
    getAdminRoom(slug, token).then((result) => !cancelled && setState(result));
    return () => {
      cancelled = true;
    };
  }, [slug, token]);

  if (token === null || state === null)
    return (
      <p className="p-10 text-center text-mute">בודקים את קישור הניהול…</p>
    );
  if (!state.ok)
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-5 px-6 text-center">
        <SystemPill className="text-base">{state.error}</SystemPill>
        <Link href={`/r/${slug}`} className="text-tick">
          לחדר עצמו
        </Link>
      </main>
    );

  return (
    <Panel
      slug={slug}
      token={token}
      room={state.room}
      onRoom={(room) => setState({ ok: true, room })}
    />
  );
}

function Panel({
  slug,
  token,
  room,
  onRoom,
}: {
  slug: string;
  token: string;
  room: Room;
  onRoom: (room: Room) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [closeLocal, setCloseLocal] = useState(() =>
    toLocalInput(
      Math.max(Date.now() + 3_600_000, Date.parse(room.voting_closes_at)),
    ),
  );
  const [messages, setMessages] = useState<WallMessage[]>([]);
  const tz = room.timezone;

  const loadMessages = useCallback(async () => {
    const { data } = await getBrowserClient()
      .from("wall_messages")
      .select("*")
      .eq("room_id", room.id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setMessages(data as WallMessage[]);
  }, [room.id]);

  useEffect(() => {
    let cancelled = false;
    getBrowserClient()
      .from("wall_messages")
      .select("*")
      .eq("room_id", room.id)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(
        ({ data }) => !cancelled && data && setMessages(data as WallMessage[]),
      );
    return () => {
      cancelled = true;
    };
  }, [room.id]);

  function run(action: () => Promise<AdminResult>, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.ok) onRoom(result.room);
      else setError(result.error);
    });
  }

  const statusLine =
    room.status === "voting"
      ? `ההצבעה פתוחה עד ${formatSlot(Date.parse(room.voting_closes_at), tz)}`
      : room.status === "locked"
        ? `השעה נעולה: ${room.locked_slot ? formatSlot(Date.parse(room.locked_slot), tz) : "לא נבחרה"}`
        : `יצאת בשעה ${room.exited_at ? formatHour(Date.parse(room.exited_at), tz) : ""}`;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-5 px-4 pb-16 pt-8">
      <div>
        <Link href={`/r/${slug}`} className="text-sm text-tick">
          חזרה לחדר
        </Link>
        <h1 className="mt-2 font-display text-6xl font-bold leading-none">
          ניהול החדר
        </h1>
        <p className="mt-2 text-ink/80">{room.group_name}</p>
      </div>

      <div className="rounded-3xl bg-panel p-5">
        <p className="text-sm text-mute">מצב עכשיו</p>
        <p className="mt-1 text-lg font-semibold">{statusLine}</p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-exit/15 px-4 py-3 text-sm text-exit"
        >
          {error}
        </p>
      )}

      {room.status !== "exited" && (
        <div className="rounded-3xl bg-panel p-5">
          <p className="mb-4 text-ink/80">
            {room.status === "locked"
              ? "כשהשעה מגיעה, צאו מהקבוצה בוואטסאפ ואז לחצו כאן. כל מי שבחדר יראה את זה בזמן אמת."
              : "אפשר ללחוץ כבר עכשיו. השעה המובילה תינעל ומיד תסומן יציאה."}
          </p>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            disabled={pending}
            onClick={() =>
              run(
                () => markExited(slug, token),
                "לסמן שיצאת מהקבוצה? כולם יראו את זה מיד.",
              )
            }
            className="w-full rounded-2xl bg-exit px-6 py-5 text-xl font-bold text-night shadow-[0_10px_40px_-10px] shadow-exit/60 disabled:opacity-50"
          >
            יצאתי מהקבוצה
          </motion.button>
        </div>
      )}

      {room.status === "voting" && (
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            run(
              () => lockVoting(slug, token),
              "לנעול את ההצבעה עכשיו? השעה המובילה תיבחר.",
            )
          }
          className="rounded-2xl bg-raised px-6 py-4 font-semibold disabled:opacity-50"
        >
          נעילת ההצבעה עכשיו
        </button>
      )}

      {room.status === "exited" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            run(
              () => undoExit(slug, token),
              "לבטל את היציאה ולחזור לספירה לאחור?",
            )
          }
          className="rounded-2xl bg-raised px-6 py-4 font-semibold disabled:opacity-50"
        >
          ביטול היציאה
        </button>
      ) : (
        <div className="rounded-3xl bg-panel p-5">
          <label htmlFor="reopen" className="mb-2 block text-sm text-mute">
            {room.status === "voting"
              ? "לשנות מתי נסגרת ההצבעה"
              : "לפתוח את ההצבעה מחדש, עד"}
          </label>
          <input
            id="reopen"
            type="datetime-local"
            value={closeLocal}
            onChange={(e) => setCloseLocal(e.target.value)}
            className="w-full rounded-xl bg-raised px-4 py-3 outline-none focus:ring-2 focus:ring-pill/70"
          />
          <button
            type="button"
            disabled={pending || !closeLocal}
            onClick={() =>
              run(() =>
                reopenVoting(slug, token, new Date(closeLocal).toISOString()),
              )
            }
            className="mt-3 w-full rounded-2xl bg-raised px-6 py-3.5 font-semibold disabled:opacity-50"
          >
            {room.status === "voting" ? "עדכון זמן הסגירה" : "פתיחה מחדש"}
          </button>
        </div>
      )}

      <section className="rounded-3xl bg-panel p-5">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-semibold">הודעות בקיר</h2>
          <button
            type="button"
            onClick={loadMessages}
            className="text-sm text-tick"
          >
            רענון
          </button>
        </div>
        {messages.length === 0 ? (
          <p className="text-mute">אין הודעות עדיין.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {messages.map((m) => (
              <li
                key={m.id}
                className="flex items-start gap-3 rounded-xl bg-raised px-3 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-mute">{m.display_name}</div>
                  <p className="break-words text-sm">{m.body}</p>
                </div>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    run(async () => {
                      const result = await deleteWallMessage(slug, token, m.id);
                      if (result.ok)
                        setMessages((prev) =>
                          prev.filter((x) => x.id !== m.id),
                        );
                      return result;
                    }, "למחוק את ההודעה?")
                  }
                  className="shrink-0 rounded-lg px-2 py-1 text-sm text-exit hover:bg-exit/10"
                >
                  מחיקה
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
