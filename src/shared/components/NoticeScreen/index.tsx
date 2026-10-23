import Link from "next/link";
import type { ReactNode } from "react";
import { SystemPill } from "@/shared/components/SystemPill";
import { noticeScreenClasses } from "./NoticeScreen.classes";

interface NoticeScreenProps {
  /** The pill: what happened, in a few words. */
  title: string;
  /** The line under it: why, or what to do. */
  why: string;
  /** Where to go instead, drawn as the primary button. */
  link: { href: string; label: string };
  /** An action beside the link — a Button. */
  action?: ReactNode;
}

/** A whole page that only says something went wrong and where to go: a dead link, a crash. */
export function NoticeScreen({ title, why, link, action }: NoticeScreenProps) {
  return (
    <main className={noticeScreenClasses.root}>
      <SystemPill>{title}</SystemPill>
      <p className={noticeScreenClasses.why}>{why}</p>
      <div className={noticeScreenClasses.actions}>
        {action}
        <Link href={link.href} className={noticeScreenClasses.link}>
          {link.label}
        </Link>
      </div>
    </main>
  );
}
