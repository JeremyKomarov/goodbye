# `games`

The games players pass the time with until the hour — Runaway, Trivia, Catch and the Picture
game — each round's score kept, and placed against the room's records. Feature flag: `games`.
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
| `components/RecordLine` | The room's record under the game's name, read out and popping in when it changes. |
| `components/GamesClosed` | "The games are closed": the host left, so the records stay. |
| `content/games.const.ts` | `GAME_ART` — each game's emoji on its tile. |
| `hooks/useSubmitScore.ts` | Sends a finished round's score; invalidates the records. |
| `api/scores.api.ts` | `submitScore` — the shared `SubmitScoreInputSchema`, the session's bearer. |
| `types/games.types.ts` | `GameProps` — `onFinish(score)`, all a game is given. |
| `utils/celebrate.ts` | The confetti, in the tokens' colours; none for reduced motion. |

## Ownership

- The hub, each game, its content, and sending a score.
- Not the records' read or ranking — `shared/` (`useRecords`, `utils/records.ts`), for the
  room's board and finale too — and not who is in the room: the room's shell joins them.

## Next real work

The games themselves, one per step of phase 08: Runaway, Catch, Trivia, the Picture game.
