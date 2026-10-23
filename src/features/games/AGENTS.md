# `games`

The games players pass the time with until the hour — Runaway, Trivia, Catch and the Picture
game — each round's score kept, and placed against the room's records. Feature flag: `games`,
enabled.
Routes: `/r/[slug]/games` (the hub) and `/r/[slug]/games/[game]` (`roomGamePath`), sections of
the room inside its `(room)` layout; they read the room through `useRoomFrame` (docs/DECISIONS.md
#9). Once the host has left, the games are closed and the records final.

## Status

| Endpoint | Status | Source |
|---|---|---|
| `API_ENDPOINTS.rooms.scores` (GET) | Live, no session needed. `RecordsDto`: each player's best per game, under their player name, unordered. Read through the shared `useRecords`. | `app/api/rooms/[slug]/scores/route.ts` |
| `API_ENDPOINTS.rooms.scores` (POST) | Live, bearer. `SubmitScoreInputSchema` — `invalid_input` on `score` outside the game's range; `forbidden` for a non-player; `games_closed` once the host has left. 204. | `app/api/rooms/[slug]/scores/route.ts` |

## Inventory

| File | What |
|---|---|
| `components/GamesHub` | The hub: a `GameTile` per game (its picture, name, line, the room's record and your best) linking to the game — not links once the games are closed, under `GamesClosed`. |
| `components/GameScreen` | One game (`app/[locale]/r/[slug]/(room)/games/[game]/page.tsx` checks the id inside `<Suspense>`): back to the hub, the name and `RecordLine`; the game, keyed by round; then `GameResult` — the score, a new room record (confetti) or personal best, the place out of how many, another round. The score is placed against the records as they were, then sent. |
| `components/RunawayGame` | The red "exit group" button runs from the pointer (a mouse near it, or a press) to the farthest of 12 spots, taunting; each dodge makes it smaller, quicker and more tired. The score is the time to catch it, in ms. The button is a native piece (docs/DECISIONS.md #10). |
| `components/CatchGame` | Notifications fall faster and thicker for 30 seconds; pop them for points (`NOTICES`): messages, good-morning flowers, "exit group" the most — the boss costs you. The round runs in `useCatchRound`; each notice is a native piece (docs/DECISIONS.md #10). |
| `components/TriviaGame` | Ten of the questions, fifteen seconds each (`useTriviaRound`); a right answer is 100 and up to 50 more for speed. The options are shuffled; each turns right or wrong (native pieces, docs/DECISIONS.md #10), then the fact and the way on. |
| `components/PictureGame` | "What's in the picture?": six pictures (`usePictureRound`), only the top quarter showing; one guess or a skip, then the curtain drops. One picture a round is honest — the top thing *is* the answer; in the others naming it is wrong. 150 a right guess. Owns `things`, every name in both languages. |
| `components/PictureStage` | One picture: the top strip of one thing over the bottom of another, under a curtain; an honest one has no bottom and is framed whole once shown. Always laid out left to right; the backdrop is `--picture-<id>`. |
| `components/RecordLine` | The room's record under the game's name, read out and popping in when it changes. |
| `components/GamesClosed` | "The games are closed": the host left, so the records stay — and a link to the room's board. |
| `content/games.const.ts` | `GAME_ART` — each game's emoji on its tile. |
| `content/catch.const.ts` | `CATCH_SECONDS`, `NOTICE_KINDS`, `NOTICES` — each kind's points and how often it falls. Their lines are in `CatchGame`'s strings. |
| `content/trivia.const.ts` | `TRIVIA_ROUND`, `TRIVIA_SECONDS`, the points; `ANSWERS` — each question's right option. |
| `strings/trivia.strings.ts` | The `trivia` namespace: every question, its four options `a`–`d` and its fact, in both languages. Every answer checkable. |
| `hooks/useTriviaRound.ts` | One round of Trivia: the question asked (options in this round's order), the pick (`null` when time ran out), the clock, the score; `start`, `answer`, `next`. |
| `content/pictures.const.ts` | `PICTURES` (each picture's two things, the guesses that count for each — Hebrew or English — and its icon layers), `ICON_BOUNDS`, `TOP_SHOWN`, `PICTURE_ROUND`, `PICTURE_POINTS`. The icons are `public/picture-game/*.svg`. |
| `hooks/usePictureRound.ts` | One round: deals pictures not seen lately first, warms their icons; `guess`, `skip`, `next`; `PICTURE_STATUSES`. |
| `utils/answers.ts` | `matches(guess, answers)` — forgiving of case, punctuation, a Hebrew article and final letters, and a typo in a longer word; `normalize`. |
| `hooks/useCatchRound.ts` | One round of Catch in a ref, drawn once a frame: `isPlaying`, `frame` (notices, score, time left), `popups`, `start`, `pop`. |
| `hooks/useSubmitScore.ts` | Sends a finished round's score; invalidates the records. |
| `api/scores.api.ts` | `submitScore` — the shared `SubmitScoreInputSchema`, the session's bearer. |
| `types/games.types.ts` | `GameProps` — `onFinish(score)`, all a game is given. |

## What moved to `shared/`

In phase 09, because the room's finale throws it too: `utils/celebrate.ts`, the confetti in the
tokens' colours. The room cannot import this feature.

## Ownership

- The hub, each game, its content, and sending a score.
- Not the records' read or ranking — `shared/` (`useRecords`, `utils/records.ts`), for the
  room's board and finale too — and not who is in the room: the room's shell joins them.

## Next real work

None planned. Phase 09 put each game's champion in the finale and in the goodbye message
(`champions` in `shared/utils/records.ts`).
