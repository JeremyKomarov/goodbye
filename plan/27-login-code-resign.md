# 27 — A new login code never strands a browser

**Goal:** a browser left in the moment a new login code signs its user out signs back in on its next
load, instead of answering 401 until its token runs out.
**Depends on:** 05
**Status:** not started

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [ ] 27.1 — keep the new code on the device before signing back in with it, and sign back in on load when the session is refused (M)
- [ ] 27.2 — test it: the order of the steps, and a browser whose session was revoked (S)

## Done when
A page closed between a code being made and the browser signing back in is, on its next load,
signed in again as the same player, with no 401 in between.

## Notes
