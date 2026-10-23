# 08 — Games

**Goal:** the room has its games — a hub, Runaway, Catch, Trivia and the Picture game — each score
kept and ranked live for everyone in the room, and a board with the most wanted hours and every
game's top ten; the games close once the host has left; the `games` flag is on.
**Depends on:** 05, 06
**Status:** in progress

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~08.1 — scores: the repo, `GET`/`POST /api/rooms/[slug]/scores`, the shared records, live (M)~~
- [x] ~~08.2 — the room's frame for other features; the hub, a game's screen, its result and score (L)~~
- [~] 08.3 — Runaway: the exit button that runs away (M)
- [ ] 08.4 — Catch: pop the notifications, never the boss (M)
- [ ] 08.5 — Trivia: ten questions, in both languages (M)
- [ ] 08.6 — the Picture game: the stage, the curtain, the pictures, in both languages (L)
- [ ] 08.7 — the board: the most wanted hours and every game's records; the sections' live lines (M)
- [ ] 08.8 — `enable-feature games`; checked in two browsers, both locales (M)

## Done when
Two players in one room, in two browsers: one finishes a game and the other's hub, the game's
record line and the board show the new record without a reload; the result says "new record of
the room" or the place out of how many. After the host's exit the hub says the games are closed
and a score is refused. Checked in Hebrew and English at 360 and 1280; rooms made while checking
are deleted afterwards.

## Notes
