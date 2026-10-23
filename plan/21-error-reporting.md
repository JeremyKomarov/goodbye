# 21 — Errors reported, not just shown

**Goal:** an error on the server or in a visitor's browser reaches Sentry, once the owner sets a DSN.
**Depends on:** 20
**Status:** not started

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [ ] 21.1 — `@sentry/nextjs`: `instrumentation.ts` and `instrumentation-client.ts`, on only with `NEXT_PUBLIC_SENTRY_DSN`, read through `core/config/env.ts` (M)
- [ ] 21.2 — `ErrorScreen` and `onRequestError` report what they catch (S)

## Done when
With the DSN set, a throw on the development error page appears in Sentry; without it, nothing is
sent and the app boots as before.

## Notes
