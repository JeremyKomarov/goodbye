import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { cache, Suspense } from "react";
import { FEATURE_KEYS } from "@/core/config/features.const";
import { API_ENDPOINTS, PREVIEW_SIZE } from "@/core/constants/api-endpoints.const";
import { resolveLocale } from "@/core/i18n/routing";
import { RoomShell } from "@/features/room/components/RoomShell";
import { RoomSkeleton } from "@/features/room/components/RoomSkeleton";
import { roomPreview } from "@/features/room/utils/roomPreview";
import { roomSnapshot, toRoomDto } from "@/server/api/room-snapshot.server";
import { findRoomBySlug } from "@/server/db/rooms.repo";
import { mapRoomDto } from "@/shared/api/room.mapper";
import { featureLayout } from "@/shared/utils/featurePage";

type RoomLayoutProps = LayoutProps<"/[locale]/r/[slug]">;

// Read once per request, for the metadata and the room alike.
const loadRoom = cache(findRoomBySlug);

// The tab's title and a shared link's text tell the story so far (features/room/utils/
// roomPreview.ts); the preview image (`API_ENDPOINTS.rooms.preview`) draws the same words. Read on
// every request — each page under this layout says so with `onEveryRequest` — so a lock or an exit
// reaches the next shared link.
export async function generateMetadata({ params }: RoomLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const record = await loadRoom(slug);
  const locale = resolveLocale(await rootLocale());
  const { title, description } = roomPreview(record && mapRoomDto(toRoomDto(record)), locale);
  if (!description) return { title };
  const images = [{ url: API_ENDPOINTS.rooms.preview(slug, locale), ...PREVIEW_SIZE }];
  return {
    title,
    description,
    openGraph: { title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

// Every section of the room — the vote, the wall, the games — sits in this one layout, so the
// header, the join gate and the live channel stay up as you move between them. The room is read
// here, on the server: an unknown link is the not-found page, and the first paint is the room.
async function LoadedRoom({ params, children }: RoomLayoutProps) {
  const room = await loadRoom((await params).slug);
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
