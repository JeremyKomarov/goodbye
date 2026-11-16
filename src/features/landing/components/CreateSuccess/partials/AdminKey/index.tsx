import { useId } from "react";
import { Icon, ICON_NAMES } from "@/shared/components/Icon";
import { LinkRow } from "@/features/landing/components/CreateSuccess/partials/LinkRow";
import { adminKeyClasses } from "./AdminKey.classes";

/**
 * The admin link, shown this once: set apart in the warning tone, because it is the one thing on
 * the card the group must not get, and the only way back to the host's controls from elsewhere.
 */
export function AdminKey({ title, why, url }: { title: string; why: string; url: string }) {
  const titleId = useId();
  return (
    <section className={adminKeyClasses.root} aria-labelledby={titleId}>
      <h3 id={titleId} className={adminKeyClasses.title}>
        <Icon name={ICON_NAMES.key} className={adminKeyClasses.icon} />
        {title}
      </h3>
      <p className={adminKeyClasses.why}>{why}</p>
      <LinkRow url={url} />
    </section>
  );
}
