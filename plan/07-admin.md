# 07 — Admin

**Goal:** the host's admin link opens their page — close the vote early or reopen it, mark "I left
the group" and undo it, delete wall messages, send players their login codes — and inside the
room the red exit row is the host's button; the `admin` flag is on.
**Depends on:** 05, 06
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~07.1 — promote the room's type, DTO and mapper, slot and duration formatting, the verdict (M)~~
- [x] ~~07.2 — the admin token check; `GET /api/rooms/[slug]/admin`; the host claim drops their vote (M)~~
- [x] ~~07.3 — `PATCH …/admin` (lock, reopen, exit, undo the exit), `DELETE …/admin/messages/[id]` (M)~~
- [x] ~~07.4 — the admin page: the link's token, the room's state, its actions, forgetting this device (L)~~
- [x] ~~07.5 — the admin's wall, the players' codes, the admin link sent to yourself (M)~~
- [x] ~~07.6 — in the room: the exit row as the host's button, the header's link to the admin page (S)~~
- [x] ~~07.7 — `enable-feature admin`; checked in two browsers, both locales (M)~~

## Done when
With the admin link in one browser and a player in another: closing the vote early locks the room
and the player's countdown changes without a reload; reopening brings the vote back; "I left the
group" shows the player the exit, and undoing it takes it back; a deleted message leaves the
player's wall; the host's list shows the player's code. A wrong token is refused by every action.
Checked in Hebrew and English; rooms made while checking are deleted afterwards.

## Notes
- The "send to the group" messages on the old admin page are phase 09's, with the rest of sharing.
- The admin link's token is taken out of the address bar once kept, so a screenshot or a shared
  tab doesn't hand the room over. Every action asks first, as in the original.
- The room's type, DTO and mapper, the hour and duration formatting (with a `time` namespace) and
  the verdict moved to `shared/` (07.1), and `whatsappLink` with them (07.5): the admin page is a
  second feature showing the same room, and features don't import each other.
- An action's own answer goes straight into the host's view — the new room, or the message gone —
  so the page doesn't wait for a read; the room is invalidated as well.
- Checked with the admin link in one browser (English, 1280) and a player in another (Hebrew,
  360): undo the exit, reopen, close now, "I left", undo again — each reached the player's room
  live; a deleted goodbye left the player's wall; the player's code showed with copy and send; a
  wrong token got "this admin link doesn't work". The host's own exit from the room's red row
  warned of an early exit, and the player saw "ran off 2 days early". No overflow at 360 in either
  language. The probe room and its six users were deleted; the project is back to its six rooms.
