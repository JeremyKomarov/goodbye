# `landing`

**Status: not built yet — the create-room chain exists end to end; no screen calls it yet.**

The home page: a WhatsApp-style chat that walks the host through opening a room — why they are
leaving, when voting closes, their name — and hands back the room link and the admin link.
Feature flag: `landing`; route: `/`.

## Current behavior

Coming soon. The route is built with `featurePage(FEATURE_KEYS.landing)` and renders the shared
disabled shell — not a 404, and not a half-working screen.

## Planned ownership

- The hero chat, the three-step create wizard (reason, schedule, identity) and the success card.
- The wizard's draft, in a feature-local store, until it is submitted.
- Not the room itself, and not the admin token after creation — those are `room`'s and `admin`'s.

## Status

| Endpoint | Handler | What is real now |
|---|---|---|
| `API_ENDPOINTS.rooms.create` | `app/api/rooms/route.ts` | Real: validates with `CreateRoomInputSchema`, writes the room and its admin-token hash to Supabase, answers `{ slug, admin_token }` (201), or `invalid_input` / `close_time_in_past` / `no_slots_after_close` with the field. Called by `useCreateRoom`; no screen yet. |

## Inventory

| File | What |
|---|---|
| `api/rooms.dto.ts` | `CreateRoomInputSchema` (shared by the wizard and the handler), `CreatedRoomDtoSchema`, `HOST_GENDERS`, `LEAVE_REASONS`, the length limits. |
| `api/rooms.mapper.ts` | `mapCreatedRoomDto` — `admin_token` → `adminToken`. |
| `api/rooms.api.ts` | `createRoom(input)` — parses the input before sending, throws `ApiError` with the handler's code and field. |
| `types/room.types.ts` | `CreatedRoom` — `slug`, `adminToken`. |
| `components/HeroChat` | The scripted group chat: `story` picks the opening (`OPENERS`), a new story plays a correction (`CORRECTIONS`); the header previews `hostName` / `groupName`. Partials: ChatHeader, ChatLine, TypingDots, ClosingCountdown (decorative). |
| `hooks/useCreateRoom.ts` | The mutation. Invalidates nothing: no query holds rooms until phase 05. |

## Next real work

Phase 04 (`plan/04-landing.md`): the hero chat, the wizard that submits through `useCreateRoom`,
and the success card.
