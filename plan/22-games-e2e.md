# 22 — The games, played end to end

**Goal:** each of the four games is played in a browser and its score is sent, on every push.
**Depends on:** 08, 17
**Status:** not started

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [ ] 22.1 — `e2e/games.spec.ts`: the hub and each game against a stubbed room, its score's POST checked (M)

## Done when
`npm run e2e` plays Catch, Picture, Runaway and Trivia at 360px and 1280px and sees each send a
score in range; it writes nothing, so CI runs it too.

## Notes
