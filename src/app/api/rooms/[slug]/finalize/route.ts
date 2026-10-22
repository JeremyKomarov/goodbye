import { NextResponse } from "next/server";
import { API_ERROR_CODES } from "@/core/api/api-error";
import { apiError, handlingApiErrors } from "@/server/api/error-response.server";
import { toRoomDto } from "@/server/api/room-snapshot.server";
import { finalizeRoom } from "@/server/db/rooms.repo";

const ROUTE = "/api/rooms/[slug]/finalize";

// Any screen whose clock says voting is over asks for the result; the database locks the room the
// first time and answers the same room after. Before the close it answers the room unchanged, so
// a screen whose clock runs ahead simply asks again. No session: anyone in the room may ask.
export const POST = handlingApiErrors(
  ROUTE,
  async (_request: Request, { params }: RouteContext<"/api/rooms/[slug]/finalize">) => {
    const room = await finalizeRoom((await params).slug);
    if (!room) return apiError(API_ERROR_CODES.not_found, { route: ROUTE });
    return NextResponse.json(toRoomDto(room));
  },
);
