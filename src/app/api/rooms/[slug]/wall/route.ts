import { NextResponse } from "next/server";
import { API_ERROR_CODES } from "@/core/api/api-error";
import {
  PostMessageInputSchema, type WallDto, type WallMessageDto,
} from "@/features/room/api/wall.dto";
import { apiError, handlingApiErrors } from "@/server/api/error-response.server";
import { RATE_BUDGETS, requireWithinLimit } from "@/server/api/rate-limit.server";
import { requireCaller } from "@/server/auth/bearer";
import { isPlayer } from "@/server/db/players.repo";
import { findRoomBySlug } from "@/server/db/rooms.repo";
import {
  insertWallMessage, listWallMessages, listWallReactions, type WallMessageRecord,
} from "@/server/db/wall.repo";

const ROUTE = "/api/rooms/[slug]/wall";
type Context = RouteContext<"/api/rooms/[slug]/wall">;

const toMessageDto = (m: WallMessageRecord): WallMessageDto => ({
  id: m.id,
  user_id: m.userId,
  display_name: m.displayName,
  body: m.body,
  created_at: m.createdAt,
});

// Reading the wall needs no session: everything on it is public to the database's anonymous role.
export const GET = handlingApiErrors(ROUTE, async (_request: Request, { params }: Context) => {
  const room = await findRoomBySlug((await params).slug);
  if (!room) return apiError(API_ERROR_CODES.not_found, { route: ROUTE });

  const [messages, reactions] = await Promise.all([
    listWallMessages(room.id),
    listWallReactions(room.id),
  ]);
  const body: WallDto = {
    messages: messages.map(toMessageDto),
    reactions: reactions.map((r) => ({
      message_id: r.messageId,
      user_id: r.userId,
      emoji: r.emoji,
    })),
  };
  return NextResponse.json(body, { headers: { "cache-control": "no-store" } });
});

// Post a goodbye. Players only (`forbidden`), one message every 3 seconds (`too_fast`) and 30 in
// ten minutes (`rate_limited`); the wall stays open after the host has left, for late goodbyes.
export const POST = handlingApiErrors(ROUTE, async (request: Request, { params }: Context) => {
  const caller = await requireCaller(request);
  await requireWithinLimit(RATE_BUDGETS.wallPost, caller.userId);
  const parsed = PostMessageInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return apiError(API_ERROR_CODES.invalid_input, { route: ROUTE, field: "body" });

  const room = await findRoomBySlug((await params).slug);
  if (!room) return apiError(API_ERROR_CODES.not_found, { route: ROUTE });
  if (!(await isPlayer(room.id, caller.userId)))
    return apiError(API_ERROR_CODES.forbidden, { route: ROUTE });

  const message = await insertWallMessage(caller.accessToken, room.id, parsed.data.body);
  return NextResponse.json(toMessageDto(message), { status: 201 });
});
