# 15 — The host's page, tested end to end

**Goal:** `npm run e2e` covers the host's page as well as the landing wizard, and the admin
database test checks `has_voted` both ways.
**Depends on:** 12, 13, 14
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~15.1 — `e2e/admin.spec.ts`: the reminder, the live re-read, the closed vote, a deletion, a wrong link, an unknown room (M)~~
- [x] ~~15.2 — the admin `*.db.test.ts` casts a vote and reads `has_voted: true` (S)~~

## Done when
`npm run e2e` runs the host's page at 360px and 1280px and passes; with `useAdminChannel` taken
out, the live case fails.

## Notes
- The admin answer is stubbed in the browser (`page.route`), so no room is written. The unknown
  room's page is a real read of a slug no room has.
- Joining and voting in the room are not covered: the room is read on the server, which a browser
  stub can't reach, so that run needs a real throwaway room in the live database.
- The `has_voted: true` case runs with `npm run test:db`, which writes a throwaway room and deletes
  it afterwards; not run here without the go-ahead.
