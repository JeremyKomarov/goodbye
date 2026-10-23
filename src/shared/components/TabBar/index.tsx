"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { cn } from "@/shared/utils/cn";
import { tabBarClasses } from "./TabBar.classes";
import { TAB_BAR_VARIANTS } from "./TabBar.const";
import { TAB_BAR_NAMESPACE, tabBarKeys } from "./TabBar.keys.const";
import type { TabBarItem, TabBarProps } from "./TabBar.types";

const BADGE_CAP = 99;

const isCurrent = (item: TabBarItem, pathname: string) =>
  item.href === pathname || (!!item.hasNested && pathname.startsWith(`${item.href}/`));

/**
 * Navigation between sibling routes; the link matching the URL is the current one. A bottom bar
 * on a phone (`bar`), or a chat list with each section's live line on a wide screen (`list`).
 */
export function TabBar({ items, label, variant = TAB_BAR_VARIANTS.bar, className }: TabBarProps) {
  const t = useTranslations(TAB_BAR_NAMESPACE);
  const pathname = usePathname();
  const isList = variant === TAB_BAR_VARIANTS.list;
  const badge = (count: number) => (
    <span className={tabBarClasses.badge} dir="ltr" aria-hidden>
      {count > BADGE_CAP ? `${BADGE_CAP}+` : count}
    </span>
  );

  return (
    <nav
      className={cn(tabBarClasses.root, tabBarClasses.variant[variant], className)}
      aria-label={label}
    >
      <ul className={tabBarClasses.list}>
        {items.map((item: TabBarItem) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={tabBarClasses.link}
              aria-current={isCurrent(item, pathname) ? "page" : undefined}
            >
              <span className={tabBarClasses.glyph}>
                <Icon name={item.icon} />
                {!isList && !!item.badge && badge(item.badge)}
              </span>
              {isList ? (
                <span className={tabBarClasses.text}>
                  <span className={tabBarClasses.line}>
                    <span className={tabBarClasses.label}>{item.label}</span>
                    {item.meta && <span className={tabBarClasses.meta}>{item.meta}</span>}
                  </span>
                  <span className={tabBarClasses.line}>
                    <span className={cn(tabBarClasses.subtitle, item.isLive && tabBarClasses.live)}>
                      {item.subtitle}
                    </span>
                    {!!item.badge && badge(item.badge)}
                  </span>
                </span>
              ) : (
                item.label
              )}
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

export { TAB_BAR_VARIANTS, type TabBarItem };
export type { TabBarVariant } from "./TabBar.const";
