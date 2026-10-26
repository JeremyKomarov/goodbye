import { NextResponse } from "next/server";
import { API_ERROR_CODES } from "@/core/api/api-error";
import { MIN_OPEN_MS } from "@/core/constants/room.const";
import { CreateRoomInputSchema, type CreatedRoomDto } from "@/features/landing/api/rooms.dto";
import { apiError, handlingApiErrors } from "@/server/api/error-response.server";
import { callerIp, RATE_BUDGETS, requireWithinLimit } from "@/server/api/rate-limit.server";
import { hashToken, newAdminToken } from "@/server/auth/admin-token";
import { insertRoom } from "@/server/db/rooms.repo";
import { addDaysToDate, hasSlotAfter } from "@/shared/utils/slots";

const ROUTE = "/api/rooms";

// Opening a room needs no session: anyone may, and the admin token returned is what makes them
// its host (docs/DECISIONS.md #2). Row-level security still keeps clients from inserting one.
// Five an hour from one IP (`rate_limited`, docs/DECISIONS.md #15).
export const POST = handlingApiErrors(ROUTE, async (request: Request) => {
  await requireWithinLimit(RATE_BUDGETS.createRoom, callerIp(request));
  const parsed = CreateRoomInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path.join(".") || undefined;
    return apiError(API_ERROR_CODES.invalid_input, { route: ROUTE, field });
  }
  const input = parsed.data;

  const closesAt = Date.parse(input.votingClosesAt);
  if (closesAt < Date.now() + MIN_OPEN_MS)
    return apiError(API_ERROR_CODES.close_time_in_past, { route: ROUTE, field: "votingClosesAt" });

  const window = {
    timezone: input.timezone,
    windowStart: input.windowStart,
    windowEnd: addDaysToDate(input.windowStart, input.days - 1),
    dayStartHour: input.dayStartHour,
    dayEndHour: input.dayEndHour,
  };
  if (!hasSlotAfter(window, closesAt)) {
    const field = "votingClosesAt";
    return apiError(API_ERROR_CODES.no_slots_after_close, { route: ROUTE, field });
  }

  const adminToken = newAdminToken();
  const room = await insertRoom(
    {
      hostName: input.hostName,
      hostGender: input.hostGender,
      groupName: input.groupName,
      reason: input.reason,
      ...window,
      votingClosesAt: new Date(closesAt).toISOString(),
      locale: input.locale,
    },
    hashToken(adminToken),
  );

  const body: CreatedRoomDto = { slug: room.slug, admin_token: adminToken };
  return NextResponse.json(body, { status: 201 });
});
