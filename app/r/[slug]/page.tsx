import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import { RoomClient } from "@/components/room/RoomClient";
import { g } from "@/lib/hebrew";
import { getRoomBySlug } from "@/lib/supabase/server";

const loadRoom = cache(getRoomBySlug);

export async function generateMetadata({ params }: PageProps<"/r/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const room = await loadRoom(slug);
  if (!room) return { title: "החדר לא נמצא" };
  const title =
    room.status === "exited"
      ? `${room.host_name} ${g(room.host_gender, "יצא", "יצאה")} מ${room.group_name}`
      : `מתי ${room.host_name} ${g(room.host_gender, "יוצא", "יוצאת")} מ${room.group_name}?`;
  const description = room.status === "voting" ? "אתם מחליטים. נכנסים, בוחרים שעה, ובינתיים משחקים." : "הקבוצה כבר החליטה. בואו לראות.";
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

function RoomSkeleton() {
  return (
    <div className="mx-auto min-h-dvh max-w-md animate-pulse" aria-busy="true" aria-label="טוען את החדר">
      <div className="flex items-center gap-3 bg-panel px-3 py-2.5">
        <div className="size-10 rounded-full bg-raised" />
        <div className="h-4 w-32 rounded bg-raised" />
      </div>
      <div className="mx-auto mt-16 h-24 w-64 rounded-2xl bg-panel" />
      <div className="mx-3 mt-10 h-80 rounded-3xl bg-panel" />
    </div>
  );
}
