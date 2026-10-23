# 17 — End to end on every push, and no test room left behind

**Goal:** CI runs `npm run e2e` on every push, without the database, and a test room that a killed
run left behind is swept before the next run.
**Depends on:** 15
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~17.1 — `e2e/sweep.ts`: delete "— delete me" rooms over an hour old, and users only in them; global setup of `npm run e2e` and `npm run test:db` (S)~~
- [x] ~~17.2 — a CI job runs `npm run e2e` with `E2E_NO_DATABASE`, so what writes or reads the database skips (S)~~

## Done when
The `e2e` job is green on GitHub with the database tests skipped; a test room backdated two hours
is swept and a fresh one is not.

## Notes
- CI has no secret key, by choice: a push should not write to the live database. The server needs
  some value to boot, so the job sets a placeholder, and `E2E_NO_DATABASE` skips the room's run
  and the unknown-room read. The public URL and publishable key are repository variables.
- Checked locally: 18 passed with the database; 14 passed, 4 skipped with `E2E_NO_DATABASE=1`.
  The sweep took a backdated room and left a fresh one.
