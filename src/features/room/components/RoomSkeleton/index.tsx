import { useTranslations } from "next-intl";
import { Skeleton, SKELETON_SHAPES } from "@/shared/components/Skeleton";
import { roomSkeletonClasses } from "./RoomSkeleton.classes";
import { ROOM_SKELETON_NAMESPACE, roomSkeletonKeys } from "./RoomSkeleton.keys.const";

/** The room's shape while it loads: the page's Suspense fallback. */
export function RoomSkeleton() {
  const t = useTranslations(ROOM_SKELETON_NAMESPACE);

  return (
    <div className={roomSkeletonClasses.root} aria-busy aria-label={t(roomSkeletonKeys.loading)}>
      <div className={roomSkeletonClasses.header}>
        <Skeleton shape={SKELETON_SHAPES.circle} width="2.5rem" height="2.5rem" />
        <div className={roomSkeletonClasses.lines}>
          <Skeleton width="40%" />
          <Skeleton width="25%" />
        </div>
      </div>
      <div className={roomSkeletonClasses.body}>
        <Skeleton shape={SKELETON_SHAPES.block} height="9rem" />
        <Skeleton shape={SKELETON_SHAPES.block} height="20rem" />
      </div>
    </div>
  );
}
