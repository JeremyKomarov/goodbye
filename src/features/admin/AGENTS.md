# `admin`

The host's page, opened from the admin link: prove the admin token, then close or reopen voting,
press "I left the group" (or undo it), delete wall messages, and see every player's login code.
Feature flag: `admin`, off while phase 07 builds it. Route: `/r/[slug]/admin`.

## Status

| Endpoint | Status | Source |
|---|---|---|
| `API_ENDPOINTS.rooms.admin` (GET) | Live, admin token in `ADMIN_TOKEN_HEADER`. The room, every player with `is_host` and their login code, and the newest 50 goodbyes, newest first; `forbidden` for a missing or wrong token. | `app/api/rooms/[slug]/admin/route.ts` |
| `API_ENDPOINTS.rooms.admin` (PATCH) | Live, admin token. `AdminActionInputSchema` (shared): `lock`, `reopen` (`votingClosesAt`; `close_time_in_past` / `no_slots_after_close` on it), `exit` (locks first if the vote is over and unlocked; a second press keeps the first time), `undo_exit`. Answers the `RoomDto`. | `app/api/rooms/[slug]/admin/route.ts` |
| `API_ENDPOINTS.rooms.adminMessage` (DELETE) | Live, admin token. Removes this room's goodbye. 204. | `app/api/rooms/[slug]/admin/messages/[messageId]/route.ts` |

## Inventory

| File | What |
|---|---|
| `components/AdminScreen` | The page (`app/[locale]/r/[slug]/admin/page.tsx` reads the slug inside `<Suspense>`): the heading, the private-page warning, and the panels — or "this admin link doesn't work" for no token or a wrong one. |
| `components/AdminControls` | The room's state; "I left the group" (warning first if early or mid-vote), close the vote now, move the close or reopen (`ReopenForm`, the handler's codes on its field), undo the exit; forget admin on this device. Every action asks first. |
| `components/AdminWall` | The newest goodbyes, each with Delete (asks first); Refresh. |
| `components/PlayerCodes` | Every player but the host with their login code: copy it, or send it on WhatsApp with the room's link. |
| `components/AdminLink` | The admin link itself, to copy or send to yourself — the way back from another device. |
| `hooks/useLinkToken.ts` | The token from the link's `#k=` — kept in this browser and taken out of the address bar — or the one kept before. |
| `strings/admin.strings.ts` | The `admin` namespace, for the screen and its panels. |
| `hooks/useAdminRoom.ts` | `useQuery` on `QUERY_KEYS.room.admin(slug)` → `AdminRoom`, once there is a token; a refusal is not retried. |
| `hooks/useAdminAction.ts` | The host's actions. The room it answers goes straight into the host's view (the request's own answer, not an event), and the room is invalidated. |
| `hooks/useDeleteMessage.ts` | Removes a goodbye: out of the host's list once the server has, and the room invalidated. |
| `api/admin.dto.ts` | `AdminRoomDtoSchema` — around the shared `RoomDtoSchema`. |
| `api/admin.mapper.ts` | `mapAdminRoomDto`. |
| `api/admin.api.ts` | `fetchAdminRoom`, `runAdminAction`, `deleteMessage` — the token in `ADMIN_TOKEN_HEADER`. |
| `types/admin.types.ts` | `AdminRoom`, `AdminPlayer`, `AdminMessage`. |

## Ownership

- Every host-only action, behind `server/auth/admin.ts`'s `requireAdmin`.
- Not the token's issue — `landing` receives it once, at creation — and not the host's claim on
  the room, which the room makes when its browser holds the token.

## Next real work

Phase 07 (`plan/07-admin.md`): the host's actions, then the page.
