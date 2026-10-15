import { RoomSkeleton } from "@/features/room/components/RoomSkeleton/RoomSkeleton";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import { RoomClient } from "@/features/room/components/RoomClient/RoomClient";
import { formatSlot, g } from "@/core/hebrew";
import { verdictText } from "@/core/room-view";
import { getRoomBySlug } from "@/core/supabase/server";

const loadRoom = cache(getRoomBySlug);

export async function generateMetadata({ params }: PageProps<"/r/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const room = await loadRoom(slug);
  if (!room) return { title: "החדר לא נמצא" };
  const he = room.host_gender;
  const verdict = verdictText(room);
  const title =
    room.status === "exited"
      ? `${room.host_name} ${g(he, "יצא", "יצאה")} מ${room.group_name}${verdict ? `: ${verdict}` : ""}`
      : room.status === "locked" && room.locked_slot
        ? `${room.host_name} ${g(he, "יוצא", "יוצאת")} מ${room.group_name} ${formatSlot(Date.parse(room.locked_slot), room.timezone)}`
        : `מתי ${room.host_name} ${g(he, "יוצא", "יוצאת")} מ${room.group_name}?`;
  const description =
    room.status === "voting"
      ? "אתם מחליטים. נכנסים, בוחרים שעה, ובינתיים משחקים."
      : room.status === "locked"
        ? "הקבוצה החליטה. בואו לספירה לאחור ולקיר הפרידה."
        : "זהו, זה קרה. הקיר עדיין פתוח.";
  return { title, description, openGraph: { title, description }, twitter: { card: "summary_large_image", title, description } };
}

export default function RoomPage({ params }: PageProps<"/r/[slug]">) {
  return (
    <Suspense fallback={<RoomSkeleton />}>
      {params.then(({ slug }) => (
        <Room slug={slug} />
      ))}
    </Suspense>
  );
}

async function Room({ slug }: { slug: string }) {
  const room = await loadRoom(slug);
  if (!room) notFound();
  return <RoomClient initialRoom={room} />;
}
