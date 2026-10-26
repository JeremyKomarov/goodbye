# 25 — A deletion reaching its own room, checked live

**Goal:** phase 16's broadcast is proved on the hosted database.
**Depends on:** 16
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~25.1 — with `20261024000000_room_delete_broadcast.sql` applied, a vote deleted in one throwaway room is heard on that room's channel and not another's (S)~~

## Done when
The check prints PASS, and its two rooms are deleted after.

## Notes
- Waits on the owner applying the migration in the SQL Editor (16's client already needs it).
- 2026-10-26: applied; the check printed PASS (`{"a":["votes"],"b":[]}`), its rooms deleted, none left.
