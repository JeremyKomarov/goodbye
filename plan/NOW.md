# Now

The working file. **One step at a time, rewritten as the work moves** — not appended to.
`npm run guard` fails if this disagrees with the `[~]` step in the phase files.

**Step:** 29.2 — the Turnstile site key set, and both sign-ins sending its token
**Since:** 2026-10-26
**State:** the code is done: `signInWithCode` sends a token and tells a refused captcha from a wrong code. Left: the Turnstile site and its key in Vercel, the owner's.
**Blocked by:** a Turnstile site in the owner's Cloudflare account, its key in Vercel.

---

`—` in **Step** means idle: no phase file has a `[~]` step. Otherwise **Step** is the id of the
one step marked `[~]`, and **State** is what is done of it and what is left, in a line or two.
See [`../.agents/docs/05-WORKFLOW.md`](../.agents/docs/05-WORKFLOW.md) §2.
