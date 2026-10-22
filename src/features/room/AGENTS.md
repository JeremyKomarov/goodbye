# `room`

The party room everyone joins from the link: join with a name, vote on the exit hour, the
countdown once it locks, the farewell wall, presence and the emoji rain, and the finale when the
host leaves. Feature flag: `room`, off while phase 05 builds it — the route renders the shared
disabled shell until then. Route: `/r/[slug]`.

## Status

| Endpoint | Status | Source |
|---|---|---|
| `API_ENDPOINTS.rooms.one` (GET) | Live, no session needed. The room, its players, host ids and votes in one `RoomSnapshotDto`; `not_found` for an unknown or malformed slug. | `app/api/rooms/[slug]/route.ts` |

## Inventory

| File | What |
|---|---|
| `hooks/useRoom.ts` | `useQuery` on `QUERY_KEYS.room.snapshot(slug)` → `RoomSnapshot`. |
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
