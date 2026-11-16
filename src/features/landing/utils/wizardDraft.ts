import { z } from "zod";
import { STORAGE_KEYS } from "@/core/constants/storage-keys.const";
import {
  CreateRoomInputSchema, HOST_GENDERS, LEAVE_REASONS, type CreateRoomInput,
} from "@/features/landing/api/rooms.dto";
import { toLocalDateInput } from "@/shared/utils/localDateTime";

// The wizard's unsent answers, kept in this tab's sessionStorage so a reload, a trip to WhatsApp and
// back, or a phone dropping the page from memory does not start the host over. Storage can be
// missing or refuse (private mode, blocked site data); then nothing is kept, and nothing breaks.

/** What is kept. Loose on purpose: a half-typed name is still worth giving back. */
const DraftSchema = z.object({
  values: z.object({
    hostName: z.string(),
    hostGender: z.enum(HOST_GENDERS),
    groupName: z.string(),
    reason: z.enum(LEAVE_REASONS).nullable(),
    windowStart: z.string(),
    days: z.number(),
    dayStartHour: z.number(),
    dayEndHour: z.number(),
    votingClosesAt: z.string(),
  }),
  step: z.number().int().min(0),
});

export type WizardDraft = z.infer<typeof DraftSchema>;

export function saveDraft(values: CreateRoomInput, step: number) {
  const { hostName, hostGender, groupName, reason, windowStart, days, dayStartHour, dayEndHour,
    votingClosesAt } = values;
  const draft: WizardDraft = {
    values: { hostName, hostGender, groupName, reason: reason ?? null, windowStart, days,
      dayStartHour, dayEndHour, votingClosesAt },
    step,
  };
  try {
    sessionStorage.setItem(STORAGE_KEYS.createDraft, JSON.stringify(draft));
  } catch {}
}

export function forgetDraft() {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.createDraft);
  } catch {}
}

/**
 * The kept answers laid over `fresh` (today's defaults, this tab's timezone and language), or
 * `null` when there are none. A field the schema would refuse falls back to its default, except the
 * names, which come back as typed. A window that has started, or a close that has passed, comes
 * back as today's: the host left, and time did not wait.
 */
export function loadDraft(
  fresh: CreateRoomInput,
  now: number,
): { values: CreateRoomInput; step: number } | null {
  let raw: string | null;
  try {
    raw = sessionStorage.getItem(STORAGE_KEYS.createDraft);
  } catch {
    return null;
  }
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  const draft = DraftSchema.safeParse(parsed);
  if (!draft.success) return null;

  const shape = CreateRoomInputSchema.shape;
  const kept = draft.data.values;
  const valid = <K extends keyof typeof kept>(key: K) =>
    shape[key].safeParse(kept[key]).success ? kept[key] : fresh[key];
  const isStale =
    kept.windowStart < toLocalDateInput(now) || !(Date.parse(kept.votingClosesAt) > now);
  const values: CreateRoomInput = {
    ...fresh,
    hostName: kept.hostName,
    groupName: kept.groupName,
    hostGender: kept.hostGender,
    reason: kept.reason,
    days: valid("days"),
    dayStartHour: valid("dayStartHour"),
    dayEndHour: valid("dayEndHour"),
    ...(isStale
      ? {}
      : {
          windowStart: valid("windowStart"),
          votingClosesAt: valid("votingClosesAt"),
        }),
  };
  return { values, step: draft.data.step };
}
