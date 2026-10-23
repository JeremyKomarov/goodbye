# 24 — The features' logic, tested

**Goal:** the decisions inside admin, games and landing that pick what a person sees have unit tests.
**Depends on:** 07, 08, 04
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~24.1 — find the untested deciding logic in the three features (S)~~
- [x] ~~24.2 — tests for it, moving logic out of a component into a util where it has to be (M)~~

## Done when
`npm run test` covers each feature's deciding logic, and fails if it is changed.

## Notes
- Taken out of components and hooks into utils, each with its test: `voteProgress` (admin);
  `triviaPoints`, `dealPictures`, `pickNoticeKind` and the one `shuffle` the two rounds had copied
  (games); `openSlotCount`, `wizardCode` (landing). `mapAdminRoomDto` is tested where it is.
- Content held to itself: every picture's thing, named as the game shows it, is a right guess in
  both languages; every icon is on disk; the Catch weights add up to 1; a perfect Trivia round fits
  the database's range; `FORM_STEPS` asks for every field the schema checks but the two it fills.
- Two bugs it found, fixed: typing "a TV" — the game's own name for it — was a wrong guess, since
  an English article was forgiven only as a typo, and short words get none (`matches` now drops
  "a", "an", "the" like the Hebrew "ה"); and `wizardCode` used `in`, so "toString" was a code.
