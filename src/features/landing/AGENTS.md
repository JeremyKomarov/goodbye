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
| `components/LandingScreen` | The screen: `Intro` partial (language switch, headline), `HeroChat`, `CreateRoomPanel`. Owns the chat preview in `useState`; an unpicked story leaves the chat on the last one told. |
| `components/HeroChat` | The scripted group chat: `story` picks the opening (`OPENERS`), a new story plays a correction (`CORRECTIONS`); the header previews `hostName` / `groupName`. Partials: ChatHeader, ChatLine, TypingDots, ClosingCountdown (decorative). |
| `components/CreateRoomPanel` | The card: a skeleton until the page runs in the browser, then the wizard, then the success card. |
| `components/CreateRoomForm` | The three-step wizard (`FORM_STEPS`: reason → who → when) on react-hook-form with `CreateRoomInputSchema`. "Next" validates only that step's fields; a server code with a field lands on that field and jumps to its step. On success it keeps the admin token (`saveAdminToken`) and calls `onCreated`. Partials: StepProgress, StepBody, ReasonStep, IdentityStep, ScheduleStep, ServerAlert, FormActions. |
| `components/CreateSuccess` | The room is open: WhatsApp share with the invite (gendered in Hebrew), the room link, the admin link (`#k=<token>`, `ADMIN_TOKEN_PARAM`) set as a secret, and "enter the room". Partial: LinkRow. |
| `hooks/useCreateRoom.ts` | The only `useMutation`. Invalidates nothing: no query holds rooms until phase 05. |
| `hooks/useOpenSlotCount.ts` | Hours left to vote on after the close time, for the window in the form. Disables "Create" at 0. |
| `hooks/useWizardErrors.ts` | `field(name)` and `server`: the wizard's error sentences. |
| `api/rooms.dto.ts` | `CreateRoomInputSchema` (shared by the wizard and the handler), `CreatedRoomDtoSchema`, `HOST_GENDERS`, `LEAVE_REASONS`, the length limits. |
| `api/rooms.mapper.ts` | `mapCreatedRoomDto` — `admin_token` → `adminToken`. |
| `api/rooms.api.ts` | `createRoom(input)` — parses the input before sending, throws `ApiError` with the handler's code and field. |
| `types/room.types.ts` | `CreatedRoom` — `slug`, `adminToken`. |
| `types/wizard.types.ts` | `ChatPreview` (wizard → hero chat), `OpenedRoom` (wizard → success card). |
| `strings/landing.strings.ts` | The `landing` namespace: the wizard's buttons and step titles, field errors and server codes, read by the form and its partials. |

## What moved to `shared/`

Built for this screen and placed in `shared/` because the room and admin screens need them next:
`ChoiceGroup`, `useNow`, `adminTokens`, `isolate`, `countdown`, `localDateTime`; and in phase 07,
`whatsappLink`, when the admin page sent codes and links too.

## Next real work

The room screen (phase 05) — "enter the room" and the room link land on its disabled shell until
then. When it reads the room, `useCreateRoom` can seed that query instead of invalidating nothing.
