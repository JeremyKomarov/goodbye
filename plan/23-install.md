# 23 — On the home screen

**Goal:** "Add to Home Screen" gives the app its name and a real icon, in the reader's language.
**Depends on:** 01
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~23.1 — `manifest.ts` and the app icons (S)~~

## Done when
`/manifest.webmanifest` answers with the name, colours and icons in the reader's language, the page
links to it, and every icon it names loads (`e2e/install.spec.ts`, which writes nothing, so CI runs it).

## Notes
- The favicon was still create-next-app's "N". The icon is now lucide's log-out glyph in the
  "exit group" red on the page's dark, drawn once in `assets/app-icon.svg` and rendered to every
  size by `assets/render-icons.mjs` (Playwright's Chromium): 192 and 512 for the manifest (512 also
  maskable — the glyph sits in the middle 60%), 180 for `apple-icon.png`, 32 and 48 in the
  favicon, whose corners are rounded.
- The manifest reads the language cookie, like `global-error.tsx`: it is outside `[locale]`, so a
  room's own language doesn't reach it. `shortName` was added to the site's strings for it.
