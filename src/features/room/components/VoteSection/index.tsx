"use client";

import { Hero } from "@/features/room/components/Hero";
import { StatusStories } from "@/features/room/components/StatusStories";
import { VoteHeatmap } from "@/features/room/components/VoteHeatmap";
import { useRoomContext } from "@/features/room/hooks/useRoomContext";
import { useVote } from "@/features/room/hooks/useVote";
import { useNow } from "@/shared/hooks/useNow";
import { voteSectionClasses } from "./VoteSection.classes";

/** The room's first section: the status card (on phones) and the hour grid. */
export function VoteSection() {
  const { slug, snapshot, me, isHost, leader, openStory, hostExit } = useRoomContext();
  const vote = useVote(slug);
  const now = useNow();

  return (
    <div className={voteSectionClasses.root}>
      <div className={voteSectionClasses.hero}>
        <div className={voteSectionClasses.stories}>
          <StatusStories onOpen={openStory} />
        </div>
        <Hero
          room={snapshot.room}
          now={now}
          leader={leader}
          voterCount={snapshot.votes.length}
          hostExit={hostExit}
        />
      </div>
      <div className={voteSectionClasses.grid}>
        <VoteHeatmap
          snapshot={snapshot}
          now={now}
          me={me}
          canVote={!isHost}
          onVote={(slotMs) => vote.mutateAsync({ userId: me?.userId ?? "", slotMs })}
        />
      </div>
    </div>
  );
}
