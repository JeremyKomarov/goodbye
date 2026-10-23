import { NextResponse } from "next/server";
import { API_ERROR_CODES } from "@/core/api/api-error";
import { type RecordsDto, SubmitScoreInputSchema } from "@/shared/api/records.dto";
import { apiError, handlingApiErrors } from "@/server/api/error-response.server";
import { requireCaller } from "@/server/auth/bearer";
import { isPlayer } from "@/server/db/players.repo";
import { findRoomBySlug } from "@/server/db/rooms.repo";
import { insertScore, listBestScores } from "@/server/db/scores.repo";

const ROUTE = "/api/rooms/[slug]/scores";
type Context = RouteContext<"/api/rooms/[slug]/scores">;

// The room's records need no session: scores are public to the database's anonymous role.
export const GET = handlingApiErrors(ROUTE, async (_request: Request, { params }: Context) => {
  const room = await findRoomBySlug((await params).slug);
  if (!room) return apiError(API_ERROR_CODES.not_found, { route: ROUTE });

  const records = await listBestScores(room.id);
  const body: RecordsDto = {
    records: records.map((r) => ({
      game: r.game,
      user_id: r.userId,
      display_name: r.displayName,
      score: r.score,
    })),
  };
  return NextResponse.json(body, { headers: { "cache-control": "no-store" } });
});

// A finished game's score. Players only (`forbidden`); a score its game can't make is
// `invalid_input`; once the host has left, the records are final (`games_closed`).
export const POST = handlingApiErrors(ROUTE, async (request: Request, { params }: Context) => {
  const caller = await requireCaller(request);
  const parsed = SubmitScoreInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return apiError(API_ERROR_CODES.invalid_input, { route: ROUTE, field: "score" });

  const room = await findRoomBySlug((await params).slug);
  if (!room) return apiError(API_ERROR_CODES.not_found, { route: ROUTE });
  if (!(await isPlayer(room.id, caller.userId)))
    return apiError(API_ERROR_CODES.forbidden, { route: ROUTE });

  await insertScore(caller.accessToken, room.id, parsed.data.game, parsed.data.score);
  return new NextResponse(null, { status: 204 });
});
