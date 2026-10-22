# 06 — Wall & presence

**Goal:** the room has its second section — the farewell wall, with reactions — and feels alive:
who is online and typing, the emoji rain, the status stories; the vote and the wall are routes
under one room layout, with the tab bar on phones and a chat list on desktop.
**Depends on:** 05
**Status:** in progress

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~06.1 — read the wall: `GET /api/rooms/[slug]/wall`, repos, `useWall`; Realtime by table (M)~~
- [x] ~~06.2 — post and react: `POST …/wall`, `PUT`/`DELETE …/wall/[id]/reaction`, optimistic (M)~~
- [x] ~~06.3 — sections as routes: the `(room)` layout and `RoomShell`, the vote page, `TabBar` list (M)~~
- [x] ~~06.4 — FarewellWall, MessageBubble, the composer and the reaction picker on `/wall` (L)~~
- [x] ~~06.5 — presence, typing and the emoji broadcast; the header's live line, the unread badge (M)~~
- [~] 06.6 — EmojiRain: the 🎉 button, the wall's quick emoji, the door at the chosen hour (S)
- [ ] 06.7 — status stories: the ring on the header's avatar, the strip, the viewer (M)
- [ ] 06.8 — checked in two browsers, both locales, phone and desktop (S)

## Done when
In two browsers in the same room, a message posted in one appears on the other's wall, with its
reaction, without a reload; the other's tab bar counts it while they are on the vote; typing shows
as "… is typing" and both headers count two online; 🎉 rains on both screens. Checked in Hebrew and
English at 360 and 1280; rooms made while checking are deleted afterwards.

## Notes
- The room's sections are routes in one `(room)` layout, not tabs held in state as in the
  original: the kit's `TabBar` is navigation between routes, a wall has a link of its own, and
  the layout keeps the header, the join gate and the channel up across them. The layout is gated
  by `featureLayout`, so `featurePage` and it remain the only flag reads. `admin` stays outside
  the group; `games` moved into it and renders its disabled shell inside the room until 08.
- A reaction is added from a small react button beside the bubble, not by tapping the bubble as
  in the original: a bubble is not a button, and the kit has one. The chips, the picker's emoji
  and the button are all `Button`s.
- Sending does not wait for the wall to be read again: the room's channel may cancel that read
  with its own, and the composer stayed busy until it gave up.
- Presence, typing and the emoji rain live in the room shell's state, recorded as
  `docs/DECISIONS.md #8` beside `#2`.
- The room under the join gate is `inert`: the wall's composer could be focused behind it.
