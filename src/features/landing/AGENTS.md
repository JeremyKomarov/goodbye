# `landing`

**Status: not built yet — only the create-room contract exists (`api/rooms.dto.ts`).**

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
| `API_ENDPOINTS.rooms.create` | `app/api/rooms/route.ts` | Real: validates with `CreateRoomInputSchema`, writes the room and its admin-token hash to Supabase, answers `{ slug, admin_token }` (201), or `invalid_input` / `close_time_in_past` / `no_slots_after_close` with the field. No hook calls it yet. |

## Inventory

| File | What |
|---|---|
| `api/rooms.dto.ts` | `CreateRoomInputSchema` (shared by the wizard and the handler), `CreatedRoomDtoSchema`, `HOST_GENDERS`, `LEAVE_REASONS`, the length limits. |

## Next real work

Phase 04: the rest of the chain (types, mapper, fetcher, `useCreateRoom`) and the wizard that
submits to it.
