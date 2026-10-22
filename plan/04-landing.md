# 04 — Landing

**Goal:** the home page opens a room — the hero chat reacts to the story picked, the three-step
wizard posts through `useCreateRoom` with the schema the handler parses, and the success card hands
back the room and admin links — and the `landing` flag is on.
**Depends on:** 02, 03
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~04.1 — the rest of the create chain: `CreatedRoom`, mapper, fetcher, `useCreateRoom`, the query provider (M)~~
- [x] ~~04.2 — browser helpers: admin-token storage, `isolate()` for typed names, `useNow` and the countdown split (S)~~
- [x] ~~04.3 — HeroChat: the scripted group chat, steered by the story and the names typed (M)~~
- [x] ~~04.4 — CreateRoomForm: three steps on react-hook-form, open-slot count, server codes on their fields (L)~~
- [x] ~~04.5 — CreateSuccess: WhatsApp share, room link, admin link, enter the room (S)~~
- [x] ~~04.6 — LandingScreen and the page; `enable-feature landing`; checked in a browser in both locales (M)~~

## Done when
On `/`, in Hebrew and in English, picking a story changes the chat; a filled wizard creates a room
in Supabase and shows its links, and the admin token is in the browser's storage; a close time in
the past is refused on its field by the form, and by the handler with the same field when posted
to directly. Rooms made while checking are deleted afterwards.

## Notes
- `ChoiceGroup` joined the kit (`src/shared/AGENTS.md`): the story cards and the pronoun toggle are
  real radios, and the kit forbids bare inputs in a feature. The room and admin will reuse it.
- The admin token keeps the original app's storage key, `exit-admin:<slug>`, and its link keeps
  `#k=<token>`, so a host who opened a room there still finds their admin link
  (`docs/DECISIONS.md #1`).
- Back is an icon button: at 360px the full "Create voting room 🗳️" label did not fit beside it.
- Checked in Chromium at 360 and 1280, Hebrew and English: no horizontal scroll, no
  `MISSING_MESSAGE`, the only console error the deliberate 422. Four probe rooms were created and
  deleted; the project is back to its six rooms.
- "Enter the room" and the room link land on the room's disabled shell until phase 05.
