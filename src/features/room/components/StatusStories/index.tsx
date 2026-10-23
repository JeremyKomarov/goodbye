"use client";

import { useTranslations } from "next-intl";
import type { StoryPosition } from "@/features/room/content/stories.const";
import { STORY_DISC_SIZES, StoryDisc } from "@/features/room/components/StoryDisc";
import { useRoomContext } from "@/features/room/hooks/useRoomContext";
import { useSeenStories } from "@/features/room/hooks/useSeenStories";
import { Button, BUTTON_VARIANTS } from "@/shared/components/Button";
import { cn } from "@/shared/utils/cn";
import { statusStoriesClasses } from "./StatusStories.classes";
import { STATUS_STORIES_NAMESPACE, statusStoriesKeys } from "./StatusStories.keys.const";

/** The room's story groups as a strip of status rings; a tap opens the viewer at that group. */
export function StatusStories({ onOpen }: { onOpen: (start: StoryPosition) => void }) {
  const t = useTranslations(STATUS_STORIES_NAMESPACE);
  const { stories } = useRoomContext();
  const seen = useSeenStories();

  return (
    <section className={statusStoriesClasses.root} aria-label={t(statusStoriesKeys.label)}>
      {stories.map((group, index) => {
        const isSeen = seen.includes(group.id);
        return (
          <Button
            key={group.id}
            variant={BUTTON_VARIANTS.bare}
            className={statusStoriesClasses.item}
            onClick={() => onOpen({ group: index, fact: 0 })}
          >
            <StoryDisc color={group.color} isSeen={isSeen} size={STORY_DISC_SIZES.lg}>
              {group.emoji}
            </StoryDisc>
            <span className={cn(statusStoriesClasses.title, isSeen && statusStoriesClasses.seen)}>
              {t(statusStoriesKeys.groups[group.id].title)}
            </span>
          </Button>
        );
      })}
    </section>
  );
}
