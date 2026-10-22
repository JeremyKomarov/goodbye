import type { Route } from "next";
import type { IconName } from "@/shared/components/Icon";

export interface TabBarItem {
  href: Route;
  icon: IconName;
  /** Already translated. */
  label: string;
  /** Unread count; nothing is shown at 0. */
  badge?: number;
}

export interface TabBarProps {
  items: readonly TabBarItem[];
  /** Already translated; names the navigation landmark. */
  label: string;
}
