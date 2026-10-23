"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState, type CSSProperties } from "react";
import { StoryPlayer } from "@/features/room/components/StoryPlayer";
import type { Wall } from "@/features/room/types/wall.types";
import { reactionCounts } from "@/features/room/utils/reactions";
import { senderColor } from "@/shared/utils/avatar";
import { cn } from "@/shared/utils/cn";
import { goodbyeReplayClasses } from "./GoodbyeReplay.classes";
import { REPLAY_BARS_MAX, REPLAY_SHORT_CHARS, replayMs } from "./GoodbyeReplay.const";
import { GOODBYE_REPLAY_NAMESPACE, goodbyeReplayKeys } from "./GoodbyeReplay.keys.const";

/**
 * The goodbyes played back, oldest first, one at a time in the `StoryPlayer`, each over its
 * sender's colour; it closes after the last. The caller opens it only when there is one.
 */
export function GoodbyeReplay({ wall, onClose }: { wall: Wall; onClose: () => void }) {
  const t = useTranslations(GOODBYE_REPLAY_NAMESPACE);
  const [at, setAt] = useState(0);
  const { messages } = wall;
  const total = messages.length;
  const message = messages[Math.min(at, total - 1)];

  const forward = useCallback(() => {
    if (at + 1 < total) setAt(at + 1);
    else onClose();
  }, [at, total, onClose]);
  const back = useCallback(() => setAt((current) => Math.max(0, current - 1)), []);

  const color = senderColor(message.userId);
  const hasBars = total <= REPLAY_BARS_MAX;
  const reactions = reactionCounts(wall.reactions[message.id]);

  return (
    <StoryPlayer
      title={t(goodbyeReplayKeys.title)}
      color={color}
      count={hasBars ? total : 1}
      current={hasBars ? at : 0}
      slideKey={String(message.id)}
      durationMs={replayMs(message.body)}
      onForward={forward}
      onBack={back}
      onClose={onClose}
      labels={{
        previous: t(goodbyeReplayKeys.previous),
        next: t(goodbyeReplayKeys.next),
        hint: t(goodbyeReplayKeys.counter, { current: at + 1, total }),
      }}
    >
      <figure
        className={goodbyeReplayClasses.root}
        style={{ "--sender-color": color } as CSSProperties}
      >
        <figcaption className={goodbyeReplayClasses.name}>
          <bdi>{message.name}</bdi>
        </figcaption>
        <blockquote
          dir="auto"
          className={cn(
            goodbyeReplayClasses.body,
            message.body.length <= REPLAY_SHORT_CHARS && goodbyeReplayClasses.short,
          )}
        >
          {message.body}
        </blockquote>
        {reactions.length > 0 && (
          <p className={goodbyeReplayClasses.reactions}>
            {reactions.map(({ emoji, count }) => (
              <span key={emoji}>
                {emoji} {count}
              </span>
            ))}
          </p>
        )}
      </figure>
    </StoryPlayer>
  );
}
