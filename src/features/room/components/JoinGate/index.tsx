"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { ROOM_NAMESPACE, roomKeys } from "@/features/room/strings/room.keys.const";
import { isolate } from "@/shared/utils/isolate";
import { roomTheme } from "@/shared/utils/roomTheme";
import { joinGateClasses } from "./JoinGate.classes";
import { JOIN_GATE_NAMESPACE, joinGateKeys } from "./JoinGate.keys.const";
import type { JoinGateProps } from "./JoinGate.types";
import { CodeForm } from "./partials/CodeForm";
import { NameForm } from "./partials/NameForm";

/**
 * Covers the room until the visitor has a name in it, and says whose room it is and why. A name
 * someone already has asks for that player's code: it may be them, on another device.
 */
export function JoinGate({ room, voterCount, isChecking, onJoin, onSignInAs }: JoinGateProps) {
  const t = useTranslations(JOIN_GATE_NAMESPACE);
  const tRoom = useTranslations(ROOM_NAMESPACE);
  // The name that turned out to be taken; set, the gate asks for its code.
  const [takenName, setTakenName] = useState<string | null>(null);
  const [lastName, setLastName] = useState("");
  const host = isolate(room.hostName);
  const gender = room.hostGender;

  return (
    <motion.div
      className={joinGateClasses.root}
      aria-busy={isChecking}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      {!isChecking && (
        <motion.div
          className={joinGateClasses.card}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 220 }}
        >
          <div>
            <p className={joinGateClasses.group}>
              <bdi>{room.groupName}</bdi>
            </p>
            <h1 className={joinGateClasses.headline}>
              {t(joinGateKeys.headline, {
                status: room.status,
                theme: roomTheme(room.reason),
                name: host,
                gender,
              })}
            </h1>
            <p className={joinGateClasses.lede}>
              {room.reason &&
                `${t(joinGateKeys.because, {
                  name: host,
                  reason: tRoom(roomKeys.reason, { reason: room.reason, gender }),
                })} `}
              {room.status === ROOM_STATUSES.voting && `${t(joinGateKeys.youDecide)} `}
              {room.status === ROOM_STATUSES.exited
                ? t(joinGateKeys.wallOpen, { name: host })
                : voterCount > 0 && t(joinGateKeys.voted, { count: voterCount })}
            </p>
          </div>

          {takenName === null ? (
            <NameForm
              hostName={room.hostName}
              defaultName={lastName}
              onJoin={onJoin}
              onTaken={(name) => {
                setLastName(name);
                setTakenName(name);
              }}
            />
          ) : (
            <CodeForm
              name={takenName}
              host={{ name: room.hostName, gender }}
              onSignInAs={onSignInAs}
              onBack={() => setTakenName(null)}
            />
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
