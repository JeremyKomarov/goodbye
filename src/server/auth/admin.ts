import "server-only";
import { API_ERROR_CODES, ApiError } from "@/core/api/api-error";
import { ADMIN_TOKEN_HEADER } from "@/core/constants/api-endpoints.const";
import { findAdminTokenHash, findRoomBySlug, type RoomRecord } from "@/server/db/rooms.repo";
import { tokenMatches } from "./admin-token";

// A token is 32 random bytes; anything much shorter is not one, and isn't worth a database read.
const MIN_TOKEN_LENGTH = 20;

/**
 * The room, for a request carrying its admin token — the first line of every host-only handler.
 * Throws `not_found` for an unknown room and `forbidden` for a missing or wrong token: the same
 * answer for both, so a token can't be probed against a room.
 */
export async function requireAdmin(request: Request, slug: string): Promise<RoomRecord> {
  const token = request.headers.get(ADMIN_TOKEN_HEADER) ?? "";
  const room = await findRoomBySlug(slug);
  if (!room) throw new ApiError(API_ERROR_CODES.not_found, 404);
  const hash = token.length >= MIN_TOKEN_LENGTH ? await findAdminTokenHash(room.id) : null;
  if (!hash || !tokenMatches(token, hash)) throw new ApiError(API_ERROR_CODES.forbidden, 403);
  return room;
}
