import { NextResponse } from "next/server";
import { API_ERROR_CODES } from "@/core/api/api-error";
import { apiError, handlingApiErrors } from "@/server/api/error-response.server";
import { roomSnapshot } from "@/server/api/room-snapshot.server";
import { findRoomBySlug } from "@/server/db/rooms.repo";

const ROUTE = "/api/rooms/[slug]";

// Reading a room needs no session: the link is the invitation, and everything here is public to
// the database's anonymous role too (docs/DECISIONS.md #2).
export const GET = handlingApiErrors(
  ROUTE,
  async (_request: Request, { params }: RouteContext<"/api/rooms/[slug]">) => {
    const room = await findRoomBySlug((await params).slug);
    if (!room) return apiError(API_ERROR_CODES.not_found, { route: ROUTE });

    return NextResponse.json(await roomSnapshot(room), {
      headers: { "cache-control": "no-store" },
    });
  },
);
