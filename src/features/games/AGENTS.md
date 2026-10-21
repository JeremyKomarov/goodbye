# `games`

**Status: not built yet — this folder holds only this document.**

The games players pass the time with until the hour: Catch, the Picture game, Runaway and Trivia,
with a hub and a room leaderboard. Feature flag: `games`; route: `/r/[slug]/games`.

## Current behavior

Coming soon. The route is built with `featurePage(FEATURE_KEYS.games)` and renders the shared
disabled shell — not a 404, and not a half-working screen.

## Planned ownership

- The hub, each game, its content (pictures, trivia, facts), score submission and the leaderboard.
- Not the room's membership — a player is whoever `room` joined.

## Next real work

The room core (phase 05): a game needs a joined player to score for.
