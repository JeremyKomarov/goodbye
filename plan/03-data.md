# 03 — Data layer

**Goal:** a room can be created through `POST /api/rooms` — validated by the schema the landing
form will share, written by `server/db/`, guarded by the Supabase lint zone — against the hosted
project the original app already uses.
**Depends on:** 01
**Status:** in progress

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~03.1 — ESLint zone: `@supabase/supabase-js` only in `server/db/` and `core/supabase/` (S)~~
- [x] ~~03.2 — port the slot logic and its tests to `shared/utils/slots.ts` (S)~~
- [x] ~~03.3 — `server/db/client.ts` and `rooms.repo.ts`: create a room with its secret, find by slug (M)~~
- [x] ~~03.4 — `server/auth/admin-token.ts`: new token, hash, constant-time match, with tests (S)~~
- [x] ~~03.5 — `POST /api/rooms`: shared input schema, response DTO, endpoint const, handler (M)~~
- [~] 03.6 — `npm run test:db`: create a room through the handler, read it back, delete it (S)

## Done when
`npm run test:db` posts to the handler, finds the new row and its admin-token hash in Supabase,
and removes them; a bad window answers `no_slots_after_close`. `npm run verify` passes without
the database (the test skips when no secret key is in the environment).

## Notes
- The hosted project already carries every migration in `supabase/migrations/` and live rooms from
  the original app (`docs/DECISIONS.md #1`), so nothing is applied here and no local Supabase is
  needed. The database test cleans up after itself.
- Moved to 05, where their first caller is: the browser module in `core/supabase/` (anonymous
  session, Realtime), the bearer check, and login codes. Building them here would leave them with
  no caller for two phases.
