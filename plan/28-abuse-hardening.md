# 28 — A script can't flood a room, or the database

**Goal:** the write routes refuse a caller past a fair rate, and every page is served with
security headers. Neither is true now.
**Depends on:** 03, 05
**Status:** done

## Steps

`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~28.1 — choose the limiter's store (a Postgres counter table in `server/db/`, or Upstash) and record it in `docs/DECISIONS.md` (S)~~
- [x] ~~28.2 — add a `rate_limited` error code (429) with its sentence in both languages, and a server-side limiter keyed by IP for `POST /api/rooms` and by session for the other write routes (M)~~
- [x] ~~28.3 — apply it to `POST /api/rooms`, the wall, reactions, votes, scores and the login code, each with its own budget, and test a caller over budget getting 429 (M)~~
- [x] ~~28.6 — serve a CSP, `frame-ancestors 'none'`, `Referrer-Policy: no-referrer`, `X-Content-Type-Options` and `Permissions-Policy` from `next.config.ts`, allowing Supabase and Realtime, and check the console is clean at 360px and 1280px (M)~~

## Done when

Posting to the wall past its budget answers 429 and the room shows the sentence for it. `curl -I` on a room shows the headers, and
`npm run e2e` passes in both languages with no CSP violation in the console.

## Notes
The sentence for `rate_limited` lives with each screen that reads it out, as `too_fast` does on
the wall, so it lands in 28.3 with the route, not in 28.2. `hit_rate_limit()` is checked live in
`rate-limits.db.test.ts`. `test:db`'s `--globalSetup` flag, gone in Vitest 5, moved into
`vitest.config.mts`; the sweep still does nothing without the secret key.
`callerIp` trusts `x-forwarded-for` because Vercel replaces it with the real IP; `next dev` keeps
a sent one, which is how the tests and e2e each get their own room budget. Hosted anywhere that
passes the header through, the IP limit could be dodged. A reaction refused for its rate is undone
by the picker with no sentence, as any other failed reaction is.
On 2026-10-26 the room budget's 429 was checked live (`rooms/route.db.test.ts`); the wall's waited for
Supabase's own anonymous sign-in limit (30/hour/IP), spent by repeated runs, and passed live later
that morning, given 60 seconds for its 31 requests. That limit is a reason 28.4's test keys matter for `test:db` too.
The captcha (28.4, 28.5) moved to phase 29 on 2026-10-26, at the owner's choice: Supabase's
captcha covers every sign-in, the login code's too, and the one project is production, so test keys
would switch the protection off and real ones leave `test:db` unable to sign in. 28.6 keeps its
number.
28.6: a static CSP, not a nonce one, since Cache Components can't carry a nonce — recorded as
docs/DECISIONS.md #16. Checked on a production build: the headers by `curl -I`; the e2e run without
the database (18 passed; `/dev/error` is development-only); and a live room at 360px and 1280px,
Realtime's `wss://` included, with no violation. Every e2e test now fails on one (`e2e/test.ts`).
Vercel's preview toolbar, on preview deployments only, is not in the policy.
