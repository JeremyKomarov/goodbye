# `room`

The party room everyone joins from the link. A visitor comes in under a name (or as themselves
from another device, with their login code), votes on the exit hour in a heatmap, and watches the
countdown — to the close, then to the chosen hour — change live with everyone else's. The host's
browser comes in under the host's name and watches rather than votes. Feature flag: `room`,
enabled. Routes: the sections of `/r/[slug]` share the `(room)` layout — the vote at `/r/[slug]`,
the wall at `/r/[slug]/wall`, the games at `/r/[slug]/games` (`roomSectionPath`; the `games` feature's), the records at `/r/[slug]/board`; an unknown slug renders `RoomNotFound`.

## Status

| Endpoint | Status | Source |
|---|---|---|
| `API_ENDPOINTS.rooms.one` (GET) | Live, no session needed. The room, its players, host ids and votes in one `RoomSnapshotDto`; `not_found` for an unknown or malformed slug. | `app/api/rooms/[slug]/route.ts` |
| `API_ENDPOINTS.rooms.me` (PUT) | Live, bearer. Join under `{ name }` or rename; written as the caller, so `name_taken` (on `name`) comes from the database's trigger. 204. | `app/api/rooms/[slug]/me/route.ts` |
| `API_ENDPOINTS.rooms.vote` (PUT, DELETE) | Live, bearer. `{ slotStart }` casts or moves the caller's vote; DELETE takes it back. `voting_closed` after the close, `invalid_input` on `slotStart` for an hour outside the window, `forbidden` for the host. 204. | `app/api/rooms/[slug]/vote/route.ts` |
| `API_ENDPOINTS.rooms.finalize` (POST) | Live, no session needed. Locks the room to its winning hour once voting is over (ties drawn by the database), and answers the `RoomDto` — unchanged before the close. | `app/api/rooms/[slug]/finalize/route.ts` |
| `API_ENDPOINTS.rooms.wall` (GET, POST) | Live. GET, no session: the newest 200 messages, oldest first, and their reactions. POST, bearer: `{ body }` (1–140) as the caller, named by the database; `forbidden` for a non-player, `too_fast` within 3s of their last. 201 with the message. | `app/api/rooms/[slug]/wall/route.ts` |
| `API_ENDPOINTS.rooms.reaction` (PUT, DELETE) | Live, bearer. `{ emoji }` from `REACTION_EMOJIS`, one per person per message; `forbidden` for a non-player or another room's message. 204. | `app/api/rooms/[slug]/wall/[messageId]/reaction/route.ts` |
| `API_ENDPOINTS.rooms.summary` (GET) | Live, no session needed. `ExitSummaryDto` (shared): the voters, every goodbye counted, the most loved one, whether the locked hour was drawn, the lone leader while none is locked. Read by the finale and the host's messages here and on the admin page. | `app/api/rooms/[slug]/summary/route.ts` |
| `API_ENDPOINTS.rooms.calendar` (GET) | Live, no session needed. The locked hour as an `.ics` file in the reader's language (the locale cookie), with a reminder ten minutes before; a line of text and 404 before the lock. A link the browser follows, never fetched. | `app/api/rooms/[slug]/exit.ics/route.ts` |
| `API_ENDPOINTS.rooms.preview` (GET) | Live, no session needed. The room's link preview, a PNG, in `?locale=`: the question, the decision or the verdict; a card that says so for an unknown room. Named by the room's metadata (docs/DECISIONS.md #11). | `app/api/rooms/[slug]/og/route.tsx` |
| `API_ENDPOINTS.me.loginCode` (POST) | Live, bearer. The caller's code for another device, per user, not per room: `{ code, created }`; `{ fresh: true }` replaces it. A new code becomes the user's password, so the browser signs back in with it. | `app/api/me/login-code/route.ts` |
| `API_ENDPOINTS.rooms.hosts` (POST) | Live, bearer. `{ adminToken }` makes the caller a host device and drops any vote it cast; `forbidden` for a wrong token. Idempotent, 204. | `app/api/rooms/[slug]/hosts/route.ts` |

## Inventory

| File | What |
|---|---|
| `components/RoomShell` | The frame every section sits in, rendered by `app/[locale]/r/[slug]/(room)/layout.tsx`: `RoomHeader`, the side column (the `Hero` and the `RoomNav` list) from 64rem, the `RoomNav` bar on phones, `Welcome`, `MeSheet`, `JoinGate` until `useIdentity` is ready (the room under it `inert`), and the live channel. Provides `RoomContext` to the sections, and `RoomFrameContext` (shared) to every section — the games' too (docs/DECISIONS.md #9). Takes the snapshot the layout read on the server as `initial`. |
| `components/FarewellWall` | The wall page: the system notice, `MessageList` (follows new messages at the bottom, a "jump to latest" button with the unseen count when scrolled up, one reaction picker open at a time) and `Composer` (140 characters, `too_fast` / `forbidden` read out). |
| `components/MessageBubble` | One goodbye on the kit's `Bubble`: the sender's name in their colour with a host badge, the time and ticks, a react button, the picker, and the reaction chips. |
| `components/RoomNav` | The sections — the vote, the games (current on a game too; who holds the records, or that the games closed), the wall, the records (how many have played) — through the kit's `TabBar`: `bar` on phones, `list` in the side column from 64rem with each section's live line (who leads; the last goodbye and its time) and the wall's unread count. |
| `components/Board` | The records section: the three most wanted hours with bars, then each game's top ten (`GameRecords`: place, avatar, name, score; yours tinted) — or "play first", a link to the game, while the games are open. |
| `components/VoteSection` | The vote page: `RoomStatus` (phones only — wide screens show it in the side column) and `VoteHeatmap`. |
| `components/RoomStatus` | The status card in either place: `Hero` from the room's context, with `ExitActions` under it. |
| `components/Finale` | The host has left: the notice drops in, the verdict, the room in numbers (`FinaleStats`: the hour chosen or leading, when the host really left, voters, goodbyes), the most loved goodbye and the champions (`FinaleHighlights`), with confetti; over the whole room, Escape or the button closes it. Reads `useExitSummary` and `useRecords`. |
| `components/RoomHeader` | The chat header: group avatar and name, "Hi {name}" (a link to `onMe`) and how many are online — or who is typing; the time left in a pill off the vote; `actions`: the 🎉 button, and the admin page's link for the host's browser. |
| `components/JoinGate` | Covers the room until this browser has a name in it: whose room, why, how many voted, and the `LanguageSwitch`. Partials: `NameForm` (on `SaveNameInputSchema`; the host's name says whose it is), `CodeForm` (a taken name asks for that player's code; "that's not me" goes back). |
| `components/MeSheet` | "Hi {name}" opens it, for players, not the host. Partials: `RenameForm`, `DeviceCode` (show, copy, replace the code), `NotYou` (forget this browser's player); and the `LanguageSwitch`. |
| `components/Welcome` | The hello pill, "the room will remember you" or "welcome back". Keyed by user. |
| `components/Hero` | The status card, by `room.status`: `VotingHero` (why, time left to vote, who leads or the tie), `LockedHero` (time to the chosen hour, how it was chosen, `ExitRow` filling up — the host's button when `hostExit` is given), `ExitedHero` (the notice and the `verdict`); `actions` sit under the countdown and the exit card. `Countdown` is days in words over `FlipDigits`, spoken in full. Compact on phones, roomy from 64rem. |
| `components/ExitActions` | Under the countdown and the exit card, in both of the hero's places: "add to calendar" while the hour is ahead (`CalendarSheet`: Google's link, the `.ics` file); for the host, "send to the group" — the shared `ShareMessages` in a sheet — kept after the exit as "the goodbye message"; once the host has left, "watch the ending again". |
| `components/EmojiRain` | The full-screen shower, fed by `onRain`; four fading drops instead of sixteen for reduced motion. `EmojiRain.const.ts`: `QUICK_EMOJI` (the wall's row), `PARTY_EMOJI` (the header's), `DOOR_EMOJI` (the hour). |
| `components/StatusStories` | The story groups as a strip of status rings — in the side column, and above the status card on a phone tall enough for both. Owns the `stories` namespace: every fact, in both languages. |
| `components/StoryRing` | The header's avatar in a status ring; opens the first group not yet watched. |
| `components/StoryViewer` | One fact at a time in the kit's `Sheet`, moving on by itself (`STORY_MS`); a tap on the forward side goes on, a long press pauses, the arrow keys and two buttons step. Partials: `StoryBars`, `StoryGroupNav`. |
| `components/StoryDisc` | A disc in a status ring: green into the group's colour while unseen, grey once seen. |
| `components/FlipDigits` | Display-face digits that roll as they change. Decorative, always LTR. |
| `components/VoteHeatmap` | Pick a day, then an hour: partials `DayStrip` (tabs with totals), `HourGrid` (chips shaded by `voteStep`, rings for yours and the winner, `columns()` per width), `VoteDetail` (who voted for the hour pointed at, "take back my vote", or how voting works). The chips are native buttons (docs/DECISIONS.md #7). |
| `components/VoteLegend` | The five `--vote-*` shades, fewer → more. Hidden on short screens. |
| `components/RoomSkeleton` | The page's Suspense fallback, shaped like the room. |
| `components/RoomNotFound` | `app/[locale]/r/[slug]/not-found.tsx` renders it. |
| `strings/room.strings.ts` | The `room` namespace: `reason` (gendered), `votes`, `people`, `typing` — said by more than one component. |
| `utils/roomPreview.ts` | `roomPreview(room, locale)` → the title, description and card lines a shared link shows, by status; no React, so the metadata and the preview image read the same. Owns the `roomPreview` namespace (`strings/roomPreview.strings.ts`). |
| `utils/names.ts` | `sameName` — the database's `norm_name()` comparison. |
| `hooks/useVote.ts` | `{ userId, slotMs }` (null takes it back), written into the snapshot before the request and rolled back on failure. Invalidates the room. |
| `api/votes.dto.ts` | `CastVoteInputSchema`. |
| `api/votes.api.ts` | `castVote`, `withdrawVote`. |
| `hooks/useLoginCode.ts` | Fetches the code (`fresh` for a new one), signs back in when it is new, keeps it on the device. |
| `hooks/useEnsureLoginCode.ts` | Every player but the host gets a code as they come in, so the host can send it later. Returns `useLoginCode`'s mutation. |
| `hooks/useSignInAs.ts` | Comes in as the player with a name, with their code (`not_found` for an unknown name). Invalidates the session user. |
| `hooks/useSwitchUser.ts` | "Not you?": signs this browser out locally. Invalidates the session user. |
| `hooks/useRename.ts` | `saveName` for a player already in. Invalidates the room. |
| `api/login-code.dto.ts` | `LoginCodeInputSchema`, `LoginCodeDtoSchema`, `SignInAsInputSchema` (the gate's code field). |
| `api/login-code.api.ts` | `fetchLoginCode`. |
| `hooks/useFinale.ts` | Whether the finale is showing: by itself once per exit on each browser, once the visitor is in (`utils/finaleSeen.ts`, in `STORAGE_KEYS.finaleSeen`); `replay`, `close`. |
| `hooks/useHostExit.ts` | The host's "I left the group" from the room — for the browser holding the admin token once the hour is set; warns first if early. Null for anyone else. |
| `hooks/useMarkExit.ts` | The exit action (`markExit`, the shared admin action with this browser's token). Invalidates the room. |
| `hooks/useRoomChannel.ts` | The room's live channel: a wall change invalidates `room.wall`, any other `room.snapshot` (settled over 150ms); presence (`online`), `typers` (4s unless renewed), `sendTyping`, `sendEmoji` (here and everywhere), `rain` (here only), `onRain`. Presence and broadcasts are held here, the moment only (docs/DECISIONS.md #8). |
| `hooks/useDoorAtTheHour.ts` | As the chosen hour arrives on an open screen: 🚪 rains there and the phone buzzes. Each screen has the clock, so nothing is sent. |
| `hooks/useSeenStories.ts` | The groups this browser has watched to the end (`utils/storiesSeen.ts`, in `STORAGE_KEYS.storiesSeen`). |
| `content/stories.const.ts` | `STORY_GROUPS` — each group's id, emoji, colour token and fact keys; `STORY_MS`, `LONG_PRESS_MS`. |
| `hooks/useTypingLine.ts` | "Dana is typing…" / "3 people are typing…" or null. |
| `hooks/useTypingSignal.ts` | A draft's keystrokes as typing on and off — renewed every 2s, off after 2.5s idle. |
| `hooks/usePostMessage.ts` | Posts; invalidates the wall. |
| `hooks/useReact.ts` | React, change or take back (`null`), written into the wall before the request and rolled back on failure. Invalidates the wall. |
| `utils/reactions.ts` | `reactionCounts` (chips, most used first), `withReaction`. |
| `hooks/useWall.ts` | `useQuery` on `QUERY_KEYS.room.wall(slug)` → `Wall` (messages, `ReactionMap`). |
| `api/wall.dto.ts`, `api/wall.mapper.ts`, `api/wall.api.ts` | The wall's wire shape, `mapWallDto` (reactions folded by message, then person), `fetchWall`. |
| `types/wall.types.ts` | `WallMessage`, `ReactionMap`, `Wall`. |
| `hooks/useFinalizeRoom.ts` | The finalize call. Invalidates the room once it has locked. |
| `hooks/useAutoFinalize.ts` | When this screen's clock passes the close, asks for the result every 4s until the room is no longer voting. |
| `utils/voteScale.ts` | `voteStep(count, max)` → shade, `columns(n, min, max)`, `VOTE_STEPS`, `DARK_TEXT_FROM`. |
| `hooks/useWallUnread.ts` | Goodbyes since you last looked at the wall, not your own; what was there when the room opened counts as read. |
| `hooks/useRoomContext.ts` | `RoomContext` and `useRoomContext()` — `slug`, `snapshot`, `me`, `isHost`, `leader`, `live`, `typing`, `openStory`, `hostExit`, `replayFinale`, from the shell to its sections. |
| `hooks/useRoom.ts` | `useQuery` on `QUERY_KEYS.room.snapshot(slug)` → `RoomSnapshot`, seeded from the page's read. |
| `hooks/useIdentity.ts` | Who this browser is here: `state` (`IDENTITY_STATES` checking → join → ready), `me`, `isHost`, `returning`, `join`. Joins the host's browser under the host's name by itself, and claims the room for a host who joined unrecorded. |
| `hooks/useSessionUser.ts` | `useQuery` on `QUERY_KEYS.session.user` — this browser's user id or null. |
| `hooks/useJoinRoom.ts` | Signs in if needed, claims the room if this browser holds the admin token, saves the name. Invalidates the session user and the room. |
| `hooks/useClaimHost.ts` | The claim alone, for a host already in the room. Invalidates the room. |
| `hooks/useAdminToken.ts` | The admin token for this room from storage; null on the server. |
| `api/players.dto.ts` | `SaveNameInputSchema` (`MAX_PLAYER_NAME` 24), `ClaimHostInputSchema`. |
| `api/players.api.ts` | `saveName`, `claimHost` — both send the session's bearer. |
| `api/room.dto.ts` | `RoomSnapshotDtoSchema` — the snapshot's wire shape, snake_case, around the shared `RoomDtoSchema`. |
| `api/room.mapper.ts` | `mapRoomSnapshotDto` — times become epoch milliseconds. |
| `api/room.api.ts` | `fetchRoom(slug)`. |
| `types/room.types.ts` | `Player`, `Vote`, `RoomSnapshot` (around the shared `Room`). |

## What moved to `shared/`

In phase 07, because the admin page shows the same room: the `Room` type, `RoomDtoSchema` and
`mapRoomDto` (`shared/types`, `shared/api`), `useSlotFormat` and `useDuration` with their words
(the `time` namespace), and the `duration` and `verdict` utils. Moving them back would make the
admin feature import this one.

In phase 09, because the server counts the votes for the exit summary: the `tally` util. Its
votes are anything with a `slotMs`, so it no longer reads this feature's `Vote`.

## Ownership

- Joining, login codes, voting, the heatmap, the countdown, the wall, presence, typing,
  reactions, the emoji rain, the stories, and the host's exit from inside the room; next the
  finale and the calendar export.
- The room's Realtime subscription, which invalidates query keys and nothing else
  (docs/DECISIONS.md #2).
- Not the games and not the host's controls — `games` and `admin`.

## Next real work

None planned: phase 09 finished the story — the finale, the calendar, the host's messages and
the link previews.
