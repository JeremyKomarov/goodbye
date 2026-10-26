# 29 — No captcha, and tests that don't spend anonymous sign-ins

**Goal:** the unused Turnstile check is gone from the code and the CSP, and the tests get their
sessions without signing in as a browser does. Neither was true before.
**Depends on:** 28
**Status:** done

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~29.1 — the tests' sessions made with the secret key and a one-time sign-in link (`server/db/test-sessions.ts`, `seatPlayer`), not an anonymous sign-in (M)~~
- [x] ~~29.2 — remove the captcha: `core/supabase/captcha.ts`, its site key, the token on both sign-ins, and Cloudflare in the CSP; recorded as docs/DECISIONS.md #17 (S)~~

## Done when
Nothing in `src/`, `e2e/` or `next.config.ts` names a captcha; the CSP frames nothing; and
`npm run test:db` and the e2e runs pass with no anonymous sign-in of their own outside the join
gate's test.

## Notes
Planned first as "a sign-in needs a passed captcha", moved here from phase 28. A captcha covers
every Supabase sign-in, and the one project is production, so the owner first chose production
over a second project, then, on 2026-10-26, no captcha at all (docs/DECISIONS.md #17). The
one-time-link sessions stay: they keep `test:db` clear of Supabase's 30 anonymous sign-ins an hour,
which repeated runs spent during phase 28.
