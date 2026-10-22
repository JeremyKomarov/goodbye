import { NextResponse } from "next/server";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import { ROOM_STATUSES } from "@/core/constants/room.const";
import { CastVoteInputSchema } from "@/features/room/api/votes.dto";
import { apiError, handlingApiErrors } from "@/server/api/error-response.server";
import { requireCaller } from "@/server/auth/bearer";
import { findRoomBySlug, type RoomRecord } from "@/server/db/rooms.repo";
import { saveVote, withdrawVote } from "@/server/db/votes.repo";
import { allSlots } from "@/shared/utils/slots";

const ROUTE = "/api/rooms/[slug]/vote";
type Context = RouteContext<"/api/rooms/[slug]/vote">;

/** The room, still open for votes — or `not_found`, or `voting_closed` once the time is up. */
async function openRoom(slug: string): Promise<RoomRecord> {
  const room = await findRoomBySlug(slug);
  if (!room) throw new ApiError(API_ERROR_CODES.not_found, 404);
  const closed =
    room.status !== ROOM_STATUSES.voting || Date.now() >= Date.parse(room.votingClosesAt);
  if (closed) throw new ApiError(API_ERROR_CODES.voting_closed, 409);
  return room;
}

// Cast or move your vote. The hour must be one of the room's, on or after voting closes; the
// database then checks you are a player and not the host (`forbidden`).
export const PUT = handlingApiErrors(ROUTE, async (request: Request, { params }: Context) => {
  const caller = await requireCaller(request);
  const parsed = CastVoteInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return apiError(API_ERROR_CODES.invalid_input, { route: ROUTE, field: "slotStart" });

  const room = await openRoom((await params).slug);
  const slotMs = Date.parse(parsed.data.slotStart);
  const closesAt = Date.parse(room.votingClosesAt);
  if (slotMs < closesAt || !allSlots(room).some((slot) => slot.ms === slotMs))
    return apiError(API_ERROR_CODES.invalid_input, { route: ROUTE, field: "slotStart" });

  await saveVote(caller.accessToken, room.id, caller.userId, new Date(slotMs).toISOString());
  return new NextResponse(null, { status: 204 });
});

// Take your vote back, while voting is still open.
export const DELETE = handlingApiErrors(ROUTE, async (request: Request, { params }: Context) => {
  const caller = await requireCaller(request);
  const room = await openRoom((await params).slug);
  await withdrawVote(caller.accessToken, room.id, caller.userId);
  return new NextResponse(null, { status: 204 });
});
