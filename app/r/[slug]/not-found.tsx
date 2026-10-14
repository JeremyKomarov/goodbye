import Link from "next/link";
import { SystemPill } from "@/components/ui/SystemPill";

export default function RoomNotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
      <SystemPill className="text-base">הקישור הזה כבר לא תקף</SystemPill>
      <p className="text-ink/80">לא מצאנו חדר בכתובת הזו. אולי הקישור נחתך כשהעתיקו אותו?</p>
      <Link href="/" className="rounded-2xl bg-exit px-6 py-3.5 font-semibold text-night">
        פתיחת חדר חדש
      </Link>
    </main>
  );
}
