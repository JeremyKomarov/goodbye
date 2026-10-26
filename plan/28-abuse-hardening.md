# 28 — A script can't flood a room, or the database

**Goal:** the write routes refuse a caller past a fair rate, an anonymous sign-in needs a passed
captcha, and every page is served with security headers. None of these is true now.
**Depends on:** 03, 05
**Status:** not started

## Steps

`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [ ] 28.1 — choose the limiter's store (a Postgres counter table in `server/db/`, or Upstash) and record it in `docs/DECISIONS.md` (S)
- [ ] 28.2 — add a `rate_limited` error code (429) with its sentence in both languages, and a server-side limiter keyed by IP for `POST /api/rooms` and by session for the other write routes (M)
- [ ] 28.3 — apply it to `POST /api/rooms`, the wall, reactions, votes, scores and the login code, each with its own budget, and test a caller over budget getting 429 (M)
- [ ] 28.4 — put Turnstile in front of `signInAnonymously` (`core/supabase/session.ts`), with the captcha token passed through, and turn on `[auth.captcha]` in `supabase/config.toml` and the hosted project (M)
- [ ] 28.5 — make sure the e2e runs and `test:db` still sign in, with Turnstile's test keys (S)
- [ ] 28.6 — serve a CSP, `frame-ancestors 'none'`, `Referrer-Policy: no-referrer`, `X-Content-Type-Options` and `Permissions-Policy` from `next.config.ts`, allowing Supabase, Realtime and Turnstile, and check the console is clean at 360px and 1280px (M)

## Done when

Posting to the wall past its budget answers 429 and the room shows the sentence for it. A sign-in
with no captcha token is refused by Supabase. `curl -I` on a room shows the headers, and
`npm run e2e` passes in both languages with no CSP violation in the console.

## Notes
