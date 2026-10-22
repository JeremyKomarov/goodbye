# 05 — Room core

**Goal:** the room link opens the room — a visitor joins under a name (or as themselves from
another device, with their code), votes on the exit hour, and watches the heatmap and the
countdown change live — and the `room` flag is on.
**Depends on:** 03, 04
**Status:** in progress

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~05.1 — read a room: `GET /api/rooms/[slug]` (room, players, hosts, votes), repos, `useRoom` (M)~~
- [x] ~~05.2 — the browser session in `core/supabase/`, the bearer check, a user-scoped db client (M)~~
- [x] ~~05.3 — join: `PUT /api/rooms/[slug]/me` (join, rename, `name_taken`), the host claim (M)~~
- [x] ~~05.4 — JoinGate and Welcome, over the room's header (L)~~
- [x] ~~05.5 — vote: `PUT`/`DELETE /api/rooms/[slug]/vote`, optimistic `useVote`, tally and lead (M)~~
- [x] ~~05.6 — VoteHeatmap and VoteLegend (L)~~
- [x] ~~05.7 — the countdown: `POST /api/rooms/[slug]/finalize`, `Hero` with `FlipDigits` (M)~~
- [x] ~~05.8 — Realtime: one channel per room; a change invalidates `QUERY_KEYS.room` (S)~~
- [~] 05.9 — login codes and `MeSheet`: rename, your code, sign in as yourself, "not you?" (L)
- [ ] 05.10 — RoomScreen on `/r/[slug]`, `enable-feature room`, checked in two browsers (M)

## Done when
Two browsers, one of them private, open the same room link and join under different names; a vote
in one shows in the other's heatmap without a reload; a room whose voting has closed locks to the
winning hour and both show its countdown. Typing the first browser's name in the second asks for a
code, and the code from the first browser's sheet signs the second in as that player. Checked in
Hebrew and English with no `MISSING_MESSAGE`; rooms made while checking are deleted afterwards.

## Notes
- `BUTTON_VARIANTS.link` joined the kit: "Hi {name}" in the header, and later "not me" and "take
  back my vote", are phrases inside a sentence, and the kit forbids a styled raw button.
- The exit row only shows progress for now; tapping it to mark the exit is the host's, in 07.
  The finale replay and the calendar and share actions under the hero are 09.
- The heatmap's chips and day tabs are native buttons, recorded as `docs/DECISIONS.md #7`.
- An unknown room renders `RoomNotFound` with status 200, not 404: the page streams its shell
  before the room is read inside `<Suspense>`, as the original did. Next marks it `noindex`.
- The wall, presence, typing and the emoji rain are 06; the host's controls and the admin page
  are 07. The room's tab bar arrives with the second tab, in 06.
