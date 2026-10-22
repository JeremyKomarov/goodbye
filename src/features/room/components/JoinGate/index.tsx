"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import {
  MAX_PLAYER_NAME, SaveNameInputSchema, type SaveNameInput,
} from "@/features/room/api/players.dto";
import { ROOM_NAMESPACE, roomKeys } from "@/features/room/strings/room.keys.const";
import type { Room } from "@/features/room/types/room.types";
import { sameName } from "@/features/room/utils/names";
import { Button, BUTTON_SIZES } from "@/shared/components/Button";
import { Field } from "@/shared/components/Field";
import { LanguageSwitch } from "@/shared/components/LanguageSwitch";
import { isolate } from "@/shared/utils/isolate";
import { joinGateClasses } from "./JoinGate.classes";
import { JOIN_GATE_NAMESPACE, joinGateKeys } from "./JoinGate.keys.const";

const SERVER_ERROR = "root.server";
const HOST_NAME = "hostName";

interface JoinGateProps {
  room: Room;
  voterCount: number;
  /** Still finding out who this browser is: cover the room, but don't ask for a name yet. */
  isChecking: boolean;
  onJoin: (input: SaveNameInput) => Promise<unknown>;
}

/** Covers the room until the visitor has a name in it, and says whose room it is and why. */
export function JoinGate({ room, voterCount, isChecking, onJoin }: JoinGateProps) {
  const t = useTranslations(JOIN_GATE_NAMESPACE);
  const tRoom = useTranslations(ROOM_NAMESPACE);
  const form = useForm<SaveNameInput>({
    resolver: zodResolver(SaveNameInputSchema),
    defaultValues: { name: "" },
    mode: "onTouched",
  });
  const { errors, isSubmitting } = form.formState;
  const host = isolate(room.hostName);
  const gender = room.hostGender;

  const submit = form.handleSubmit(async (input) => {
    try {
      await onJoin(input);
    } catch (error) {
      if (!(error instanceof ApiError) || error.code !== API_ERROR_CODES.name_taken)
        return form.setError(SERVER_ERROR, { type: "failed" });
      const type = sameName(input.name, room.hostName) ? HOST_NAME : API_ERROR_CODES.name_taken;
      form.setError("name", { type }, { shouldFocus: true });
    }
  });

  const nameType = errors.name?.type;
  const nameError =
    nameType === HOST_NAME
      ? t(joinGateKeys.errors.hostName, { host })
      : nameType === API_ERROR_CODES.name_taken
        ? t(joinGateKeys.errors.nameTaken)
        : nameType
          ? t(joinGateKeys.errors.name)
          : undefined;

  return (
    <motion.div
      className={joinGateClasses.root}
      aria-busy={isChecking}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      {!isChecking && (
        <motion.form
          className={joinGateClasses.form}
          aria-label={t(joinGateKeys.label)}
          onSubmit={submit}
          noValidate
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 220 }}
        >
          <div>
            <div className={joinGateClasses.top}>
              <p className={joinGateClasses.group}>
                <bdi>{room.groupName}</bdi>
              </p>
              <LanguageSwitch />
            </div>
            <h1 className={joinGateClasses.headline}>
              {t(joinGateKeys.headline, { status: room.status, name: host, gender })}
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

          <Field
            label={t(joinGateKeys.nameLabel)}
            maxLength={MAX_PLAYER_NAME}
            autoComplete="nickname"
            enterKeyHint="go"
            autoFocus
            error={nameError}
            {...form.register("name")}
          />

          {errors.root?.server && (
            <p role="alert" className={joinGateClasses.alert}>
              {t(joinGateKeys.errors.failed)}
            </p>
          )}

          <Button type="submit" size={BUTTON_SIZES.lg} fullWidth isLoading={isSubmitting}>
            {t(joinGateKeys.enter)}
          </Button>
        </motion.form>
      )}
    </motion.div>
  );
}
