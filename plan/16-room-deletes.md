# 16 — A deletion reaches its own room only

**Goal:** a vote withdrawn, a reaction taken back or a goodbye deleted re-reads only the room it was
in, instead of every open room page and host's page.
**Depends on:** 06, 14
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~16.1 — a migration: deletes on `votes`, `wall_messages` and `wall_reactions` broadcast to `room:<id>` (S)~~
- [x] ~~16.2 — `joinRoomChannel` listens for that broadcast and drops the unfiltered delete listeners (S)~~

## Done when
The migration is written and the unfiltered `DELETE` subscriptions are gone from
`core/supabase/realtime.ts`, the room's channel listening for the `deleted` broadcast instead.

## Notes
- The live check, once the migration is applied, moved to phase 25: it waits on the owner, and
  the phases after this one should not.
