# 13 — Who hasn't voted

**Goal:** while the vote is open, the host's page shows how many have voted, names who has not,
and sends the group one WhatsApp reminder naming them, with the room's link.
**Depends on:** 05, 07
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~13.1 — the admin GET says of each player whether they have voted (`has_voted`) (S)~~
- [x] ~~13.2 — `VoteReminder` on the admin page: the count, the names, the reminder to send (M)~~
- [x] ~~13.3 — check it at 360px, 768px and 1280px in both languages (S)~~

## Done when
On an open room's admin page the host reads "3 of 5 voted", sees the two names left, and the
WhatsApp button opens a message naming them with the time voting closes and the room's link; once
everyone has voted it says so, and once the vote has closed the panel is gone.

## Notes
- No schema change: the handler reads `listVotes` beside the players. The host never has a vote.
- Checked against a stubbed admin answer (no test room in the live database): 360, 768 and 1280px,
  both languages, some and all voted, and a locked room (no panel). No sideways scroll.
