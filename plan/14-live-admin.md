# 14 — The host's page, live

**Goal:** the admin page follows the room as it changes — a vote, a player joining, a goodbye
posted — without a reload, so "3 of 5 voted" is true while the host is looking at it.
**Depends on:** 07, 13
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~14.1 — `useAdminChannel`: the room's channel on the admin page, a change re-reads the host's view (S)~~
- [x] ~~14.2 — check it in the browser: a vote cast in the room shows on the admin page by itself (S)~~

## Done when
With the room open in one tab and its admin page in another, a vote cast in the room moves the
admin page's count and names within a second or two, with no reload or Refresh.

## Notes
- No schema change: the tables were already in the Realtime publication, readable to anon, so the
  page needs no session to listen.
- Checked against a stubbed admin answer (no test room in the live database): the page joins
  `realtime:room:<id>` with the room's table filters, the channel's change on connect re-reads the
  host's view, and the panel moves from "1 of 2 voted" to "everyone has voted" with no reload. A
  real row change takes the same `onChange` path as the room's screens.
- The page is not tracked in presence, so the host's admin tab is not counted as online.
