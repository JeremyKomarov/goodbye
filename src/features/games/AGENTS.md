# `games`

**Status: not built yet — this folder holds only this document.**

The games players pass the time with until the hour: Catch, the Picture game, Runaway and Trivia,
with a hub and a room leaderboard. Feature flag: `games`; route: `/r/[slug]/games`.

## Status

| Endpoint | Status | Source |
|---|---|---|
| `API_ENDPOINTS.rooms.scores` (GET) | Live, no session needed. `RecordsDto`: each player's best per game, under their player name, unordered. Read through the shared `useRecords`. | `app/api/rooms/[slug]/scores/route.ts` |
| `API_ENDPOINTS.rooms.scores` (POST) | Live, bearer. `SubmitScoreInputSchema` — `invalid_input` on `score` outside the game's range; `forbidden` for a non-player; `games_closed` once the host has left. 204. | `app/api/rooms/[slug]/scores/route.ts` |

## Current behavior

Coming soon. The route is built with `featurePage(FEATURE_KEYS.games)` and renders the shared
disabled shell — not a 404, and not a half-working screen.

## Planned ownership

- The hub, each game, its content (pictures, trivia, facts), score submission and the leaderboard.
- Not the room's membership — a player is whoever `room` joined.

## Next real work

The room core (phase 05): a game needs a joined player to score for.
