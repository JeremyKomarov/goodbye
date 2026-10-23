# `landing`

The home page. A WhatsApp-style group chat plays out a story, and beside it a three-step wizard
walks the host through opening a room: why they are leaving (which steers the chat), who they are
and which group, and the window the group votes in. It hands back the room link, a WhatsApp
invitation and the admin link, and keeps the admin token in the browser. Feature flag: `landing`,
enabled. Route: `/`.

## Status

| Endpoint | Status | Source |
|---|---|---|
| `API_ENDPOINTS.rooms.create` (POST) | Live, no session needed. Validates with `CreateRoomInputSchema`, writes the room — in the wizard's language, `locale`, which becomes the whole room's (docs/DECISIONS.md #13) — and its admin-token hash to Supabase, answers `{ slug, admin_token }` (201), or `invalid_input` / `close_time_in_past` / `no_slots_after_close` with the field, which the wizard puts on that field. | `app/api/rooms/route.ts` |

## Inventory

| File | What |
|---|---|
| `components/LandingScreen` | The screen: `Intro` partial (language switch, headline), `HeroChat`, `CreateRoomPanel`. Owns the chat preview in `useState`; an unpicked story leaves the chat on the last one told. One viewport tall: on a phone the form comes first, every step fitting without a scroll, and under 700px tall the chat steps aside for it. |
| `components/HeroChat` | The scripted group chat, played by `useChatScript` the way a real one arrives — a pause, typing as long as the line ("Dana is typing…" in the header), the line. `story` opens with one of three `OPENERS` at random, a beat later the group's vote is announced; a new story plays one of three `CORRECTIONS`, then the chat waits. To a screen reader it is one labelled picture (`role="img"`), its lines hidden. Four colleagues, each story its own mix; lines to the host follow `hostGender`. The header previews `hostName` / `groupName`. Partials: ChatHeader, ChatLine (follow-up bubbles without a tail), TypingDots, ClosingCountdown (decorative). |
| `components/CreateRoomPanel` | The card: a skeleton until the page runs in the browser, then the wizard, then the success card. |
| `components/CreateRoomForm` | The three-step wizard (`FORM_STEPS`: reason → who → when) on react-hook-form with `CreateRoomInputSchema`. "Next" validates only that step's fields; a server code with a field lands on that field and jumps to its step. On success it keeps the admin token (`saveAdminToken`) and calls `onCreated`. Every step stays mounted and the steps' box is sized in script to the tallest, before the first paint, so the card keeps one size on every step; only the step showing is in the flow, so a short screen scrolls just that one, its cut edge faded. Partials: StepProgress, StepBody, ReasonStep, IdentityStep, ScheduleStep, ServerAlert, FormActions. |
| `components/CreateSuccess` | The room is open: WhatsApp share with the invite (gendered in Hebrew), the room link, the admin link (`#k=<token>`, `ADMIN_TOKEN_PARAM`) set as a secret, and "enter the room". Partial: LinkRow. |
| `hooks/useCreateRoom.ts` | The only `useMutation`. Invalidates nothing: no query holds a room before it exists. |
| `hooks/useOpenSlotCount.ts` | Hours left to vote on after the close time, for the window in the form. Disables "Create" at 0. |
| `hooks/useWizardErrors.ts` | `field(name)` and `server`: the wizard's error sentences. |
| `api/rooms.dto.ts` | `CreateRoomInputSchema` (shared by the wizard and the handler), `CreatedRoomDtoSchema`, `HOST_GENDERS`, `LEAVE_REASONS`, the length limits. |
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
