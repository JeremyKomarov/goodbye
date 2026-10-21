# `landing`

**Status: not built yet — this folder holds only this document.**

The home page: a WhatsApp-style chat that walks the host through opening a room — why they are
leaving, when voting closes, their name — and hands back the room link and the admin link.
Feature flag: `landing`; route: `/`.

## Current behavior

Coming soon. The route is built with `featurePage(FEATURE_KEYS.landing)` and renders the shared
disabled shell — not a 404, and not a half-working screen.

## Planned ownership

- The hero chat, the three-step create wizard (reason, schedule, identity) and the success card.
- The wizard's draft, in a feature-local store, until it is submitted.
- Not the room itself, and not the admin token after creation — those are `room`'s and `admin`'s.

## Next real work

Phase 03's `rooms.create` handler — the wizard has nothing to submit to until it exists.
