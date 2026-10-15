import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import { RoomClient } from "@/components/room/RoomClient";
import { formatSlot, g } from "@/lib/hebrew";
import { verdictText } from "@/lib/room-view";
import { getRoomBySlug } from "@/lib/supabase/server";

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

/** Mirrors the room's app shell (header, content, tabs; sidebar on desktop) so nothing jumps on load. */
function RoomSkeleton() {
  return (
    <div className="h-dvh overflow-hidden lg:p-5 lg:short:p-0" aria-busy="true" aria-label="טוען את החדר">
      <div className="mx-auto flex h-full max-w-xl animate-pulse flex-col lg:max-w-[1440px] lg:flex-row lg:overflow-hidden lg:rounded-2xl lg:border lg:border-line/60 lg:short:rounded-none lg:short:border-0">
        <div className="hidden w-[25rem] shrink-0 flex-col border-e border-line/60 bg-panel lg:flex">
          <SkeletonHeader />
          <div className="mx-auto my-auto h-32 w-64 rounded-2xl bg-raised/60" />
          <div className="h-72 shrink-0 border-t border-line/60" />
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="lg:hidden">
            <SkeletonHeader />
          </div>
          <div className="hidden h-16 shrink-0 border-b border-line/60 bg-panel lg:block" />
          <div className="mx-auto mt-4 h-24 w-56 shrink-0 rounded-2xl bg-panel lg:hidden" />
          <div className="m-3 min-h-0 flex-1 rounded-3xl bg-panel lg:m-6" />
          <div className="h-16 shrink-0 border-t border-line/60 bg-panel pb-[env(safe-area-inset-bottom)] tiny:h-12 lg:hidden" />
        </div>
      </div>
    </div>
  );
}

function SkeletonHeader() {
  return (
    <div className="shrink-0 bg-panel pt-[env(safe-area-inset-top)]">
      <div className="flex h-16 items-center gap-3 px-3 tiny:h-12">
        <div className="size-11 rounded-full bg-raised tiny:size-9" />
        <div className="h-4 w-32 rounded bg-raised" />
      </div>
    </div>
  );
}
