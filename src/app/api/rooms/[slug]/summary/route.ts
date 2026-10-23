import { NextResponse } from "next/server";
import { API_ERROR_CODES } from "@/core/api/api-error";
import { apiError, handlingApiErrors } from "@/server/api/error-response.server";
import { exitSummary } from "@/server/api/exit-summary.server";
import { findRoomBySlug } from "@/server/db/rooms.repo";

const ROUTE = "/api/rooms/[slug]/summary";
type Context = RouteContext<"/api/rooms/[slug]/summary">;

// What the room adds up to. No session: the votes, the wall and its reactions are all public to
// anyone holding the room's link.
export const GET = handlingApiErrors(ROUTE, async (_request: Request, { params }: Context) => {
  const room = await findRoomBySlug((await params).slug);
  if (!room) return apiError(API_ERROR_CODES.not_found, { route: ROUTE });

  return NextResponse.json(await exitSummary(room), { headers: { "cache-control": "no-store" } });
});
