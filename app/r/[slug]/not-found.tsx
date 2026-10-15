import styles from "./not-found.module.scss";
import Link from "next/link";
import { SystemPill } from "@/components/ui/SystemPill/SystemPill";

export default function RoomNotFound() {
  return (
    <main className={styles.view1}>
      <SystemPill className={styles.view2}>הקישור הזה כבר לא תקף</SystemPill>
      <p className={styles.view3}>לא מצאנו חדר בכתובת הזו. אולי הקישור נחתך כשהעתיקו אותו?</p>
      <Link href="/" className={styles.view4}>
        פתיחת חדר חדש
      </Link>
    </main>
  );
}
