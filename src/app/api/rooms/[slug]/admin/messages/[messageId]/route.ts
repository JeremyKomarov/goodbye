import { NextResponse } from "next/server";
import { API_ERROR_CODES } from "@/core/api/api-error";
import { apiError, handlingApiErrors } from "@/server/api/error-response.server";
import { requireAdmin } from "@/server/auth/admin";
import { deleteWallMessage } from "@/server/db/wall.repo";

const ROUTE = "/api/rooms/[slug]/admin/messages/[messageId]";
type Context = RouteContext<"/api/rooms/[slug]/admin/messages/[messageId]">;

// The host removes a goodbye that shouldn't be on the wall. Only this room's: a message from
// another room is simply not found by the delete.
export const DELETE = handlingApiErrors(ROUTE, async (request: Request, { params }: Context) => {
  const { slug, messageId } = await params;
  const room = await requireAdmin(request, slug);
  const id = Number(messageId);
  if (!Number.isSafeInteger(id) || id <= 0)
    return apiError(API_ERROR_CODES.not_found, { route: ROUTE });
  await deleteWallMessage(room.id, id);
  return new NextResponse(null, { status: 204 });
});
