"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { tabBarClasses } from "./TabBar.classes";
import { TAB_BAR_NAMESPACE, tabBarKeys } from "./TabBar.keys.const";
import type { TabBarItem, TabBarProps } from "./TabBar.types";

const BADGE_CAP = 99;

/** Bottom navigation between sibling routes. The link matching the URL is the current one. */
export function TabBar({ items, label }: TabBarProps) {
  const t = useTranslations(TAB_BAR_NAMESPACE);
  const pathname = usePathname();

  return (
    <nav className={tabBarClasses.root} aria-label={label}>
      <ul className={tabBarClasses.list}>
        {items.map((item: TabBarItem) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={tabBarClasses.link}
              aria-current={item.href === pathname ? "page" : undefined}
            >
              <span className={tabBarClasses.glyph}>
                <Icon name={item.icon} />
                {item.badge ? (
                  <span className={tabBarClasses.badge} dir="ltr" aria-hidden>
                    {item.badge > BADGE_CAP ? `${BADGE_CAP}+` : item.badge}
                  </span>
                ) : null}
              </span>
              {item.label}
              {item.badge ? (
                <span className={tabBarClasses.hidden}>
                  {t(tabBarKeys.unread, { count: item.badge })}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export type { TabBarItem };
