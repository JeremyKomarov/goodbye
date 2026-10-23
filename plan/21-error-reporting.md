# 21 — Errors reported, not just shown

**Goal:** an error on the server or in a visitor's browser reaches Sentry, once the owner sets a DSN.
**Depends on:** 20
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~21.1 — `@sentry/nextjs`: `instrumentation.ts` and `instrumentation-client.ts`, on only with `NEXT_PUBLIC_SENTRY_DSN`, read through `core/config/env.ts` (M)~~
- [x] ~~21.2 — `ErrorScreen` and `onRequestError` report what they catch (S)~~

## Done when
Without the DSN, nothing is loaded or sent and the app builds and boots as before; with it, the
server's request errors and the browser's — uncaught, or caught by `ErrorScreen` — go to Sentry.

## Notes
- `@sentry/nextjs` 11.5.0, pinned, over two weeks old. No `withSentryConfig`, so no source
  maps are uploaded and the build needs no Sentry token; stack traces are minified until it is added.
- The SDK is a dynamic import behind the DSN, so a page carries none of it while reporting is off.
  The browser's starts after the page's first script, so an error in the first instant is missed.
- An error the server rendered reaches `ErrorScreen` with a `digest`, after `onRequestError` sent
  it, so the screen skips it rather than report it twice.
- Not yet seen arriving in Sentry: that needs the owner's project and DSN. To check, set
  `NEXT_PUBLIC_SENTRY_DSN` in `.env.local`, restart `npm run dev` and open `/dev/error`.
