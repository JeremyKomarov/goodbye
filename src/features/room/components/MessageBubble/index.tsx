"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { REACTION_EMOJIS } from "@/core/constants/room.const";
import { reactionCounts } from "@/features/room/utils/reactions";
import { Bubble, BUBBLE_SIDES } from "@/shared/components/Bubble";
import { Button, BUTTON_SIZES, BUTTON_VARIANTS } from "@/shared/components/Button";
import { ICON_NAMES } from "@/shared/components/Icon";
import { Ticks } from "@/shared/components/Ticks";
import { senderColor } from "@/shared/utils/avatar";
import { cn } from "@/shared/utils/cn";
import { messageBubbleClasses } from "./MessageBubble.classes";
import { MESSAGE_BUBBLE_NAMESPACE, messageBubbleKeys } from "./MessageBubble.keys.const";
import type { MessageBubbleProps } from "./MessageBubble.types";

/** A goodbye on the wall, its reactions, and the picker to add yours. */
export function MessageBubble(props: MessageBubbleProps) {
  const { message, isFollowUp, isMine, hostGender, time, reactions } = props;
  const { mine: myReaction, isPicking, onPicking, onReact } = reactions;
  const t = useTranslations(MESSAGE_BUBBLE_NAMESPACE);
  const chips = reactionCounts(reactions.byUser);
  const canReact = myReaction !== null;
  const toggle = (emoji: (typeof REACTION_EMOJIS)[number]) =>
    onReact(myReaction === emoji ? null : emoji);

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", damping: 24, stiffness: 320 }}
      className={cn(
        messageBubbleClasses.root,
        isMine && messageBubbleClasses.mine,
        !isFollowUp && messageBubbleClasses.spaced,
      )}
      data-reactions={message.id}
    >
      <div className={messageBubbleClasses.row}>
        <Bubble
          side={isMine ? BUBBLE_SIDES.out : BUBBLE_SIDES.in}
          hasTail={!isFollowUp}
          meta={
            <span dir="ltr">
              {time} {isMine && <Ticks />}
            </span>
          }
        >
          {!isMine && !isFollowUp && (
            <div
              className={messageBubbleClasses.name}
              style={{ "--sender-color": senderColor(message.userId) } as CSSProperties}
            >
              <bdi>{message.name}</bdi>
              {hostGender && (
                <span className={messageBubbleClasses.badge}>
                  {t(messageBubbleKeys.hostBadge, { gender: hostGender })}
                </span>
              )}
            </div>
          )}
          <p dir="auto" className={messageBubbleClasses.body}>
            {message.body}
          </p>
        </Bubble>
        {canReact && (
          <Button
            variant={BUTTON_VARIANTS.ghost}
            size={BUTTON_SIZES.sm}
            icon={ICON_NAMES.react}
            aria-label={t(messageBubbleKeys.react)}
            aria-haspopup="menu"
            aria-expanded={isPicking}
            className={messageBubbleClasses.react}
            onClick={() => onPicking(!isPicking)}
          />
        )}
        <AnimatePresence>
          {isPicking && (
            <motion.div
              role="menu"
              aria-label={t(messageBubbleKeys.react)}
              className={messageBubbleClasses.picker}
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {REACTION_EMOJIS.map((emoji) => (
                <Button
                  key={emoji}
                  role="menuitemradio"
                  aria-checked={myReaction === emoji}
                  variant={myReaction === emoji ? BUTTON_VARIANTS.secondary : BUTTON_VARIANTS.ghost}
                  size={BUTTON_SIZES.sm}
                  onClick={() => {
                    toggle(emoji);
                    onPicking(false);
                  }}
                >
                  {emoji}
                </Button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {chips.length > 0 && (
        <div className={messageBubbleClasses.chips}>
          {chips.map(({ emoji, count }) => (
            <Button
              key={emoji}
              variant={myReaction === emoji ? BUTTON_VARIANTS.secondary : BUTTON_VARIANTS.ghost}
              size={BUTTON_SIZES.sm}
              aria-pressed={myReaction === emoji}
              aria-label={t(messageBubbleKeys.chip, {
                emoji,
                count,
                mine: String(myReaction === emoji),
              })}
              disabled={!canReact}
              onClick={() => toggle(emoji)}
            >
              {emoji} {count > 1 && count}
            </Button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
