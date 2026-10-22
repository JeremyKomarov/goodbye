import type { Route } from "next";
import type { IconName } from "@/shared/components/Icon";
import type { TabBarVariant } from "./TabBar.const";

export interface TabBarItem {
  href: Route;
  icon: IconName;
  /** Already translated. */
  label: string;
  /** Unread count; nothing is shown at 0. */
  badge?: number;
  /** `list` only: the section's live line — the last message, who's leading. Already translated. */
  subtitle?: string;
  /** `list` only: a short note beside the label — a time, a count. */
  meta?: string;
  /** `list` only: the subtitle in the brand colour — someone is typing. */
  isLive?: boolean;
}

export interface TabBarProps {
  items: readonly TabBarItem[];
  /** Already translated; names the navigation landmark. */
  label: string;
  variant?: TabBarVariant;
  className?: string;
}
