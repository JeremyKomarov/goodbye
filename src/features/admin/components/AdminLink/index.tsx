"use client";

import { useTranslations } from "next-intl";
import { ADMIN_NAMESPACE, adminKeys } from "@/features/admin/strings/admin.keys.const";
import { CopyButton } from "@/shared/components/CopyButton";
import { isolate } from "@/shared/utils/isolate";
import { whatsappLink } from "@/shared/utils/whatsapp";
import { adminLinkClasses } from "./AdminLink.classes";

/** The host's own admin link, to copy or send to themselves — never to the group. */
export function AdminLink({ adminUrl, groupName }: { adminUrl: string; groupName: string }) {
  const t = useTranslations(ADMIN_NAMESPACE);
  const message = t(adminKeys.link.message, { group: isolate(groupName), url: adminUrl });

  return (
    <section className={adminLinkClasses.root}>
      <h2 className={adminLinkClasses.title}>{t(adminKeys.link.title)}</h2>
      <p className={adminLinkClasses.help}>{t(adminKeys.link.help)}</p>
      <div className={adminLinkClasses.row}>
        <span dir="ltr" className={adminLinkClasses.url}>
          {adminUrl}
        </span>
        <CopyButton text={adminUrl} />
      </div>
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noreferrer"
        className={adminLinkClasses.send}
      >
        {t(adminKeys.link.send)}
      </a>
    </section>
  );
}
