# 29 — A sign-in needs a passed captcha

**Goal:** an anonymous sign-in, and a sign-in with a login code, need a Turnstile token Supabase
accepts, while `test:db` and the e2e runs still get their sessions. Neither is true now.
**Depends on:** 28
**Status:** in progress

## Steps
`[ ]` not started · `[~]` in flight now (one, and `plan/NOW.md` names it) · `[x]` done, struck through.

- [x] ~~29.1 — the tests' sessions through a one-time sign-in link, not a sign-in that needs a captcha (`server/db/test-sessions.ts`, `seatPlayer`); the two e2e tests whose browser signs in for itself skipped while captcha is on (M)~~
- [~] 29.2 — a Turnstile site and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set; `captchaToken` (`core/supabase/captcha.ts`, already in front of `signInAnonymously`) put in front of `signInWithCode`'s `signInWithPassword` too, and a refused captcha not reported as a wrong code (S)
- [ ] 29.3 — `[auth.captcha]` on in `supabase/config.toml` and the hosted project, with the real secret (S)

## Done when
A sign-in from a script with no token is refused by the production project, a visitor in the
browser joins and signs in with a code as before, and `npm run test:db` and `npm run e2e` pass
against it, the two in-browser sign-ins skipped and saying why.

## Notes
Moved from phase 28 (its 28.4 and 28.5). The widget was ported in phase 05 and is off only for want
of a site key; the CSP from 28.6 already allows `challenges.cloudflare.com`. Without a second project there is nowhere to keep test
keys: the one project is production.
On 2026-10-26 the owner chose production alone over a second project. So the tests don't sign in
the way a browser does: a test user is made with the secret key and redeems a one-time link, which
Supabase's captcha doesn't cover (to be checked once it is on). The e2e join gate and the sign-back-
in on reload can't pass a real captcha in an automated browser; they skip while the site key is set.
