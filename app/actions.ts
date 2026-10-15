"use server";

import { customAlphabet } from "nanoid";
import { z } from "zod";
import { hashToken, newAdminToken } from "@/lib/admin-token";
import { loginEmail } from "@/lib/login";
import { addDaysToDate, allSlots } from "@/lib/slots";
import { getAdminClient } from "@/lib/supabase/admin";

const newSlug = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 8);
// No 0/O, 1/I/L: the code is read off one screen and typed on another.
const newLoginCode = customAlphabet("23456789ABCDEFGHJKMNPQRSTUVWXYZ", 6);

function isTimeZone(value: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

const CreateRoomInput = z
  .object({
    hostName: z.string().trim().min(1, "חסר שם").max(30, "השם ארוך מדי"),
    hostGender: z.enum(["m", "f"]),
    groupName: z.string().trim().min(1, "חסר שם קבוצה").max(60, "שם הקבוצה ארוך מדי"),
    reason: z.enum(["fired", "quit", "fed_up"]).nullable(),
    timezone: z.string().refine(isTimeZone, "אזור זמן לא מוכר"),
    windowStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "תאריך לא תקין"),
    days: z.number().int().min(1).max(7),
    dayStartHour: z.number().int().min(0).max(23),
    dayEndHour: z.number().int().min(1).max(24),
    votingClosesAt: z.iso.datetime({ offset: true }),
  })
  .refine((v) => v.dayEndHour > v.dayStartHour, "שעת הסיום חייבת להיות אחרי שעת ההתחלה");

export type CreateRoomInput = z.input<typeof CreateRoomInput>;
export type CreateRoomResult = { ok: true; slug: string; adminToken: string } | { ok: false; error: string };

export async function createRoom(input: CreateRoomInput): Promise<CreateRoomResult> {
  const parsed = CreateRoomInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "משהו בטופס לא תקין" };
  const v = parsed.data;

  const closesAt = Date.parse(v.votingClosesAt);
  if (closesAt < Date.now() + 60_000) {
    return { ok: false, error: "ההצבעה צריכה להיסגר בעתיד, לפחות בעוד דקה" };
  }

  const window = {
    timezone: v.timezone,
    window_start: v.windowStart,
    window_end: addDaysToDate(v.windowStart, v.days - 1),
    day_start_hour: v.dayStartHour,
    day_end_hour: v.dayEndHour,
  };
  if (!allSlots(window).some((slot) => slot.ms >= closesAt)) {
    return { ok: false, error: "אין אף שעה להצבעה אחרי סגירת ההצבעה. כדאי להאריך את הימים או לסגור את ההצבעה מוקדם יותר" };
  }

  const db = getAdminClient();
  const slug = newSlug();
  const { data: room, error } = await db
    .from("rooms")
    .insert({
      slug,
      host_name: v.hostName,
      host_gender: v.hostGender,
      group_name: v.groupName,
      reason: v.reason,
      ...window,
      voting_closes_at: new Date(closesAt).toISOString(),
    })
    .select("id")
    .single();
  if (error || !room) return { ok: false, error: "לא הצלחנו לפתוח את החדר. נסו שוב" };

  const adminToken = newAdminToken();
  const { error: secretError } = await db
    .from("room_secrets")
    .insert({ room_id: room.id, admin_token_hash: hashToken(adminToken) });
  if (secretError) {
    await db.from("rooms").delete().eq("id", room.id);
    return { ok: false, error: "לא הצלחנו לפתוח את החדר. נסו שוב" };
  }

  return { ok: true, slug, adminToken };
}

export type LoginCodeResult = { ok: true; code: string } | { ok: false };

/**
 * Give the caller's user a code for coming in as themselves on another device. A
 * new code replaces the old one and signs out all of the user's sessions, so the
 * caller signs straight back in with it.
 */
export async function createLoginCode(accessToken: string): Promise<LoginCodeResult> {
  if (typeof accessToken !== "string" || !accessToken) return { ok: false };
  const db = getAdminClient();
  const { data, error } = await db.auth.getUser(accessToken);
  if (error || !data.user) return { ok: false };
  const code = newLoginCode();
  const { error: updateError } = await db.auth.admin.updateUserById(data.user.id, {
    email: loginEmail(data.user.id),
    password: code,
    email_confirm: true,
  });
  return updateError ? { ok: false } : { ok: true, code };
}
