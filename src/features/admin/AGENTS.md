# `admin`

The host's page, opened from the admin link: prove the admin token, then close or reopen voting,
press "I left the group" (or undo it), delete wall messages, and see every player's login code.
Feature flag: `admin`, off while phase 07 builds it. Route: `/r/[slug]/admin`.

## Status

| Endpoint | Status | Source |
|---|---|---|
| `API_ENDPOINTS.rooms.admin` (GET) | Live, admin token in `ADMIN_TOKEN_HEADER`. The room, every player with `is_host` and their login code, and the newest 50 goodbyes, newest first; `forbidden` for a missing or wrong token. | `app/api/rooms/[slug]/admin/route.ts` |

## Inventory

| File | What |
|---|---|
| `hooks/useAdminRoom.ts` | `useQuery` on `QUERY_KEYS.room.admin(slug)` → `AdminRoom`, once there is a token; a refusal is not retried. |
| `api/admin.dto.ts` | `AdminRoomDtoSchema` — around the shared `RoomDtoSchema`. |
| `api/admin.mapper.ts` | `mapAdminRoomDto`. |
| `api/admin.api.ts` | `fetchAdminRoom(slug, token)`. |
| `types/admin.types.ts` | `AdminRoom`, `AdminPlayer`, `AdminMessage`. |

## Ownership

- Every host-only action, behind `server/auth/admin.ts`'s `requireAdmin`.
- Not the token's issue — `landing` receives it once, at creation — and not the host's claim on
  the room, which the room makes when its browser holds the token.

## Next real work

Phase 07 (`plan/07-admin.md`): the host's actions, then the page.
