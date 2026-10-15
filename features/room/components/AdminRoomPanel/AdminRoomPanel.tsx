"use client";

import styles from "./AdminRoomPanel.module.scss";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { type AdminResult, deleteWallMessage, lockVoting, markExited, reopenVoting, undoExit } from "@/app/r/[slug]/admin/actions";
import { AdminCodes } from "@/features/room/components/AdminCodes/AdminCodes";
import { AdminWall } from "@/features/room/components/AdminWall/AdminWall";
import { ShareMessages } from "@/features/room/components/ShareMessages/ShareMessages";
import { forgetAdminToken } from "@/core/admin-storage";
import { formatHour, formatSlot } from "@/core/hebrew";
import type { ExitStats } from "@/core/share";
import { getBrowserClient } from "@/core/supabase/browser";
import type { Room, WallMessage } from "@/core/types";
import { exitQuestion, loadExitStats, toLocalInput } from "@/features/room/content/adminRoom";

type AdminTab = "manage" | "codes";
const ADMIN_TABS: { id: AdminTab; label: string }[] = [
  { id: "manage", label: "ניהול" },
  { id: "codes", label: "קודים לכניסה" },
];

export function AdminRoomPanel({
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
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [closeLocal, setCloseLocal] = useState(() =>
    toLocalInput(
      Math.max(Date.now() + 3_600_000, Date.parse(room.voting_closes_at)),
    ),
  );
  const [messages, setMessages] = useState<WallMessage[]>([]);
  const [share, setShare] = useState<{
    stats: ExitStats;
    drawn: boolean;
  } | null>(null);
  const [origin] = useState(() => window.location.origin);
  const [tab, setTab] = useState<AdminTab>("manage");
  const tz = room.timezone;
  const adminUrl = `${origin}/r/${slug}/admin#k=${token}`;

  useEffect(() => {
    let cancelled = false;
    loadExitStats(room).then((result) => !cancelled && setShare(result));
    return () => {
      cancelled = true;
    };
  }, [room]);

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
    // Phones scroll the whole panel; desktop keeps the title still and scrolls each column on its own.
    <main className={styles.view5}>
      <div className={styles.view6}>
        <div className={styles.view7}>
          <div className={styles.view8}>
            <Link href={`/r/${slug}`} className={styles.view9}>
              חזרה לחדר
            </Link>
            <h1 className={styles.view10}>
              ניהול החדר
            </h1>
            <p className={styles.view11}>{room.group_name}</p>
            <p className={styles.view12}>
              רק מי שיש לו את קישור הניהול רואה את הדף הזה. לא לשלוח אותו
              לקבוצה.
            </p>
            <div
              role="tablist"
              aria-label="דף הניהול"
              className={styles.view13}
            >
              {ADMIN_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={[styles.view14, tab === t.id ? styles.view15 : styles.view16, ""].filter(Boolean).join(" ")}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {tab === "codes" && <AdminCodes slug={slug} token={token} groupName={room.group_name} adminUrl={adminUrl} />}

          {tab === "manage" && (
            <>
              <div className={styles.view17}>
                <div className={styles.view18}>
                  <p className={styles.view24}>מצב עכשיו</p>
                  <p className={styles.view25}>{statusLine}</p>
                </div>

                {error && (
                  <p
                    role="alert"
                    className={styles.view26}
                  >
                    {error}
                  </p>
                )}

                {room.status !== "exited" && (
                  <div className={styles.view18}>
                    <p className={styles.view27}>
                      {room.status === "locked"
                        ? "כשהשעה מגיעה: שולחים הודעת פרידה (למטה), יוצאים מהקבוצה בוואטסאפ, ואז לוחצים כאן (או על השורה האדומה בחדר). כל מי שבחדר יראה את זה בזמן אמת."
                        : "אפשר לצאת כבר עכשיו, באמצע ההצבעה. ההצבעה תיסגר בלי שעה, וכולם יראו שלא חיכית לתוצאה."}
                    </p>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      disabled={pending}
                      onClick={() =>
                        run(() => markExited(slug, token), exitQuestion(room))
                      }
                      className={styles.view28}
                    >
                      יצאתי מהקבוצה
                    </motion.button>
                  </div>
                )}

                {share && (
                  <div className={styles.view18}>
                    <h2 className={styles.view29}>
                      {room.status === "exited"
                        ? "הודעת הפרידה"
                        : "שליחה לקבוצה"}
                    </h2>
                    <ShareMessages
                      room={room}
                      url={`${origin}/r/${slug}`}
                      stats={share.stats}
                      drawn={share.drawn}
                    />
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
                    className={styles.view30}
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
                        room.locked_slot
                          ? "לבטל את היציאה ולחזור לספירה לאחור?"
                          : "לבטל את היציאה? ההצבעה תיפתח שוב.",
                      )
                    }
                    className={styles.view30}
                  >
                    ביטול היציאה
                  </button>
                ) : (
                  <div className={styles.view18}>
                    <label
                      htmlFor="reopen"
                      className={styles.view31}
                    >
                      {room.status === "voting"
                        ? "לשנות מתי נסגרת ההצבעה"
                        : "לפתוח את ההצבעה מחדש, עד"}
                    </label>
                    <input
                      id="reopen"
                      type="datetime-local"
                      value={closeLocal}
                      onChange={(e) => setCloseLocal(e.target.value)}
                      className={styles.view32}
                    />
                    <button
                      type="button"
                      disabled={pending || !closeLocal}
                      onClick={() =>
                        run(() =>
                          reopenVoting(
                            slug,
                            token,
                            new Date(closeLocal).toISOString(),
                          ),
                        )
                      }
                      className={styles.view33}
                    >
                      {room.status === "voting"
                        ? "עדכון זמן הסגירה"
                        : "פתיחה מחדש"}
                    </button>
                  </div>
                )}

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      forgetAdminToken(slug);
                      router.push(`/r/${slug}`);
                    }}
                    className={styles.view34}
                  >
                    לשכוח את הניהול במכשיר הזה
                  </button>
                  <p className={styles.view35}>
                    למחשב משותף. אפשר לחזור לניהול בכל רגע עם קישור הניהול.
                  </p>
                </div>
              </div>

              <AdminWall messages={messages} pending={pending} onRefresh={loadMessages} onDelete={(message) => run(async () => { const result = await deleteWallMessage(slug, token, message.id); if (result.ok) setMessages((prev) => prev.filter((item) => item.id !== message.id)); return result; }, "למחוק את ההודעה?")} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
