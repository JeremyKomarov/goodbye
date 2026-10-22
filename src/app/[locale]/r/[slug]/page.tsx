import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FEATURE_KEYS } from "@/core/config/features.const";
import { RoomScreen } from "@/features/room/components/RoomScreen";
import { RoomSkeleton } from "@/features/room/components/RoomSkeleton";
import { roomSnapshot } from "@/server/api/room-snapshot.server";
import { findRoomBySlug } from "@/server/db/rooms.repo";
import { featurePage } from "@/shared/utils/featurePage";

type RoomPageProps = PageProps<"/[locale]/r/[slug]">;

// The room is read here, on the server, so an unknown link is a real 404 and the first paint is
// the room itself; from then on the screen's query and its Realtime channel keep it fresh.
async function LoadedRoom({ params }: RoomPageProps) {
  const room = await findRoomBySlug((await params).slug);
  if (!room) notFound();
  return <RoomScreen slug={room.slug} initial={await roomSnapshot(room)} />;
}

function RoomPage(props: RoomPageProps) {
  return (
    <Suspense fallback={<RoomSkeleton />}>
      <LoadedRoom {...props} />
    </Suspense>
  );
}

export default featurePage(FEATURE_KEYS.room, RoomPage);
