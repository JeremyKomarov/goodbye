"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import {
  STATUS_STORIES_NAMESPACE, statusStoriesKeys,
} from "@/features/room/components/StatusStories/StatusStories.keys.const";
import { StoryDisc } from "@/features/room/components/StoryDisc";
import type { StoryPosition } from "@/features/room/content/stories.const";
import { useRoomContext } from "@/features/room/hooks/useRoomContext";
import { useSeenStories } from "@/features/room/hooks/useSeenStories";
import { Button, BUTTON_VARIANTS } from "@/shared/components/Button";

/**
 * The header's avatar in a status ring, like a contact with a new status: it opens the first
 * group not yet watched, and goes grey once all of them have been.
 */
export function StoryRing({
  onOpen,
  children,
}: {
  onOpen: (start: StoryPosition) => void;
  children: ReactNode;
}) {
  const t = useTranslations(STATUS_STORIES_NAMESPACE);
  const { stories } = useRoomContext();
  const seen = useSeenStories();
  const next = stories.findIndex((group) => !seen.includes(group.id));

  return (
    <Button
      variant={BUTTON_VARIANTS.bare}
      aria-label={t(statusStoriesKeys.label)}
      title={t(statusStoriesKeys.label)}
      onClick={() => onOpen({ group: Math.max(0, next), fact: 0 })}
    >
      <StoryDisc color="var(--brand-500)" fill="var(--accent-kraft)" isSeen={next === -1}>
        {children}
      </StoryDisc>
    </Button>
  );
}
