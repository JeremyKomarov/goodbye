import { NextResponse } from "next/server";
import type { AdminRoomDto } from "@/features/admin/api/admin.dto";
import { handlingApiErrors } from "@/server/api/error-response.server";
import { toRoomDto } from "@/server/api/room-snapshot.server";
import { requireAdmin } from "@/server/auth/admin";
import { listHostIds } from "@/server/db/hosts.repo";
import { findLoginCodes } from "@/server/db/login-codes.repo";
import { listPlayers } from "@/server/db/players.repo";
import { listWallMessages } from "@/server/db/wall.repo";

const ROUTE = "/api/rooms/[slug]/admin";
type Context = RouteContext<"/api/rooms/[slug]/admin">;

// The admin page shows this many of the newest goodbyes, to delete one that shouldn't be there.
const ADMIN_MESSAGES = 50;

// The host's view: the room, everyone in it with their login code, the newest goodbyes. Only to
// the admin token (`forbidden` otherwise).
export const GET = handlingApiErrors(ROUTE, async (request: Request, { params }: Context) => {
  const room = await requireAdmin(request, (await params).slug);
  const [players, hostIds, messages] = await Promise.all([
    listPlayers(room.id),
    listHostIds(room.id),
    listWallMessages(room.id),
  ]);
  const codes = await findLoginCodes(players.map((player) => player.userId));
  const body: AdminRoomDto = {
    room: toRoomDto(room),
    players: players.map((player) => ({
      user_id: player.userId,
      display_name: player.displayName,
      is_host: hostIds.includes(player.userId),
      code: codes.get(player.userId) ?? null,
    })),
    messages: messages
      .slice(-ADMIN_MESSAGES)
      .reverse()
      .map((m) => ({
        id: m.id,
        display_name: m.displayName,
        body: m.body,
        created_at: m.createdAt,
      })),
  };
  return NextResponse.json(body, { headers: { "cache-control": "no-store" } });
});
