# `admin`

The host's page, opened from the admin link: prove the admin token, then close or reopen voting,
press "I left the group" (or undo it), see who has not voted and remind the group, delete wall
messages, see every player's login code, and send the group the decision and the goodbye.
Feature flag: `admin`, enabled. Route: `/r/[slug]/admin`; the room's header links here for the
host's browser, and the room's exit row sends the same `exit` action.

## Status

| Endpoint | Status | Source |
|---|---|---|
| `API_ENDPOINTS.rooms.admin` (GET) | Live, admin token in `ADMIN_TOKEN_HEADER`. The room, every player with `is_host`, their login code and `has_voted`, and the newest 50 goodbyes, newest first; `forbidden` for a missing or wrong token. | `app/api/rooms/[slug]/admin/route.ts` |
| `API_ENDPOINTS.rooms.admin` (PATCH) | Live, admin token. `AdminActionInputSchema` (shared): `lock`, `reopen` (`votingClosesAt`; `close_time_in_past` / `no_slots_after_close` on it), `exit` (locks first if the vote is over and unlocked; a second press keeps the first time), `undo_exit`. Answers the `RoomDto`. | `app/api/rooms/[slug]/admin/route.ts` |
| `API_ENDPOINTS.rooms.adminMessage` (DELETE) | Live, admin token. Removes this room's goodbye. 204. | `app/api/rooms/[slug]/admin/messages/[messageId]/route.ts` |

## Inventory

| File | What |
|---|---|
| `components/AdminScreen` | The page (`app/[locale]/r/[slug]/admin/page.tsx` reads the slug inside `<Suspense>`): the heading, the private-page warning, and the panels — or "this admin link doesn't work" for no token or a wrong one. |
| `components/AdminControls` | The room's state; "I left the group" (warning first if early or mid-vote), close the vote now, move the close or reopen (`ReopenForm`, the handler's codes on its field), undo the exit; forget admin on this device. Every action asks first. |
| `components/AdminWall` | The newest goodbyes, each with Delete (asks first); Refresh. |
| `components/GroupMessages` | The host's messages to the group — the shared `ShareMessages`, the same as the room's sheet — under the controls. |
| `components/VoteReminder` | While the vote is open and someone but the host has joined: "3 of 5 voted", a bar, the names still to vote, and one WhatsApp reminder to the group naming them, with the close time and the room's link. Everyone in: says so. |
| `components/PlayerCodes` | Every player but the host with their login code: copy it, or send it on WhatsApp with the room's link. |
| `components/AdminLink` | The admin link itself, to copy or send to yourself — the way back from another device. |
| `hooks/useLinkToken.ts` | The token from the link's `#k=` — kept in this browser and taken out of the address bar — or the one kept before. |
| `strings/admin.strings.ts` | The `admin` namespace, for the screen and its panels. |
| `hooks/useAdminChannel.ts` | The room's live channel on this page, once the host's view has loaded: any change but a score re-reads `room.admin` (settled over 150ms), so the count, the names and the wall follow the room. Nothing tracked or sent. |
| `hooks/useAdminRoom.ts` | `useQuery` on `QUERY_KEYS.room.admin(slug)` → `AdminRoom`, once there is a token; a refusal is not retried. |
| `hooks/useAdminAction.ts` | The host's actions. The room it answers goes straight into the host's view (the request's own answer, not an event), and the room is invalidated. |
| `hooks/useDeleteMessage.ts` | Removes a goodbye: out of the host's list once the server has, and the room invalidated. |
| `api/admin.dto.ts` | `AdminRoomDtoSchema` — around the shared `RoomDtoSchema`. |
| `api/admin.mapper.ts` | `mapAdminRoomDto`. |
| `api/admin.api.ts` | `fetchAdminRoom`, `runAdminAction`, `deleteMessage` — the token in `ADMIN_TOKEN_HEADER`. |
| `types/admin.types.ts` | `AdminRoom`, `AdminPlayer` (with `hasVoted`), `AdminMessage`. |

## Ownership

- Every host-only action, behind `server/auth/admin.ts`'s `requireAdmin`.
- Not the token's issue — `landing` receives it once, at creation — and not the host's claim on
  the room, which the room makes when its browser holds the token.

## Next real work

None planned. Phase 13 added `VoteReminder`; phase 14 made the page live (`useAdminChannel`).
