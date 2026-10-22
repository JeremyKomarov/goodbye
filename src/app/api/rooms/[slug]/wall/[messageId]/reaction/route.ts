import { NextResponse } from "next/server";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import { ReactInputSchema } from "@/features/room/api/wall.dto";
import { apiError, handlingApiErrors } from "@/server/api/error-response.server";
import { requireCaller } from "@/server/auth/bearer";
import { findRoomBySlug } from "@/server/db/rooms.repo";
import { removeReaction, saveReaction } from "@/server/db/wall.repo";

const ROUTE = "/api/rooms/[slug]/wall/[messageId]/reaction";
type Context = RouteContext<"/api/rooms/[slug]/wall/[messageId]/reaction">;

async function target(params: Context["params"]) {
  const { slug, messageId } = await params;
  const id = Number(messageId);
  if (!Number.isSafeInteger(id) || id <= 0) throw new ApiError(API_ERROR_CODES.not_found, 404);
  const room = await findRoomBySlug(slug);
  if (!room) throw new ApiError(API_ERROR_CODES.not_found, 404);
  return { roomId: room.id, messageId: id };
}

// React to a wall message, or change your reaction — like WhatsApp, one per person. The database
// checks the message is this room's and the caller a player in it (`forbidden`).
export const PUT = handlingApiErrors(ROUTE, async (request: Request, { params }: Context) => {
  const caller = await requireCaller(request);
  const parsed = ReactInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return apiError(API_ERROR_CODES.invalid_input, { route: ROUTE, field: "emoji" });

  const { roomId, messageId } = await target(params);
  await saveReaction(caller.accessToken, {
    roomId,
    messageId,
    userId: caller.userId,
    emoji: parsed.data.emoji,
  });
  return new NextResponse(null, { status: 204 });
});

// Take your reaction back.
export const DELETE = handlingApiErrors(ROUTE, async (request: Request, { params }: Context) => {
  const caller = await requireCaller(request);
  const { messageId } = await target(params);
  await removeReaction(caller.accessToken, messageId, caller.userId);
  return new NextResponse(null, { status: 204 });
});
