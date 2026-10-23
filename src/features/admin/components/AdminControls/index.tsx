"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FEATURE_KEYS } from "@/core/config/features.const";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { roomPath } from "@/core/constants/routes.const";
import { ADMIN_NAMESPACE, adminKeys } from "@/features/admin/strings/admin.keys.const";
import { ADMIN_ACTIONS, type AdminActionInput } from "@/shared/api/admin-action.dto";
import { Button, BUTTON_VARIANTS } from "@/shared/components/Button";
import { useDuration } from "@/shared/hooks/useDuration";
import { useSlotFormat } from "@/shared/hooks/useSlotFormat";
import type { Room } from "@/shared/types/room.types";
import { forgetAdminToken } from "@/shared/utils/adminTokens";
import { ON_TIME_MINUTES } from "@/shared/utils/verdict";
import { adminControlsClasses } from "./AdminControls.classes";
import { ReopenForm } from "./partials/ReopenForm";

interface AdminControlsProps {
  room: Room;
  /** Runs a host action; rejects with an `ApiError`. */
  onAct: (input: AdminActionInput) => Promise<unknown>;
}

/** The room's state, and everything the host can do to it. Every action asks first. */
export function AdminControls({ room, onAct }: AdminControlsProps) {
  const t = useTranslations(ADMIN_NAMESPACE);
  const router = useRouter();
  const format = useSlotFormat(room.timezone);
  const { rough } = useDuration();
  const [failed, setFailed] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const isVoting = room.status === ROOM_STATUSES.voting;
  const isExited = room.status === ROOM_STATUSES.exited;

  async function act(input: AdminActionInput, question: string) {
    if (!window.confirm(question)) return;
    setFailed(false);
    setIsBusy(true);
    try {
      await onAct(input);
    } catch {
      setFailed(true);
    } finally {
      setIsBusy(false);
    }
  }

  // Early and mid-vote exits are allowed, but the host hears how they'll look.
  function exitQuestion(now: number) {
    if (isVoting && now < room.votingClosesAt) return t(adminKeys.exit.askMidVote);
    const left = room.lockedSlot === null ? 0 : room.lockedSlot - now;
    if (left > ON_TIME_MINUTES * 60_000) return t(adminKeys.exit.askEarly, { left: rough(left) });
    return t(adminKeys.exit.ask);
  }

  const status = isExited
    ? t(adminKeys.status.exited, { time: room.exitedAt ? format.time(room.exitedAt) : "" })
    : isVoting
      ? t(adminKeys.status.voting, { slot: format.slot(room.votingClosesAt) })
      : t(adminKeys.status.locked, {
          slot: room.lockedSlot ? format.slot(room.lockedSlot) : "",
        });

  return (
    <div className={adminControlsClasses.root}>
      <section className={adminControlsClasses.card}>
        <p className={adminControlsClasses.label}>{t(adminKeys.status.title)}</p>
        <p className={adminControlsClasses.status}>{status}</p>
        {failed && (
          <p role="alert" className={adminControlsClasses.alert}>
            {t(adminKeys.errors.failed)}
          </p>
        )}
      </section>

      {!isExited && (
        <section className={adminControlsClasses.card}>
          <p className={adminControlsClasses.help}>
            {t(isVoting ? adminKeys.exit.whenVoting : adminKeys.exit.whenLocked)}
          </p>
          <Button
            variant={BUTTON_VARIANTS.danger}
            fullWidth
            isLoading={isBusy}
            onClick={() => act({ action: ADMIN_ACTIONS.exit }, exitQuestion(Date.now()))}
          >
            {t(adminKeys.exit.action)}
          </Button>
        </section>
      )}

      <section className={adminControlsClasses.card}>
        {isVoting && (
          <Button
            variant={BUTTON_VARIANTS.secondary}
            disabled={isBusy}
            onClick={() => act({ action: ADMIN_ACTIONS.lock }, t(adminKeys.lock.ask))}
          >
            {t(adminKeys.lock.action)}
          </Button>
        )}
        {isExited ? (
          <Button
            variant={BUTTON_VARIANTS.secondary}
            disabled={isBusy}
            onClick={() =>
              act(
                { action: ADMIN_ACTIONS.undoExit },
                t(adminKeys.exit.askUndo, { hasHour: String(room.lockedSlot !== null) }),
              )
            }
          >
            {t(adminKeys.exit.undo)}
          </Button>
        ) : (
          <ReopenForm isVoting={isVoting} votingClosesAt={room.votingClosesAt} onAct={onAct} />
        )}
      </section>

      <section className={adminControlsClasses.card}>
        <Button
          variant={BUTTON_VARIANTS.ghost}
          onClick={() => {
            forgetAdminToken(room.slug);
            router.push(roomPath(FEATURE_KEYS.room, room.slug));
          }}
        >
          {t(adminKeys.forget.action)}
        </Button>
        <p className={adminControlsClasses.help}>{t(adminKeys.forget.help)}</p>
      </section>
    </div>
  );
}
