# 20 — Something went wrong, said in the reader's language

**Goal:** a page that crashes shows a translated, right-to-left "something went wrong" screen with
a way to try again, instead of Next's default English page.
**Depends on:** 02, 05
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~20.1 — `NoticeScreen` in `shared/`: the centred pill, line and actions `RoomNotFound` draws; `RoomNotFound` on it (S)~~
- [x] ~~20.2 — `ErrorScreen` on it, with Try again; `error.tsx` under `[locale]` and `global-error.tsx` at the root (M)~~
- [x] ~~20.3 — a development-only page that throws, and an e2e test that the screen shows on it in both languages (S)~~

## Done when
A render error on any page shows "משהו השתבש" (or "Something went wrong" in English) with Try
again and a way home, at 360px and 1280px; `npm run e2e` proves it on the throwing page.

## Notes
- `RoomNotFound` drew the same centred pill, line and link, so it moved onto `NoticeScreen` rather
  than having a twin beside it (01 §4).
- `global-error.tsx` replaces the root layout, so it brings the tokens and a dictionary itself. It
  reads the language cookie; inside a room the proxy's room language is out of its reach, so a
  room in English can show this one page in Hebrew. Rare enough — the root layout reads nothing.
- Checked at 360, 768 and 1280px in Hebrew; the e2e covers both languages at 360 and 1280.
