# 16 — A deletion reaches its own room only

**Goal:** a vote withdrawn, a reaction taken back or a goodbye deleted re-reads only the room it was
in, instead of every open room page and host's page.
**Depends on:** 06, 14
**Status:** in progress

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~16.1 — a migration: deletes on `votes`, `wall_messages` and `wall_reactions` broadcast to `room:<id>` (S)~~
- [x] ~~16.2 — `joinRoomChannel` listens for that broadcast and drops the unfiltered delete listeners (S)~~
- [~] 16.3 — check it live: a delete in one room reaches that room's channel and not another's (S)

## Done when
With the migration applied, a vote withdrawn in one room re-reads that room's page and no other's;
the unfiltered `DELETE` subscriptions are gone from `core/supabase/realtime.ts`.

## Notes
