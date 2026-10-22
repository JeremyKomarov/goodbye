import { NextResponse } from "next/server";
import { API_ERROR_CODES } from "@/core/api/api-error";
import type { WallDto } from "@/features/room/api/wall.dto";
import { apiError, handlingApiErrors } from "@/server/api/error-response.server";
import { findRoomBySlug } from "@/server/db/rooms.repo";
import { listWallMessages, listWallReactions } from "@/server/db/wall.repo";

const ROUTE = "/api/rooms/[slug]/wall";
type Context = RouteContext<"/api/rooms/[slug]/wall">;

// Reading the wall needs no session: everything on it is public to the database's anonymous role.
export const GET = handlingApiErrors(ROUTE, async (_request: Request, { params }: Context) => {
  const room = await findRoomBySlug((await params).slug);
  if (!room) return apiError(API_ERROR_CODES.not_found, { route: ROUTE });

  const [messages, reactions] = await Promise.all([
    listWallMessages(room.id),
    listWallReactions(room.id),
  ]);
  const body: WallDto = {
    messages: messages.map((m) => ({
      id: m.id,
      user_id: m.userId,
      display_name: m.displayName,
      body: m.body,
      created_at: m.createdAt,
    })),
    reactions: reactions.map((r) => ({
      message_id: r.messageId,
      user_id: r.userId,
      emoji: r.emoji,
    })),
  };
  return NextResponse.json(body, { headers: { "cache-control": "no-store" } });
});
