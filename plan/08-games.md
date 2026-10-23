# 08 — Games

**Goal:** the room has its games — a hub, Runaway, Catch, Trivia and the Picture game — each score
kept and ranked live for everyone in the room, and a board with the most wanted hours and every
game's top ten; the games close once the host has left; the `games` flag is on.
**Depends on:** 05, 06
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~08.1 — scores: the repo, `GET`/`POST /api/rooms/[slug]/scores`, the shared records, live (M)~~
- [x] ~~08.2 — the room's frame for other features; the hub, a game's screen, its result and score (L)~~
- [x] ~~08.3 — Runaway: the exit button that runs away (M)~~
- [x] ~~08.4 — Catch: pop the notifications, never the boss (M)~~
- [x] ~~08.5 — Trivia: ten questions, in both languages (M)~~
- [x] ~~08.6 — the Picture game: the stage, the curtain, the pictures, in both languages (L)~~
- [x] ~~08.7 — the board: the most wanted hours and every game's records; the sections' live lines (M)~~
- [x] ~~08.8 — `enable-feature games`; checked in two browsers, both locales (M)~~

## Done when
Two players in one room, in two browsers: one finishes a game and the other's hub, the game's
record line and the board show the new record without a reload; the result says "new record of
the room" or the place out of how many. After the host's exit the hub says the games are closed
and a score is refused. Checked in Hebrew and English at 360 and 1280; rooms made while checking
are deleted afterwards.

## Notes
- The games are their own feature but sections of the room: they read it through the shared
  `useRoomFrame` (docs/DECISIONS.md #9), and the records through the shared `useRecords`, which
  the room's board and nav line read too. A game's pieces are native buttons (#10).
- The board is the room's (`/r/[slug]/board`, under the `room` flag): the most wanted hours are
  votes, and the records are shared.
- Every question, picture name and taunt is in both languages; a picture's accepted guesses take
  either. The picture backdrops are `--picture-*` tokens.
- Fixed on the way: a request sent right after joining could carry a token the new login code had
  just revoked (a 401 on the first score). Requests now wait while the code signs back in
  (`holdingSession` in `core/supabase/session.ts`).
- Checked with two players (Hebrew 360, English 1280): B's Runaway record reached A's hub and
  bar live; the host's exit closed A's hub (tiles no longer links, the link to the board) and took
  "another round" off B's result; a score sent afterwards got `games_closed`. Every game played
  through in both locales, no overflow at 360. `test:db`: 29 passed. The probe rooms and their 23
  users were deleted; the project is back to its six rooms.
