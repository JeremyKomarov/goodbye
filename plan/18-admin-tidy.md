# 18 — The host's page without Refresh, and Lighthouse again

**Goal:** the host's goodbye wall has no Refresh button now that the page is live, and the
production scores are measured again after phases 13–17.
**Depends on:** 14
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~18.1 — `AdminWall` loses Refresh and its strings; `AdminScreen` stops passing `onRefresh` (S)~~
- [x] ~~18.2 — Lighthouse on production (mobile): the landing, an unknown room, a throwaway room and its wall (S)~~

## Done when
The host's wall shows no Refresh, and the scores are written below.

## Notes
- Lighthouse 12.8, mobile, on goodbye-wheat.vercel.app (2026-10-23) — perf / a11y / best practices / SEO:
  - landing: 95 / 100 / 100 / 100 — LCP 2.8 s, CLS 0.001, TBT 10 ms.
  - unknown room: 90 / 100 / 100 / 50 — SEO by design: `noindex` (docs/DECISIONS.md #12).
  - a room: 88 / 100 / 100 / 90; its wall: 89 / 100 / 100 / 90 — LCP ~3.4 s, CLS 0.
- The room's "no meta description" is Next 16's streamed metadata: a browser (and Googlebot,
  which runs scripts) gets the tags after the first paint, outside `<head>`. A link preview's bot
  (WhatsApp) gets them in `<head>`, checked by user agent, so shared links are unaffected. Left as is.
- The throwaway rooms were "lighthouse — delete me", deleted after; the sweep would catch them.
