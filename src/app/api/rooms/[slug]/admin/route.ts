import { NextResponse } from "next/server";
import { API_ERROR_CODES } from "@/core/api/api-error";
import { MIN_OPEN_MS, ROOM_STATUSES } from "@/core/constants/room.const";
import type { AdminRoomDto } from "@/features/admin/api/admin.dto";
import { ADMIN_ACTIONS, AdminActionInputSchema } from "@/shared/api/admin-action.dto";
import { hasSlotAfter } from "@/shared/utils/slots";
import { apiError, handlingApiErrors } from "@/server/api/error-response.server";
import { toRoomDto } from "@/server/api/room-snapshot.server";
import { requireAdmin } from "@/server/auth/admin";
import { listHostIds } from "@/server/db/hosts.repo";
import { findLoginCodes } from "@/server/db/login-codes.repo";
import { listPlayers } from "@/server/db/players.repo";
import {
  lockRoomNow, markExited, reopenRoom, undoExit, type RoomRecord,
} from "@/server/db/rooms.repo";
import { listVotes } from "@/server/db/votes.repo";
import { listWallMessages } from "@/server/db/wall.repo";

const ROUTE = "/api/rooms/[slug]/admin";
type Context = RouteContext<"/api/rooms/[slug]/admin">;

// The admin page shows this many of the newest goodbyes, to delete one that shouldn't be there.
const ADMIN_MESSAGES = 50;

// The host's view: the room, everyone in it with their login code and whether they have voted, the
// newest goodbyes. Only to the admin token (`forbidden` otherwise).
export const GET = handlingApiErrors(ROUTE, async (request: Request, { params }: Context) => {
  const room = await requireAdmin(request, (await params).slug);
  const [players, hostIds, messages, votes] = await Promise.all([
    listPlayers(room.id),
    listHostIds(room.id),
    listWallMessages(room.id),
    listVotes(room.id),
  ]);
  const voterIds = new Set(votes.map((vote) => vote.userId));
  const codes = await findLoginCodes(players.map((player) => player.userId));
  const body: AdminRoomDto = {
    room: toRoomDto(room),
    players: players.map((player) => ({
      user_id: player.userId,
      display_name: player.displayName,
      is_host: hostIds.includes(player.userId),
      code: codes.get(player.userId) ?? null,
      has_voted: voterIds.has(player.userId),
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

// The host's actions on their room, each answering the room as it now is. Realtime carries the
// change to every open screen of the room.
export const PATCH = handlingApiErrors(ROUTE, async (request: Request, { params }: Context) => {
  const room = await requireAdmin(request, (await params).slug);
  const parsed = AdminActionInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError(API_ERROR_CODES.invalid_input, { route: ROUTE });
  const input = parsed.data;

  let next: RoomRecord;
  if (input.action === ADMIN_ACTIONS.lock) {
    next = await lockRoomNow(room.id);
  } else if (input.action === ADMIN_ACTIONS.reopen) {
    const closesAt = Date.parse(input.votingClosesAt);
    const field = "votingClosesAt";
    if (closesAt < Date.now() + MIN_OPEN_MS)
      return apiError(API_ERROR_CODES.close_time_in_past, { route: ROUTE, field });
    if (!hasSlotAfter(room, closesAt))
      return apiError(API_ERROR_CODES.no_slots_after_close, { route: ROUTE, field });
    next = await reopenRoom(room.id, new Date(closesAt).toISOString());
  } else if (input.action === ADMIN_ACTIONS.exit) {
    // The vote is over but no screen has asked for the result yet: lock it first, so the exit is
    // measured against the hour the group chose.
    const isOver =
      room.status === ROOM_STATUSES.voting && Date.parse(room.votingClosesAt) <= Date.now();
    if (isOver) await lockRoomNow(room.id);
    next = (await markExited(room.id)) ?? room;
  } else {
    next = room.status === ROOM_STATUSES.exited ? await undoExit(room) : room;
  }
  return NextResponse.json(toRoomDto(next));
});
