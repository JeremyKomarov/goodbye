# 10 — Room language

**Goal:** a room has one language, the one its host created it in, and everyone sees the whole room
in it — every section, the admin page, the link preview and the calendar file — whatever their
own browser's cookie says.
**Depends on:** 04, 05, 09
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~10.1 — add `rooms.locale` in a new migration, `he` for every room made before it (S)~~
- [x] ~~10.2 — store the landing's language as the room's when the host creates it (S)~~
- [x] ~~10.3 — render every page under `/r/<slug>` in the room's language, from the proxy (M)~~
- [x] ~~10.4 — the preview card and the calendar in the room's language; no language switch inside the room (S)~~
- [x] ~~10.5 — record the decision; check both languages end to end (S)~~

## Done when
A room created on the English landing opens in English (`lang="en" dir="ltr"`) in a browser whose
cookie says Hebrew, on the vote, the wall, a game and the admin page; its join gate and "me" sheet
have no language switch; its link preview and `.ics` are in English. A Hebrew room opens in Hebrew
for an English cookie. A room made before the migration opens in Hebrew.

## Notes
- The proxy reads the room's language, which `#12` had turned down as a query per click; it is
  once per room per server here, since a room's language never changes. Recorded as
  docs/DECISIONS.md #13. The migration was applied to the hosted project by hand, 2026-10-23.
- Checked on the dev server: an English room opened in English for a Hebrew cookie on the vote,
  the wall, a game, the board and the admin page; its preview card and `.ics` line in English; the
  Hebrew room from before the migration in Hebrew for an English cookie; an unknown room in the
  visitor's language. The two test rooms ("UI test", "UI test EN") are left to the nightly cleanup.
