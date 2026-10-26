# 27 — A new login code never strands a browser

**Goal:** a browser left in the moment a new login code signs its user out signs back in on its next
load, instead of answering 401 until its token runs out.
**Depends on:** 05
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~27.1 — keep the new code on the device before signing back in with it, and sign back in on load when the session is refused (M)~~
- [x] ~~27.2 — test it: the order of the steps, and a browser whose session was revoked (S)~~

## Done when
A page closed between a code being made and the browser signing back in is, on its next load,
signed in again as the same player, with no 401 in between.

## Notes
`useLoginCode` keeps the code before signing back in (`keepAndSignIn`); `useEnsureLoginCode` calls
`restoreSession` once a load for a player with a kept code. supabase-js answers Auth's
`403 session_not_found` as an `AuthSessionMissingError` (checked live), and clears the stored
session itself; the sign-in puts a new one there. Tested in `session.test.ts`,
`useLoginCode.test.ts` and `e2e/room.spec.ts` (which fails with a 401 on the vote without it).
A limit: a page closed for longer than its token lives is signed out by the client's own refresh
before it loads, and comes back as a new visitor — who can still come in with the code.
