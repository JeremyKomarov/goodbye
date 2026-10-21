# `room`

**Status: not built yet — this folder holds only this document.**

The party room everyone joins from the link: join with a name, vote on the exit hour, the
countdown once it locks, the farewell wall, presence and the emoji rain, and the finale when the
host leaves. Feature flag: `room`; route: `/r/[slug]`.

## Current behavior

Coming soon. The route is built with `featurePage(FEATURE_KEYS.room)` and renders the shared
disabled shell — not a 404, and not a half-working screen.

## Planned ownership

- The join gate (and signing in on a second device with a login code), voting, the heatmap,
  the countdown, the wall, presence, typing, reactions, the finale and the calendar export.
- The room's Realtime subscription, which invalidates query keys and nothing else
  (docs/DECISIONS.md #2).
- Not the games and not the host's controls — `games` and `admin`.

## Next real work

Phase 03 — the room's data through `server/db/` and the browser session in `core/supabase/`.
