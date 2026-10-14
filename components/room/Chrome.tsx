"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { initial } from "@/lib/colors";
import { pad, splitCountdown } from "@/lib/hebrew";
import type { OnlineUser, Typer } from "@/lib/hooks/useRoom";
import type { Room } from "@/lib/types";

export type Tab = "vote" | "games" | "wall" | "board";

type HeaderProps = {
  room: Room;
  now: number;
  online: OnlineUser[];
  typers: Typer[];
  showClock: boolean;
  adminHref: string | null;
  onParty: () => void;
};

function compactClock(room: Room, now: number) {
  if (!now || room.status === "exited") return null;
  const target =
    room.status === "locked" && room.locked_slot
      ? Date.parse(room.locked_slot)
      : Date.parse(room.voting_closes_at);
  if (target <= now) return null;
  const { days, hours, minutes, seconds } = splitCountdown(target - now);
  if (days > 0) return days === 1 ? "עוד יום" : `עוד ${days} ימים`;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/** The chat header: group avatar, name, live subtitle. */
export function RoomHeader({
  room,
  now,
  online,
  typers,
  showClock,
  adminHref,
  onParty,
}: HeaderProps) {
  const clock = showClock ? compactClock(room, now) : null;

  return (
    <header className="sticky top-0 z-30 bg-panel/95 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="flex items-center gap-3 px-3 py-2.5">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-kraft font-display text-2xl font-bold text-night">
          {initial(room.group_name)}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-semibold leading-tight">
            {room.group_name}
          </h1>
          <p
            className={`truncate text-xs ${typers.length ? "text-signal" : "text-mute"}`}
            aria-live="polite"
          >
            {typers.length === 1
              ? `${typers[0].name} מקליד/ה…`
              : typers.length > 1
                ? `${typers.length} אנשים מקלידים…`
                : online.length > 0
                  ? `${online.length} מחוברים עכשיו`
                  : "מתחברים…"}
          </p>
        </div>
        {clock && (
          <span
            dir="ltr"
            className={`rounded-full bg-raised px-2.5 py-1 text-xs font-medium tabular-nums ${room.status === "locked" ? "text-exit" : "text-ink"}`}
          >
            {clock}
          </span>
        )}
        <motion.button
          type="button"
          whileTap={{ scale: 1.3, rotate: -12 }}
          onClick={onParty}
          aria-label="גשם של 🎉 לכל מי שבחדר"
          className="grid size-10 place-items-center rounded-full text-xl hover:bg-raised"
        >
          🎉
        </motion.button>
        {adminHref && (
          <Link
            href={adminHref}
            aria-label="ניהול החדר"
            className="grid size-10 place-items-center rounded-full text-mute hover:bg-raised"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
            </svg>
          </Link>
        )}
      </div>
    </header>
  );
}

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: "vote",
    label: "הצבעה",
    icon: <path d="M4 20h16M7 16V9m5 7V5m5 11v-4" />,
  },
  {
    id: "games",
    label: "משחקים",
    icon: (
      <>
        <rect x="2.5" y="7" width="19" height="11" rx="5" />
        <path d="M7.5 10.5v4M5.5 12.5h4M15.5 12h.01M18 14h.01" />
      </>
    ),
  },
  {
    id: "wall",
    label: "קיר פרידה",
    icon: <path d="M20 12a8 8 0 0 1-11.7 7.1L4 20l1-4A8 8 0 1 1 20 12Z" />,
  },
  {
    id: "board",
    label: "טבלה",
    icon: (
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM17 6h3a3 3 0 0 1-3 3M7 6H4a3 3 0 0 0 3 3" />
    ),
  },
];

export function TabBar({
  tab,
  onChange,
  unread,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
  unread: number;
}) {
  return (
    <nav
      aria-label="ניווט בחדר"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line/60 bg-panel/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <div className="mx-auto grid max-w-md grid-cols-4">
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              aria-current={active ? "page" : undefined}
              className={`flex h-[4.25rem] flex-col items-center justify-center gap-1 text-xs ${active ? "font-semibold text-ink" : "text-mute"}`}
            >
              <span className="relative grid h-8 w-16 place-items-center">
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-bubble"
                    transition={{ type: "spring", damping: 26, stiffness: 380 }}
                  />
                )}
                <svg
                  viewBox="0 0 24 24"
                  className="relative size-[22px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {t.icon}
                </svg>
                {t.id === "wall" && unread > 0 && (
                  <span className="absolute -top-1 left-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-signal px-1 text-[11px] font-bold text-night">
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
              </span>
              {t.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
