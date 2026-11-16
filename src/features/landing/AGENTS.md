# `landing`

The home page. A WhatsApp-style group chat plays out a story, and beside it a three-step wizard
walks the host through opening a room: why they are leaving (which steers the chat), who they are
and which group, and the window the group votes in. It hands back the room link, a WhatsApp
invitation and the admin link, and keeps the admin token in the browser. Feature flag: `landing`,
enabled. Route: `/`.

## Status

| Endpoint | Status | Source |
|---|---|---|
| `API_ENDPOINTS.rooms.create` (POST) | Live, no session needed. Validates with `CreateRoomInputSchema`, writes the room — in the wizard's language, `locale`, which becomes the whole room's (docs/DECISIONS.md #13) — and its admin-token hash to Supabase, answers `{ slug, admin_token }` (201), or `invalid_input` / `close_time_in_past` / `no_slots_after_close` with the field, which the wizard puts on that field. Five an hour from one IP, `rate_limited`, read out by the wizard. | `app/api/rooms/route.ts` |

## Inventory

| File | What |
|---|---|
| `components/LandingScreen` | The screen: `Intro` partial (language switch, headline), `HeroChat`, `CreateRoomPanel`. Owns the chat preview in `useState`, starting with no story (`INITIAL_CHAT`), as the wizard does; an unpicked story leaves the chat on the last one told. One viewport tall. On a phone the chat keeps room for its header and a line or two on every step and the language switch shares the headline's cell rather than taking a row. A phone held sideways (under 500px tall, from 40rem wide) drops the chat and sets the headline beside the form. |
| `components/HeroChat` | The scripted group chat, played by `useChatScript` the way a real one arrives — a pause, typing as long as the line ("Dana is typing…" in the header), the line. Before a story is picked it plays `PRELUDE` once (small talk, the host's desk noticed empty, no reason named, no vote announced); `story` then opens with one of three `OPENERS` at random, a beat later the group's vote is announced; a new story plays one of three `CORRECTIONS`, then the chat waits. To a screen reader it is one labelled picture (`role="img"`), its lines hidden. Four colleagues, each story its own mix; lines to the host follow `hostGender`. The header previews `hostName` / `groupName`. Partials: ChatHeader, ChatLine (follow-up bubbles without a tail), TypingDots, ClosingCountdown (decorative). |
| `components/CreateRoomPanel` | The card: a skeleton until the page runs in the browser, then the wizard, then the success card. |
| `components/CreateRoomForm` | The three-step wizard (`FORM_STEPS`: reason → who → when) on react-hook-form with `CreateRoomInputSchema`. "Next" validates only that step's fields; a server code with a field lands on that field and jumps to its step. A field is checked on leaving it and then as it is typed, a field "Next" found wrong included (even by Enter, with no blur); "Create" finding a wrong field on an earlier step goes back to it. The answers and the step are kept per tab (`wizardDraft`) and given back on reload, on the step left or an earlier one that no longer passes. On success it keeps the admin token (`saveAdminToken`), forgets the draft and calls `onCreated`. Every step stays mounted; before the first paint the script measures the tallest step and the one showing (`--steps-tallest`, `--steps-showing`), and the styles choose: on a phone the box eases to the step showing, so a short step leaves its room to the chat, and from 64rem it holds the tallest, so the card keeps one size. Only the step showing is in the flow, so a short screen scrolls just that one, its cut edge faded. The steps' box is the `wizard-step` container: a step lays out by the card's width, not the screen's (ScheduleStep puts the day beside the stepper from 18rem). Step 3 asks for the day, the number of days and the hours; the close comes set (`DEFAULT_CLOSE_AFTER_HOURS`) and reads as one line with "change", which opens its field, as does an error on it. FormActions says how many hours the window leaves to vote on above "Create", outside the scrolling step; on a laptop that line holds its room on every step, so the card keeps one size. Partials: StepProgress, StepBody, ReasonStep, IdentityStep, ScheduleStep, ServerAlert, FormActions. |
| `components/CreateSuccess` | The room is open: the invite (gendered in Hebrew) shown as the host's own unsent outgoing bubble, the WhatsApp share, the room link, the admin link (`#k=<token>`, `ADMIN_TOKEN_PARAM`) in a box of its own in the warning quad, and "enter the room". Partials: InvitePreview (the bubble, the address set as a link), AdminKey (the warning box), LinkRow (label optional, when a heading above names it). The admin page's own `AdminLink` is close to AdminKey but adds a send-to-myself; if a third screen needs one, promote it. |
| `hooks/useCreateRoom.ts` | The only `useMutation`. Invalidates nothing: no query holds a room before it exists. |
| `hooks/useOpenSlotCount.ts` | `openSlotCount` for the window in the form, as it is typed. Read by FormActions: the line above "Create", and "Create" disabled at 0. |
| `utils/openSlotCount.ts` | `openSlotCount(window)` — the hours left to vote on after the close time; 0 for an unfinished or backwards window. |
| `hooks/useWizardErrors.ts` | `field(name)` and `server`: the wizard's error sentences. |
| `utils/wizardErrors.ts` | `wizardCode(type)` — the server code an error carries, if the wizard words it. Its test also holds `FORM_STEPS` to the schema: every field is asked for, or filled by the wizard. |
| `api/rooms.dto.ts` | `CreateRoomInputSchema` (shared by the wizard and the handler), `CreatedRoomDtoSchema`, `HOST_GENDERS`, `LEAVE_REASONS`, the length limits — counted in characters by `charCount`, as the database's `char_length` counts them, so the name inputs carry no `maxLength` (it counts UTF-16 units). |
| `utils/wizardDraft.ts` | `saveDraft` / `loadDraft` / `forgetDraft` — the wizard's unsent answers and step in this tab's `sessionStorage` (`STORAGE_KEYS.createDraft`). Loading lays them over today's defaults: timezone and language are always the tab's, a refused number falls back, and a window already begun or a close already passed starts from today. |
| `api/rooms.mapper.ts` | `mapCreatedRoomDto` — `admin_token` → `adminToken`. |
| `api/rooms.api.ts` | `createRoom(input)` — parses the input before sending, throws `ApiError` with the handler's code and field. |
| `types/room.types.ts` | `CreatedRoom` — `slug`, `adminToken`. |
| `types/wizard.types.ts` | `ChatPreview` (wizard → hero chat: story, names, the host's gender), `OpenedRoom` (wizard → success card). |
| `strings/landing.strings.ts` | The `landing` namespace: the wizard's buttons and step titles, field errors and server codes, read by the form and its partials. |

## What moved to `shared/`

Built for this screen and placed in `shared/` because the room and admin screens need them next:
`ChoiceGroup`, `useNow`, `adminTokens`, `isolate`, `countdown`, `localDateTime`; and in phase 07,
`whatsappLink`, when the admin page sent codes and links too.

## Next real work

None planned. "Enter the room" and the room link open the room (phase 05); `useCreateRoom` still
invalidates nothing, since no query holds a room before it exists.
