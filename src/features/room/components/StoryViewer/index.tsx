"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { StoryPlayer } from "@/features/room/components/StoryPlayer";
import {
  STATUS_STORIES_NAMESPACE, statusStoriesKeys,
} from "@/features/room/components/StatusStories/StatusStories.keys.const";
import { STORY_MS, type StoryGroup, type StoryPosition } from "@/features/room/content/stories.const";
import { markSeen } from "@/features/room/utils/storiesSeen";
import { StoryGroupNav } from "./partials/StoryGroupNav";
import { storyViewerClasses } from "./StoryViewer.classes";

type FactsOf<Id extends StoryGroup["id"]> =
  (typeof statusStoriesKeys.groups)[Id] extends { facts: infer Facts } ? Facts[keyof Facts] : never;
type FactKey = FactsOf<StoryGroup["id"]>;

/** The strings key of a group's fact; the groups have different numbers of facts. */
function factKey(groupId: StoryGroup["id"], fact: string): FactKey {
  return (statusStoriesKeys.groups[groupId].facts as Record<string, FactKey>)[fact];
}

/**
 * The stories, one fact at a time, in the `StoryPlayer`: forward runs through a group's facts and
 * on into the next group, and the groups can be jumped between. Watching a group to its end greys
 * its ring.
 */
export function StoryViewer({
  groups,
  start,
  onClose,
}: {
  groups: readonly StoryGroup[];
  start: StoryPosition;
  onClose: () => void;
}) {
  const t = useTranslations(STATUS_STORIES_NAMESPACE);
  const [at, setAt] = useState(start);
  const group = groups[at.group];

  const forward = useCallback(() => {
    if (at.fact + 1 < group.facts.length) return setAt({ group: at.group, fact: at.fact + 1 });
    markSeen(group.id);
    if (at.group + 1 < groups.length) return setAt({ group: at.group + 1, fact: 0 });
    onClose();
  }, [at, group, groups, onClose]);

  const back = useCallback(() => {
    if (at.fact > 0) return setAt({ group: at.group, fact: at.fact - 1 });
    if (at.group > 0)
      setAt({ group: at.group - 1, fact: groups[at.group - 1].facts.length - 1 });
  }, [at, groups]);

  return (
    <StoryPlayer
      title={t(statusStoriesKeys.groups[group.id].title)}
      color={group.color}
      count={group.facts.length}
      current={at.fact}
      slideKey={`${at.group}-${at.fact}`}
      durationMs={STORY_MS}
      onForward={forward}
      onBack={back}
      onClose={onClose}
      labels={{
        previous: t(statusStoriesKeys.previous),
        next: t(statusStoriesKeys.next),
        hint: t(statusStoriesKeys.hint),
      }}
      header={
        <StoryGroupNav
          groups={groups}
          current={at.group}
          onPick={(group) => setAt({ group, fact: 0 })}
        />
      }
    >
      <p className={storyViewerClasses.fact}>{t(factKey(group.id, group.facts[at.fact]))}</p>
    </StoryPlayer>
  );
}
