"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { StoryRing } from "@/components/room/StatusStories";
import { initial } from "@/lib/colors";
import { iso, onlineLabel, pad, splitCountdown } from "@/lib/hebrew";
import type { Me, OnlineUser, Typer } from "@/lib/hooks/useRoom";
import type { Room } from "@/lib/types";

export type Tab = "vote" | "games" | "wall" | "board";

function typingLine(typers: Typer[]) {
  if (typers.length === 1) return `${iso(typers[0].name)} מקליד/ה…`;
  if (typers.length > 1) return `${typers.length} אנשים מקלידים…`;
  return null;
}

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

type HeaderProps = {
  room: Room;
  now: number;
  me: Me | null;
  /** Opens "your name" (rename, or "not you?"). Not offered to the host. */
  onMe?: () => void;
  online: OnlineUser[];
  typers: Typer[];
  showClock: boolean;
  adminHref: string | null;
  onParty: () => void;
};

/** The chat header: group avatar, name, live subtitle (who you are and who's here). */
export function RoomHeader({
  room,
  now,
  me,
  onMe,
  online,
  typers,
  showClock,
  adminHref,
  onParty,
}: HeaderProps) {
  const typing = typingLine(typers);
  const clock = showClock ? compactClock(room, now) : null;
  const presence = online.length > 0 ? onlineLabel(online.length) : "מתחברים…";

  return (
    <header className="shrink-0 bg-panel pt-[env(safe-area-inset-top)]">
      <div className="flex h-16 items-center gap-3 px-3 tiny:h-12">
        {/* Like a contact with a status: the ring opens the fun-fact stories. */}
        <StoryRing>
          <span className="grid size-full place-items-center rounded-full bg-kraft font-display text-2xl font-bold text-night">
            {initial(room.group_name)}
          </span>
        </StoryRing>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-semibold leading-tight">
            {room.group_name}
          </h1>
          <p
            className={`truncate text-xs ${typing ? "text-signal" : "text-mute"}`}
            aria-live="polite"
          >
            {typing ??
              (me ? (
                <>
                  {onMe ? (
                    <button
                      type="button"
                      onClick={onMe}
                      title="שינוי שם"
                      className="underline decoration-dotted underline-offset-2 hover:text-ink"
                    >
                      שלום {iso(me.name)}
                    </button>
                  ) : (
                    `שלום ${iso(me.name)}`
                  )}
                  {` · ${presence}`}
                </>
              ) : (
                presence
              ))}
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
          title="גשם של 🎉 לכל מי שבחדר"
          className="grid size-10 shrink-0 place-items-center rounded-full text-xl hover:bg-raised"
        >
          🎉
        </motion.button>
        {adminHref && (
          <Link
            href={adminHref}
            aria-label="ניהול החדר (רק את/ה רואה את זה)"
            title="ניהול החדר. רק את/ה רואה את זה, כי פתחת את החדר בדפדפן הזה"
            className="grid size-10 shrink-0 place-items-center rounded-full text-mute hover:bg-raised"
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

export const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
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

function TabIcon({
  tab,
  className = "size-[22px]",
}: {
  tab: Tab;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`relative ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {TABS.find((t) => t.id === tab)!.icon}
    </svg>
  );
}

function Badge({ count }: { count: number }) {
  return (
    <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-signal px-1 text-[11px] font-bold text-night">
      {count > 99 ? "99+" : count}
    </span>
  );
}

/** Bottom navigation on phones and tablets. */
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
      className="shrink-0 border-t border-line/60 bg-panel pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="grid grid-cols-4">
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              aria-current={active ? "page" : undefined}
              className={`flex h-16 flex-col items-center justify-center gap-1 text-xs tiny:h-12 tiny:flex-row tiny:gap-1.5 ${active ? "font-semibold text-ink" : "text-mute"}`}
            >
              <span className="relative grid h-8 w-16 place-items-center tiny:w-12">
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-bubble"
                    transition={{ type: "spring", damping: 26, stiffness: 380 }}
                  />
                )}
                <TabIcon tab={t.id} />
                {t.id === "wall" && unread > 0 && (
                  <span className="absolute -top-1 left-2">
                    <Badge count={unread} />
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

export type SectionSummary = {
  subtitle: string;
  meta?: string;
  highlight?: boolean;
};

/** Desktop: the sections as a WhatsApp Web chat list, each with a live preview line. */
export function SideNav({
  tab,
  onChange,
  unread,
  summaries,
  className = "",
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
  unread: number;
  summaries: Record<Tab, SectionSummary>;
  className?: string;
}) {
  return (
    <nav aria-label="ניווט בחדר" className={`flex flex-col ${className}`}>
      {TABS.map((t) => {
        const active = t.id === tab;
        const summary = summaries[t.id];
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            aria-current={active ? "page" : undefined}
            className={`flex w-full items-center gap-3 px-3 text-start transition-colors ${active ? "bg-raised" : "hover:bg-raised/50"}`}
          >
            <span
              className={`grid size-12 shrink-0 place-items-center rounded-full ${active ? "bg-bubble text-ink" : "bg-raised text-mute"}`}
            >
              <TabIcon tab={t.id} />
            </span>
            <span className="min-w-0 flex-1 border-b border-line/50 py-3.5 short:py-2.5">
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-medium">{t.label}</span>
                {summary.meta && (
                  <span
                    className={`shrink-0 text-xs ${t.id === "wall" && unread ? "text-signal" : "text-mute"}`}
                  >
                    {summary.meta}
                  </span>
                )}
              </span>
              <span className="mt-0.5 flex items-center justify-between gap-2">
                <span
                  className={`truncate text-sm ${summary.highlight ? "text-signal" : "text-mute"}`}
                >
                  {summary.subtitle}
                </span>
                {t.id === "wall" && unread > 0 && <Badge count={unread} />}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/** Desktop: header of the main pane, like the open chat's header in WhatsApp Web. */
export function PaneHeader({
  tab,
  subtitle,
  highlight,
}: {
  tab: Tab;
  subtitle: string;
  highlight?: boolean;
}) {
  return (
    <div className="hidden h-16 shrink-0 items-center gap-3 border-b border-line/60 bg-panel px-4 lg:flex">
      <span className="grid size-10 place-items-center rounded-full bg-raised text-mute">
        <TabIcon tab={tab} className="size-5" />
      </span>
      <div className="min-w-0">
        <h2 className="font-semibold leading-tight">
          {TABS.find((t) => t.id === tab)!.label}
        </h2>
        <p
          className={`truncate text-xs ${highlight ? "text-signal" : "text-mute"}`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}
