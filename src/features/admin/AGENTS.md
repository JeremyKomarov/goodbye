# `admin`

**Status: not built yet — this folder holds only this document.**

The host's page, opened from the admin link: prove the admin token, then close or reopen voting,
press "I left the group" (or undo it), delete wall messages, and see every player's login code.
Feature flag: `admin`; route: `/r/[slug]/admin`.

## Current behavior

Coming soon. The route is built with `featurePage(FEATURE_KEYS.admin)` and renders the shared
disabled shell — not a 404, and not a half-working screen.

## Planned ownership

- Claiming the host from the admin token, and every host-only action.
- Not the token's issue — `landing` receives it once, at creation.

## Next real work

Phase 03's `server/auth/` — the admin-token check every action here starts with.
