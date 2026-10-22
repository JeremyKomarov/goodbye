import { useTranslations } from "next-intl";
import {
  STATUS_STORIES_NAMESPACE, statusStoriesKeys,
} from "@/features/room/components/StatusStories/StatusStories.keys.const";
import { STORY_DISC_SIZES, StoryDisc } from "@/features/room/components/StoryDisc";
import { storyViewerClasses } from "@/features/room/components/StoryViewer/StoryViewer.classes";
import { STORY_GROUPS } from "@/features/room/content/stories.const";
import { useSeenStories } from "@/features/room/hooks/useSeenStories";
import { Button, BUTTON_VARIANTS } from "@/shared/components/Button";
import { cn } from "@/shared/utils/cn";

/** Every group, so the header's ring is never a dead end into the first one. */
export function StoryGroupNav({
  current,
  onPick,
}: {
  current: number;
  onPick: (group: number) => void;
}) {
  const t = useTranslations(STATUS_STORIES_NAMESPACE);
  const seen = useSeenStories();

  return (
    <nav className={storyViewerClasses.groups} aria-label={t(statusStoriesKeys.all)}>
      {STORY_GROUPS.map((group, index) => (
        <Button
          key={group.id}
          variant={BUTTON_VARIANTS.bare}
          aria-label={t(statusStoriesKeys.groups[group.id].title)}
          aria-current={index === current || undefined}
          className={cn(storyViewerClasses.group, index === current && storyViewerClasses.current)}
          onClick={() => onPick(index)}
        >
          <StoryDisc
            color={group.color}
            isSeen={seen.includes(group.id)}
            size={STORY_DISC_SIZES.sm}
          >
            {group.emoji}
          </StoryDisc>
        </Button>
      ))}
    </nav>
  );
}
