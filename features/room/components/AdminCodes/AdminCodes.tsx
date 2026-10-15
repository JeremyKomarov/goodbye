"use client";

import { CopyButton } from "@/components/ui/CopyButton/CopyButton";
import { adminLinkMessage, whatsappLink } from "@/core/share";
import { PlayerCodes } from "@/features/room/components/PlayerCodes/PlayerCodes";
import styles from "./AdminCodes.module.scss";

export function AdminCodes({ slug, token, groupName, adminUrl }: { slug: string; token: string; groupName: string; adminUrl: string }) {
  return <>
    <div className={styles.view17}>
      <div className={styles.view18}>
        <h2 className={styles.view19}>קישור הניהול שלך</h2>
        <p className={styles.view12}>
          כדי לנהל את החדר ממכשיר אחר, שולחים את הקישור לעצמך. מי שיש לו אותו
          יכול לנעול את ההצבעה ולסמן יציאה, אז לא לשלוח לקבוצה.
        </p>
        <div className={styles.view20}>
          <span dir="ltr" className={styles.view21}>{adminUrl}</span>
          <CopyButton text={adminUrl} />
        </div>
        <a href={whatsappLink(adminLinkMessage(groupName, adminUrl))} target="_blank" rel="noreferrer" className={styles.view22}>
          שליחה לעצמי בוואטסאפ
        </a>
      </div>
    </div>
    <div className={styles.view23}><PlayerCodes slug={slug} token={token} /></div>
  </>;
}
