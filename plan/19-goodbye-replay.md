# 19 — The goodbyes, played back

**Goal:** once the host has left, anyone in the room can play the wall's goodbyes back one at a
time, Stories-style, from the exit actions.
**Depends on:** 06, 09
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~19.1 — `StoryPlayer` out of `StoryViewer`: the clock, the taps, the keys, the bars and the steps, for any slides (M)~~
- [x] ~~19.2 — `GoodbyeReplay` on it, and "replay the goodbyes" in `ExitActions` once exited with a goodbye on the wall (M)~~
- [x] ~~19.3 — `e2e/room.spec.ts`: an ended throwaway room with two goodbyes, played through to the close (S)~~

## Done when
In a room the host has left, "Replay the goodbyes" plays each goodbye in order and closes after
the last, at 360px and 1280px, in Hebrew and English; the stories play as before.

## Notes
- One player, two uses: the stories and the replay share the timing and the controls, so neither
  copies the other (01 §4).
- A goodbye stays 2.5 s plus 45 ms a character, at most 8 s. Past 30 goodbyes the bars would be
  slivers, so there is one, and the counter says where.
- The e2e writes an ended room straight into the tables (the create handler makes only voting
  rooms), "e2e — delete me", deleted after. Checked by eye at 360px and 1280px in both languages.
