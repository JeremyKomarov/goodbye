# `room`

The party room everyone joins from the link: join with a name, vote on the exit hour, the
countdown once it locks, the farewell wall, presence and the emoji rain, and the finale when the
host leaves. Feature flag: `room`, off while phase 05 builds it — the route renders the shared
disabled shell until then. Route: `/r/[slug]`.

## Status

| Endpoint | Status | Source |
|---|---|---|
| `API_ENDPOINTS.rooms.one` (GET) | Live, no session needed. The room, its players, host ids and votes in one `RoomSnapshotDto`; `not_found` for an unknown or malformed slug. | `app/api/rooms/[slug]/route.ts` |
| `API_ENDPOINTS.rooms.me` (PUT) | Live, bearer. Join under `{ name }` or rename; written as the caller, so `name_taken` (on `name`) comes from the database's trigger. 204. | `app/api/rooms/[slug]/me/route.ts` |
| `API_ENDPOINTS.rooms.vote` (PUT, DELETE) | Live, bearer. `{ slotStart }` casts or moves the caller's vote; DELETE takes it back. `voting_closed` after the close, `invalid_input` on `slotStart` for an hour outside the window, `forbidden` for the host. 204. | `app/api/rooms/[slug]/vote/route.ts` |
| `API_ENDPOINTS.rooms.hosts` (POST) | Live, bearer. `{ adminToken }` makes the caller a host device; `forbidden` for a wrong token. Idempotent, 204. | `app/api/rooms/[slug]/hosts/route.ts` |

## Inventory

| File | What |
|---|---|
| `components/RoomScreen` | The screen: `RoomHeader`, the room's main column, `Welcome`, and `JoinGate` until `useIdentity` is ready. Takes the snapshot the page read on the server as `initial`. |
| `components/RoomHeader` | The chat header: group avatar and name, "Hi {name}" (a link to `onMe`) and how many are in the room; `children` fill its end. |
| `components/JoinGate` | Covers the room until this browser has a name in it: whose room, why, how many voted; the name form on `SaveNameInputSchema`. `name_taken` reads as the host's name when it is, otherwise as taken. Carries the `LanguageSwitch`. |
| `components/Welcome` | The hello pill, "the room will remember you" or "welcome back". Keyed by user. |
| `components/RoomSkeleton` | The page's Suspense fallback, shaped like the room. |
| `components/RoomNotFound` | `app/[locale]/r/[slug]/not-found.tsx` renders it. |
| `strings/room.strings.ts` | The `room` namespace: `reason` (gendered), `votes`, `people` — said by more than one component. |
| `utils/names.ts` | `sameName` — the database's `norm_name()` comparison. |
| `hooks/useVote.ts` | `{ userId, slotMs }` (null takes it back), written into the snapshot before the request and rolled back on failure. Invalidates the room. |
| `api/votes.dto.ts` | `CastVoteInputSchema`. |
| `api/votes.api.ts` | `castVote`, `withdrawVote`. |
| `utils/tally.ts` | `tallyVotes`, `leadingSlot` (`Lead` with every tied slot), `wonByDraw`. |
| `hooks/useRoom.ts` | `useQuery` on `QUERY_KEYS.room.snapshot(slug)` → `RoomSnapshot`, seeded from the page's read. |
| `hooks/useIdentity.ts` | Who this browser is here: `state` (`IDENTITY_STATES` checking → join → ready), `me`, `isHost`, `returning`, `join`. Joins the host's browser under the host's name by itself, and claims the room for a host who joined unrecorded. |
| `hooks/useSessionUser.ts` | `useQuery` on `QUERY_KEYS.session.user` — this browser's user id or null. |
| `hooks/useJoinRoom.ts` | Signs in if needed, claims the room if this browser holds the admin token, saves the name. Invalidates the session user and the room. |
| `hooks/useClaimHost.ts` | The claim alone, for a host already in the room. Invalidates the room. |
| `hooks/useAdminToken.ts` | The admin token for this room from storage; null on the server. |
| `api/players.dto.ts` | `SaveNameInputSchema` (`MAX_PLAYER_NAME` 24), `ClaimHostInputSchema`. |
| `api/players.api.ts` | `saveName`, `claimHost` — both send the session's bearer. |
| `api/room.dto.ts` | `RoomDtoSchema`, `RoomSnapshotDtoSchema` — the wire shape, snake_case. |
| `api/room.mapper.ts` | `mapRoomDto`, `mapRoomSnapshotDto` — times become epoch milliseconds. |
| `api/room.api.ts` | `fetchRoom(slug)`. |
| `types/room.types.ts` | `Room` (a `RoomWindow`, so it builds its own slots), `Player`, `Vote`, `RoomSnapshot`. |

## Ownership

- The join gate (and signing in on a second device with a login code), voting, the heatmap,
  the countdown, the wall, presence, typing, reactions, the finale and the calendar export.
- The room's Realtime subscription, which invalidates query keys and nothing else
  (docs/DECISIONS.md #2).
- Not the games and not the host's controls — `games` and `admin`.

## Next real work

Phase 05 (`plan/05-room-core.md`): the session, joining, voting, the countdown, Realtime.
