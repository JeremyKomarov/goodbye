# 15 — The host's page and the room, tested end to end

**Goal:** `npm run e2e` covers the host's page and a visitor's way through a room as well as the
landing wizard, and the admin database test checks `has_voted` both ways.
**Depends on:** 12, 13, 14
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~15.1 — `e2e/admin.spec.ts`: the reminder, the live re-read, the closed vote, a deletion, a wrong link, an unknown room (M)~~
- [x] ~~15.2 — the admin `*.db.test.ts` casts a vote and reads `has_voted: true` (S)~~
- [x] ~~15.3 — `e2e/room.spec.ts`: a throwaway room, joined under a name, a vote, still in after a reload (M)~~

## Done when
`npm run e2e` runs the host's page and the room at 360px and 1280px and passes; with
`useAdminChannel` taken out, the live case fails; no test room is left in the database.

## Notes
- The admin answer is stubbed in the browser (`page.route`), so no room is written. The unknown
  room's page is a real read of a slug no room has.
- The room is read on the server, which a browser stub can't reach, so `room.spec.ts` writes: a
  throwaway room ("e2e — delete me") through `POST /api/rooms`, deleted in `finally` with every
  user who joined it. It loads `.env.local` (the config) and skips without the secret key. Run
  with the owner's go-ahead, since the database holds live rooms.
- `e2e/` has its own lint zone: it may import `@supabase/supabase-js` and read `process.env`;
  `src/` stays out of reach.
- `npm run test:db`: 34 passed, the new `has_voted: true` case with them. No test room left after
  either run.
