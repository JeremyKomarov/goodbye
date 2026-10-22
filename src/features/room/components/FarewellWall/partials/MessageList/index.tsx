import { AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { HostGender, ReactionEmoji } from "@/core/constants/room.const";
import { farewellWallClasses } from "@/features/room/components/FarewellWall/FarewellWall.classes";
import {
  FAREWELL_WALL_NAMESPACE, farewellWallKeys,
} from "@/features/room/components/FarewellWall/FarewellWall.keys.const";
import { MessageBubble } from "@/features/room/components/MessageBubble";
import type { Player } from "@/features/room/types/room.types";
import type { Wall } from "@/features/room/types/wall.types";
import { Button, BUTTON_VARIANTS } from "@/shared/components/Button";
import { ICON_NAMES } from "@/shared/components/Icon";

// Within this many pixels of the end counts as reading the newest message.
const AT_END_PX = 80;

interface MessageListProps {
  wall: Wall;
  me: Player | null;
  hosts: { ids: readonly string[]; gender: HostGender };
  formatTime: (ms: number) => string;
  onReact: (messageId: number, emoji: ReactionEmoji | null) => void;
  /** Above the first message: the wall's system notice. Below the last: who is typing. */
  intro: ReactNode;
  footer?: ReactNode;
}

/**
 * The messages, newest at the bottom. Follows new ones while you are at the bottom, and always
 * after your own; scrolled up, new ones wait behind the round "jump to latest" button.
 */
export function MessageList(props: MessageListProps) {
  const { wall, me, hosts, formatTime, onReact, intro, footer } = props;
  const t = useTranslations(FAREWELL_WALL_NAMESPACE);
  const { messages, reactions } = wall;
  const listRef = useRef<HTMLDivElement>(null);
  const isFollowing = useRef(true);
  const shownCount = useRef(0);
  const [isAtEnd, setIsAtEnd] = useState(true);
  const [readCount, setReadCount] = useState(0);
  // The message whose reaction picker is open.
  const [picking, setPicking] = useState<number | null>(null);
  const lastIsMine = !!me && messages.at(-1)?.userId === me.userId;
  const unseen = isAtEnd
    ? 0
    : messages.slice(readCount).filter((message) => message.userId !== me?.userId).length;

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const isFirst = shownCount.current === 0;
    shownCount.current = messages.length;
    if (isFirst || isFollowing.current || lastIsMine)
      list.scrollTo({ top: list.scrollHeight, behavior: isFirst ? "instant" : "smooth" });
  }, [messages.length, lastIsMine, footer]);

  // A tap outside the open picker, or Escape, closes it.
  useEffect(() => {
    if (picking === null) return;
    const onDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest?.(`[data-reactions="${picking}"]`)) setPicking(null);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setPicking(null);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [picking]);

  function onScroll() {
    const list = listRef.current;
    if (!list) return;
    const atEnd = list.scrollHeight - list.scrollTop - list.clientHeight < AT_END_PX;
    isFollowing.current = atEnd;
    setIsAtEnd(atEnd);
    if (atEnd) setReadCount(messages.length);
  }

  return (
    <div className={farewellWallClasses.region}>
      <div ref={listRef} onScroll={onScroll} className={farewellWallClasses.scroller}>
        <div className={farewellWallClasses.list}>
          {intro}
          {messages.length === 0 && (
            <p className={farewellWallClasses.empty}>{t(farewellWallKeys.empty)}</p>
          )}
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isFollowUp={messages[index - 1]?.userId === message.userId}
                isMine={message.userId === me?.userId}
                hostGender={hosts.ids.includes(message.userId) ? hosts.gender : null}
                time={formatTime(message.createdAt)}
                reactions={{
                  byUser: reactions[message.id],
                  mine: me ? (reactions[message.id]?.[me.userId] ?? undefined) : null,
                  isPicking: picking === message.id,
                  onPicking: (isOpen) => setPicking(isOpen ? message.id : null),
                  onReact: (emoji) => onReact(message.id, emoji),
                }}
              />
            ))}
          </AnimatePresence>
          {footer}
        </div>
      </div>
      {!isAtEnd && (
        <Button
          variant={BUTTON_VARIANTS.secondary}
          icon={ICON_NAMES.scrollDown}
          aria-label={t(farewellWallKeys.jump, { count: unseen })}
          className={farewellWallClasses.jump}
          onClick={() => {
            const list = listRef.current;
            list?.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
          }}
        >
          {unseen > 0 ? unseen : undefined}
        </Button>
      )}
    </div>
  );
}
