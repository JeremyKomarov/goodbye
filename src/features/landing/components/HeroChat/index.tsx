"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { HostGender, LeaveReason } from "@/features/landing/api/rooms.dto";
import { SystemPill } from "@/shared/components/SystemPill";
import { isolate } from "@/shared/utils/isolate";
import { heroChatClasses } from "./HeroChat.classes";
import { CHAT_SENDERS, SENDER_GENDERS } from "./HeroChat.const";
import { HERO_CHAT_NAMESPACE, heroChatKeys } from "./HeroChat.keys.const";
import { ChatHeader } from "./partials/ChatHeader";
import { ChatLine, CHAT_LINE_MOTION } from "./partials/ChatLine";
import { ClosingCountdown } from "./partials/ClosingCountdown";
import { TypingDots } from "./partials/TypingDots";
import { useChatScript } from "./useChatScript";

/**
 * The landing page's group chat. It plays `story` (`useChatScript`); a new story continues the
 * same chat with a correction. The header previews the names
 * the host is typing into the wizard, and the colleagues speak to the host in their gender.
 * To a screen reader it is one picture with a label.
 */
export function HeroChat({
  story,
  hostName,
  hostGender,
  groupName,
}: {
  story: LeaveReason;
  hostName: string;
  hostGender: HostGender;
  groupName: string;
}) {
  const t = useTranslations(HERO_CHAT_NAMESPACE);
  const { lines, typing, noticeAfter } = useChatScript(story, hostGender);

  const host = hostName.trim();
  const members = typing
    ? t(heroChatKeys.typing, {
        name: t(heroChatKeys.senders[typing]),
        gender: SENDER_GENDERS[typing],
      })
    : t(heroChatKeys.members, {
        dana: t(heroChatKeys.senders.dana),
        yossi: t(heroChatKeys.senders.yossi),
        noa: t(heroChatKeys.senders.noa),
        avi: t(heroChatKeys.senders.avi),
        host: host ? isolate(host) : t(heroChatKeys.me),
      });

  return (
    // A demonstration, not a conversation: one label to a screen reader, not every line and typing.
    <div className={heroChatClasses.root} role="img" aria-label={t(heroChatKeys.label)}>
      <ChatHeader
        title={groupName.trim() || t(heroChatKeys.group)}
        members={members}
      />
      <div aria-hidden className={heroChatClasses.scroller}>
        <div className={heroChatClasses.lines}>
          <AnimatePresence initial={false}>
            {lines.flatMap((line, index) => {
              const previous = lines[index - 1];
              // A run from one sender: only its first bubble has the tail and the name.
              const isFollowUp =
                previous?.from === line.from && previous.id !== noticeAfter;
              const shown = (
                <ChatLine
                  key={line.id}
                  from={line.from}
                  name={
                    line.from === CHAT_SENDERS.me || isFollowUp
                      ? null
                      : t(heroChatKeys.senders[line.from])
                  }
                  isFollowUp={isFollowUp}
                  text={t(line.key, {
                    not: line.not ? t(heroChatKeys.not[line.not]) : "",
                    gender: hostGender,
                  })}
                  time={line.time}
                />
              );
              if (line.id !== noticeAfter) return [shown];
              return [
                shown,
                <motion.div
                  key="system"
                  {...CHAT_LINE_MOTION}
                  className={heroChatClasses.system}
                >
                  <SystemPill>
                    {t(heroChatKeys.system)} <ClosingCountdown />
                  </SystemPill>
                </motion.div>,
              ];
            })}
          </AnimatePresence>
          {/* Outside the presence: it leaves the moment the line it stood for arrives, so the
              chat never holds both and shrinks back after. */}
          {typing && <TypingDots />}
        </div>
      </div>
    </div>
  );
}
