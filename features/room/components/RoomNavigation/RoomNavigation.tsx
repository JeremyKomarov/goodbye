"use client";

import styles from "./RoomNavigation.module.scss";
import { motion } from "motion/react";
import type { ReactNode } from "react";

export type Tab = "vote" | "games" | "wall" | "board";

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
      className={[styles.view16, className, ""].filter(Boolean).join(" ")}
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
    <span className={styles.view17}>
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
      className={styles.view18}
    >
      <div className={styles.view19}>
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              aria-current={active ? "page" : undefined}
              className={[styles.view20, active ? styles.view21 : styles.view8, ""].filter(Boolean).join(" ")}
            >
              <span className={styles.view22}>
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    className={styles.view23}
                    transition={{ type: "spring", damping: 26, stiffness: 380 }}
                  />
                )}
                <TabIcon tab={t.id} />
                {t.id === "wall" && unread > 0 && (
                  <span className={styles.view24}>
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
    <nav aria-label="ניווט בחדר" className={[styles.view25, className, ""].filter(Boolean).join(" ")}>
      {TABS.map((t) => {
        const active = t.id === tab;
        const summary = summaries[t.id];
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            aria-current={active ? "page" : undefined}
            className={[styles.view26, active ? styles.view27 : styles.view28, ""].filter(Boolean).join(" ")}
          >
            <span
              className={[styles.view29, active ? styles.view30 : styles.view31, ""].filter(Boolean).join(" ")}
            >
              <TabIcon tab={t.id} />
            </span>
            <span className={styles.view32}>
              <span className={styles.view33}>
                <span className={styles.view34}>{t.label}</span>
                {summary.meta && (
                  <span
                    className={[styles.view35, t.id === "wall" && unread ? styles.view7 : styles.view8, ""].filter(Boolean).join(" ")}
                  >
                    {summary.meta}
                  </span>
                )}
              </span>
              <span className={styles.view36}>
                <span
                  className={[styles.view37, summary.highlight ? styles.view7 : styles.view8, ""].filter(Boolean).join(" ")}
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
    <div className={styles.view38}>
      <span className={styles.view39}>
        <TabIcon tab={tab} className={styles.view15} />
      </span>
      <div className={styles.view40}>
        <h2 className={styles.view41}>
          {TABS.find((t) => t.id === tab)!.label}
        </h2>
        <p
          className={[styles.view6, highlight ? styles.view7 : styles.view8, ""].filter(Boolean).join(" ")}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}
