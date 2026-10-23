# 12 — Polish

**Goal:** the guides say where the project really is, the landing chat stays quiet to a screen
reader and tells its story without slips, and one end-to-end run proves the landing journey holds
at phone and laptop sizes.
**Depends on:** 04, 11
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~12.1 — the root and landing `AGENTS.md` say what is built and what is next (S)~~
- [x] ~~12.2 — the demo chat is one labelled, decorative region to a screen reader (S)~~
- [x] ~~12.3 — the chat's slips: Avi in the member list, the notice after the story, typing timed in the host's gender (S)~~
- [x] ~~12.4 — an end-to-end run of the landing journey at 360px and 1280px, outside `verify` (M)~~
- [x] ~~12.5 — measure production load speed and fix what it finds (S)~~

## Done when
`AGENTS.md` names no finished phase as next; VoiceOver reads the chat as one label; `npm run e2e`
walks the three steps at 360×640 and 1280×800, asserts no scroll, and passes.

## Notes
- Lighthouse on production (mobile): performance 90, accessibility 95 → the two contrast misses
  fixed, best practices 100, SEO 100. The server answers from Vercel's cache in ~60 ms; the 3 s LCP
  is the simulated slow phone, not the server.
- Layout shift on a phone was 0.093: the wizard first painted one step tall, then grew. Sizing the
  steps' box before the first paint brought it to 0.007.
- `--sender-violet` is lighter than WhatsApp's (3.6:1 → 5.2:1 on a bubble); it is a room member's
  colour too.
