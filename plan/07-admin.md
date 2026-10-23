# 07 — Admin

**Goal:** the host's admin link opens their page — close the vote early or reopen it, mark "I left
the group" and undo it, delete wall messages, send players their login codes — and inside the
room the red exit row is the host's button; the `admin` flag is on.
**Depends on:** 05, 06
**Status:** in progress

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~07.1 — promote the room's type, DTO and mapper, slot and duration formatting, the verdict (M)~~
- [~] 07.2 — the admin token check; `GET /api/rooms/[slug]/admin`; the host claim drops their vote (M)
- [ ] 07.3 — `PATCH …/admin` (lock, reopen, exit, undo the exit), `DELETE …/admin/messages/[id]` (M)
- [ ] 07.4 — the admin page: the link's token, the room's state, its actions, forgetting this device (L)
- [ ] 07.5 — the admin's wall, the players' codes, the admin link sent to yourself (M)
- [ ] 07.6 — in the room: the exit row as the host's button, the header's link to the admin page (S)
- [ ] 07.7 — `enable-feature admin`; checked in two browsers, both locales (M)

## Done when
With the admin link in one browser and a player in another: closing the vote early locks the room
and the player's countdown changes without a reload; reopening brings the vote back; "I left the
group" shows the player the exit, and undoing it takes it back; a deleted message leaves the
player's wall; the host's list shows the player's code. A wrong token is refused by every action.
Checked in Hebrew and English; rooms made while checking are deleted afterwards.

## Notes
- The "send to the group" messages on the old admin page are phase 09's, with the rest of sharing.
