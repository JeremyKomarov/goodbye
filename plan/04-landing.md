# 04 — Landing

**Goal:** the home page opens a room — the hero chat reacts to the story picked, the three-step
wizard posts through `useCreateRoom` with the schema the handler parses, and the success card hands
back the room and admin links — and the `landing` flag is on.
**Depends on:** 02, 03
**Status:** in progress

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~04.1 — the rest of the create chain: `CreatedRoom`, mapper, fetcher, `useCreateRoom`, the query provider (M)~~
- [x] ~~04.2 — browser helpers: admin-token storage, `isolate()` for typed names, `useNow` and the countdown split (S)~~
- [~] 04.3 — HeroChat: the scripted group chat, steered by the story and the names typed (M)
- [ ] 04.4 — CreateRoomForm: three steps on react-hook-form, open-slot count, server codes on their fields (L)
- [ ] 04.5 — CreateSuccess: WhatsApp share, room link, admin link, enter the room (S)
- [ ] 04.6 — LandingScreen and the page; `enable-feature landing`; checked in a browser in both locales (M)

## Done when
On `/`, in Hebrew and in English, picking a story changes the chat; a filled wizard creates a room
in Supabase and shows its links, and the admin token is in the browser's storage; a close time in
the past is refused on its field by the form, and by the handler with the same field when posted
to directly. Rooms made while checking are deleted afterwards.

## Notes
