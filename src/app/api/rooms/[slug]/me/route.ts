import { NextResponse } from "next/server";
import { API_ERROR_CODES } from "@/core/api/api-error";
import { SaveNameInputSchema } from "@/features/room/api/players.dto";
import { apiError, handlingApiErrors } from "@/server/api/error-response.server";
import { requireCaller } from "@/server/auth/bearer";
import { savePlayerName } from "@/server/db/players.repo";
import { findRoomBySlug } from "@/server/db/rooms.repo";

const ROUTE = "/api/rooms/[slug]/me";

// Join the room under a name, or rename yourself in it. A name someone else has, or the host's
// name when you are not the host, is `name_taken` on `name` — the database decides.
export const PUT = handlingApiErrors(
  ROUTE,
  async (request: Request, { params }: RouteContext<"/api/rooms/[slug]/me">) => {
    const caller = await requireCaller(request);
    const parsed = SaveNameInputSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success)
      return apiError(API_ERROR_CODES.invalid_input, { route: ROUTE, field: "name" });

    const room = await findRoomBySlug((await params).slug);
    if (!room) return apiError(API_ERROR_CODES.not_found, { route: ROUTE });

    await savePlayerName(caller.accessToken, room.id, caller.userId, parsed.data.name);
    return new NextResponse(null, { status: 204 });
  },
);
