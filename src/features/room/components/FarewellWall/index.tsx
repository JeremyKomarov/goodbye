"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { MessageList } from "@/features/room/components/FarewellWall/partials/MessageList";
import { usePostMessage } from "@/features/room/hooks/usePostMessage";
import { useReact } from "@/features/room/hooks/useReact";
import { useRoomContext } from "@/features/room/hooks/useRoomContext";
import { useSlotFormat } from "@/features/room/hooks/useSlotFormat";
import { useWall } from "@/features/room/hooks/useWall";
import { Skeleton, SKELETON_SHAPES } from "@/shared/components/Skeleton";
import { SystemPill } from "@/shared/components/SystemPill";
import { isolate } from "@/shared/utils/isolate";
import { farewellWallClasses } from "./FarewellWall.classes";
import { FAREWELL_WALL_NAMESPACE, farewellWallKeys } from "./FarewellWall.keys.const";
import { Composer } from "./partials/Composer";

/**
 * The room's second section: goodbyes for the host, with reactions. Open to everyone in the room,
 * and still open after the host has left.
 */
export function FarewellWall() {
  const t = useTranslations(FAREWELL_WALL_NAMESPACE);
  const { slug, snapshot, me, live, typing } = useRoomContext();
  const { room, hostIds } = snapshot;
  const { data: wall } = useWall(slug);
  const post = usePostMessage(slug);
  const react = useReact(slug);
  const format = useSlotFormat(room.timezone);
  const intro = (
    <SystemPill className={farewellWallClasses.intro}>
      {t(farewellWallKeys.intro, {
        status: room.status,
        name: isolate(room.hostName),
        gender: room.hostGender,
      })}
    </SystemPill>
  );

  return (
    <section className={farewellWallClasses.root} aria-label={t(farewellWallKeys.label)}>
      {wall ? (
        <MessageList
          wall={wall}
          me={me}
          hosts={{ ids: hostIds, gender: room.hostGender }}
          formatTime={format.time}
          onReact={(messageId, emoji) =>
            me && react.mutate({ messageId, userId: me.userId, emoji })
          }
          intro={intro}
          footer={
            <AnimatePresence>
              {typing && (
                <motion.p
                  className={farewellWallClasses.typing}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {typing}
                </motion.p>
              )}
            </AnimatePresence>
          }
        />
      ) : (
        <div className={farewellWallClasses.region} aria-busy>
          <Skeleton shape={SKELETON_SHAPES.block} height="100%" />
        </div>
      )}
      <Composer onSend={post.mutateAsync} onTyping={live.sendTyping} />
    </section>
  );
}
