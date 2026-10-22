import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FEATURE_KEYS } from "@/core/config/features.const";
import { RoomShell } from "@/features/room/components/RoomShell";
import { RoomSkeleton } from "@/features/room/components/RoomSkeleton";
import { roomSnapshot } from "@/server/api/room-snapshot.server";
import { findRoomBySlug } from "@/server/db/rooms.repo";
import { featureLayout } from "@/shared/utils/featurePage";

type RoomLayoutProps = LayoutProps<"/[locale]/r/[slug]">;

// Every section of the room — the vote, the wall, the games — sits in this one layout, so the
// header, the join gate and the live channel stay up as you move between them. The room is read
// here, on the server: an unknown link is the not-found page, and the first paint is the room.
async function LoadedRoom({ params, children }: RoomLayoutProps) {
  const room = await findRoomBySlug((await params).slug);
  if (!room) notFound();
  return (
    <RoomShell slug={room.slug} initial={await roomSnapshot(room)}>
      {children}
    </RoomShell>
  );
}

function RoomLayout(props: RoomLayoutProps) {
  return (
    <Suspense fallback={<RoomSkeleton />}>
      <LoadedRoom {...props} />
    </Suspense>
  );
}

export default featureLayout(FEATURE_KEYS.room, RoomLayout);
