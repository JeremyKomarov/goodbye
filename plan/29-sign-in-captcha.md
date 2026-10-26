# 29 — A sign-in needs a passed captcha

**Goal:** an anonymous sign-in, and a sign-in with a login code, need a Turnstile token Supabase
accepts, while `test:db` and the e2e runs still sign in. Neither is true now.
**Depends on:** 28
**Status:** not started

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [ ] 29.1 — a second Supabase project for tests and previews, the migrations applied, Turnstile's test keys on it; `test:db` and e2e pointed there (M)
- [ ] 29.2 — a Turnstile site and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set; `captchaToken` (`core/supabase/captcha.ts`, already in front of `signInAnonymously`) put in front of `signInWithCode`'s `signInWithPassword` too (S)
- [ ] 29.3 — `[auth.captcha]` on in `supabase/config.toml` and the hosted project, with the real secret (S)

## Done when
A sign-in from a script with no token is refused by the production project, a visitor in the
browser joins and signs in with a code as before, and `npm run test:db` and `npm run e2e` pass
against the test project.

## Notes
Moved from phase 28 (its 28.4 and 28.5). The widget was ported in phase 05 and is off only for want
of a site key; the CSP from 28.6 already allows `challenges.cloudflare.com`. Without a second project there is nowhere to keep test
keys: the one project is production.
