import { NextResponse } from "next/server";
import { API_ERROR_CODES } from "@/core/api/api-error";
import { ClaimHostInputSchema } from "@/features/room/api/players.dto";
import { apiError, handlingApiErrors } from "@/server/api/error-response.server";
import { tokenMatches } from "@/server/auth/admin-token";
import { requireCaller } from "@/server/auth/bearer";
import { addHost } from "@/server/db/hosts.repo";
import { findAdminTokenHash, findRoomBySlug } from "@/server/db/rooms.repo";
import { deleteVoteOf } from "@/server/db/votes.repo";

const ROUTE = "/api/rooms/[slug]/hosts";

// The host's browser claims the room with the admin token it was handed, so the database knows
// which user is the host: they may take the host's name, and they don't vote.
export const POST = handlingApiErrors(
  ROUTE,
  async (request: Request, { params }: RouteContext<"/api/rooms/[slug]/hosts">) => {
    const caller = await requireCaller(request);
    const parsed = ClaimHostInputSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return apiError(API_ERROR_CODES.invalid_input, { route: ROUTE });

    const room = await findRoomBySlug((await params).slug);
    if (!room) return apiError(API_ERROR_CODES.not_found, { route: ROUTE });

    const hash = await findAdminTokenHash(room.id);
    if (!hash || !tokenMatches(parsed.data.adminToken, hash))
      return apiError(API_ERROR_CODES.forbidden, { route: ROUTE });

    await addHost(room.id, caller.userId);
    // The host doesn't vote: a vote cast from this browser before the room knew it goes.
    await deleteVoteOf(room.id, caller.userId);
    return new NextResponse(null, { status: 204 });
  },
);
