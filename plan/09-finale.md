# 09 — Finale & sharing

**Goal:** the room ends the way the original did — the finale plays once on every screen when the
host leaves and replays from the exit card; under the countdown everyone can add the hour to a
calendar and the host can send the decision and the goodbye to the group, from the room or the
admin page; a shared link previews as the room's story so far, in both languages.
**Depends on:** 05, 07, 08
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~09.1 — the exit summary: votes, goodbyes, the most loved one, a draw; `GET …/summary` (M)~~
- [x] ~~09.2 — the calendar: `GET …/exit.ics`, Google's link; the actions under the hero (M)~~
- [x] ~~09.3 — the host's messages to the group, in the room and on the admin page (M)~~
- [x] ~~09.4 — the finale: plays once per exit on each browser, replays from the exit card (L)~~
- [x] ~~09.5 — link previews: each room's title and description, the site's and its images (M)~~
- [x] ~~09.6 — the nightly cleanup confirmed; the whole story walked through in two browsers (M)~~

## Done when
Two players and the host in one room, in two browsers: the hour locks, both see "add to calendar"
and the downloaded `.ics` opens at that hour; the host's sheet holds the decision and the goodbye
with the room's real numbers and champions, and the admin page holds the same. The host leaves and
the finale plays on both screens once, with the hour, the voters, the most loved goodbye and each
game's champion; after a reload it does not play again, and the exit card replays it. The room's
link previews with its host, group and hour. Checked in Hebrew and English at 360 and 1280; rooms
made while checking are deleted afterwards.

## Notes
- What the room adds up to — voters, every goodbye, the most loved one, a drawn hour, the lone
  leader — is counted once, on the server (`GET …/summary`), and read by the finale and the host's
  messages alike, in the room and on the admin page; the room's channel keeps it fresh. The tally
  and the confetti moved to `shared/` on the way.
- The host's messages are one shared panel (`ShareMessages`), so the room's sheet and the admin
  page hold the same words.
- The previews are Route Handlers under `/api` with the locale in the query, and the room's pages
  are exported through `onEveryRequest`: Next's `opengraph-image` files break under the hidden
  `[locale]` segment, and a layout that reads the room in its metadata needs each page to say it
  renders per request (docs/DECISIONS.md #11). Satori has no bidi: a Hebrew card is reversed into
  visual order, and an English card's Hebrew names too.
- The nightly cleanup: the migrations schedule `cleanup-old-rooms` (03:17 daily) with pg_cron, but
  its row could not be read from here — no Supabase CLI or `psql`, and the API does not expose the
  `cron` schema. To confirm it, run `select jobname, schedule, active from cron.job;` in the
  Supabase SQL editor. The oldest room is 8 days old, so the job has had nothing to remove yet.
- Checked in fresh browsers: the host (en 1280) opened a room on the landing, A (en 360) and B
  (he 1280) joined and voted, the host closed voting on the admin page; both saw "add to calendar"
  live and the `.ics` opened at the hour; the host's sheet held the real numbers and champion; the
  host left from the room's red row and the finale played on all three screens, once — not after a
  reload — and replayed from the exit card. Before that, the same at he 360 / en 1280, the admin
  page's panel, the previews in both languages, and a host leaving mid-vote (the leading hour,
  "ran off mid-vote"). Compared with the original's code, not side by side with it running. The
  probe rooms and their 7 users were deleted; the project is back to its six rooms.
