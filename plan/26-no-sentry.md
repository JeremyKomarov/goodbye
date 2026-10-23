# 26 — No Sentry

**Goal:** the app reports to no outside service: phase 21's Sentry is gone, the error screen stays.
**Depends on:** 21
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~26.1 — remove `@sentry/nextjs`, the instrumentation files, `errorReporting` and the DSN (S)~~

## Done when
Nothing in the repository names Sentry but the plan's history; a crash still shows `ErrorScreen`,
and its error is in the server's or the browser's console, as before phase 21.

## Notes
- The owner's call (2026-10-23): no Sentry.
