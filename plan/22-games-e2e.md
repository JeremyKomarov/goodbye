# 22 — The games, played end to end

**Goal:** each of the four games is played in a browser in a real room, and its score is kept.
**Depends on:** 08, 17
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~22.1 — `e2e/rooms.ts`: the throwaway room's making and deleting, shared with `room.spec.ts` (S)~~
- [x] ~~22.2 — `e2e/games.spec.ts`: a player seated in a throwaway room plays each game to its score, the POST answered 204 (M)~~

## Done when
`npm run e2e` plays Catch, Picture, Runaway and Trivia at 360px and 1280px and sees each score
kept (204). The room is read on the server, so a browser stub can't stand in: like `room.spec.ts`
it writes a throwaway room, deletes it after, and skips without the secret key (so in CI).

## Notes
- Supabase allows an address 30 anonymous sign-ins an hour, and a run of joins used them up
  (`429 over_request_rate_limit`). So the games' player is seated, not joined (`seatPlayer`):
  made with the secret key, given a stored login code, and signed in with it from the test —
  password sign-ins are not that scarce. Joining stays `room.spec.ts`'s, at four sign-ins a run.
- The code is stored up front because the room makes one for a player who has none, and making one
  signs out every session of the user until the browser signs back in.
- Seen on the way, not fixed here: if a page is left in the moment between a new code signing the
  user out and the browser signing back in with it, that browser keeps a revoked session — its
  requests answer 401 until the token expires. The code isn't kept on the device either, so
  nothing signs it back in. Worth its own phase.
- Played fast, not well: Trivia answers the first option, Picture skips, Catch runs out its 30 s,
  Runaway is pressed twice a frame apart. Each is a first room record. 20/20 over two repeats.
