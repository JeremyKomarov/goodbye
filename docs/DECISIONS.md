# Decisions

This project's decisions — numbered from 1, and append-only. Once a decision is locked here, do
not re-open it without a documented reason: **add a new numbered entry that supersedes the old one
instead of editing history.** A superseded entry stays in place, marked, so the reasoning that
produced it is still readable.

The framework's own decisions — why the conventions in `.agents/` are what they are — are in
`.agents/docs/DECISIONS.md`, and update with it. Cite those as `.agents/docs/DECISIONS.md #N` and
these as `docs/DECISIONS.md #N`; `npm run guard` checks that both resolve.

Format: `## N. <the decision, stated as a claim>` · `**Locked YYYY-MM-DD.**` · the reasoning,
including the argument that was wrong · a blockquote for any rule that must survive verbatim.

---

## 1. This is a rebuild of `JeremyKomarov/goodbye`, porting behaviour, not structure

**Locked 2026-10-21.**

The original app works and is the specification: every screen, rule and SQL migration it has is
what this one must do. Its structure — server actions, a browser-side Supabase client used for
reads and writes, Tailwind compiled into the SCSS modules, copy split between a catalog and
components — is what this rebuild replaces. The migrations in `supabase/migrations/` are carried
over verbatim, so the database it runs against is the same database.

## 2. Supabase is split: data through Route Handlers, the browser keeps only auth and Realtime

**Locked 2026-10-21.**

Every read and write goes Route Handler → `server/db/*.repo.ts` → a TanStack hook
(`.agents/docs/03-DATA.md` §1). The browser still needs Supabase for two things nothing else can
do: the anonymous session that identifies a visitor, and the Realtime channel that carries table
changes, presence, typing and the emoji rain. Those live in one confined module,
`core/supabase/`, and an ESLint zone keeps `@supabase/supabase-js` out of everywhere except it and
`server/db/` (`.agents/docs/04-FEATURES.md` §4).

The browser sends its session's access token as a bearer token; a handler verifies it before it
reads the body. Row-level security and the triggers stay in the database as the second line.

The argument that was wrong: polling instead of Realtime, to keep Supabase server-only. Presence
and typing are the room's whole feel, and polling them is both slower and costlier.

> A Realtime event invalidates query keys. It never writes into a store or the query cache.

## 3. Hebrew is the default locale and the layout follows it; English is complete

**Locked 2026-10-21.**

The audience writes in Hebrew. `<html lang dir>` comes from the active locale, so every module
uses logical properties (`inline-start`, not `left`). English ships with every string, not just
the landing copy the original translated.

## 4. Dark only, after WhatsApp's dark mode

**Locked 2026-10-21.**

The app is a parody of a WhatsApp group, so it borrows WhatsApp's dark palette on purpose. The
token template's light surfaces and neutral ramp are replaced, not just the brand ramp
(`.agents/docs/DECISIONS.md #25` allows it with a reason; this is the reason). There is no light
theme to keep in contrast with.

## 5. A strings file is Hebrew; its English is a parallel `*.strings.en.ts` typed from it

**Locked 2026-10-21.**

`02 §9` makes a second locale "a parallel set of files". Here the source locale is Hebrew, so
`<Name>.strings.ts` holds the Hebrew and is what `keysOf` derives keys from; `<Name>.strings.en.ts`
beside it is typed `StringsOf<typeof <name>Strings>` (`core/i18n/strings.types.ts`), so a missing
or extra key in the English is a `tsc` error. `core/i18n/messages.ts` assembles one dictionary per
locale from the pairs.

## 6. The locale is a hidden `[locale]` route segment, chosen by cookie, never in the URL

**Locked 2026-10-21.**

Every page lives under `app/[locale]/`; `src/proxy.ts` (next-intl's middleware,
`localePrefix: "never"`, no browser detection) rewrites to it from the locale cookie. A room link
shared into a Hebrew group is the same link for someone who switched to English, and the root
layout stays static under Cache Components because the locale is a param, not a `cookies()` read.
Route Handlers under `app/api/` sit outside it.

The argument that was wrong: reading the cookie in the root layout. Under `cacheComponents` that
is uncached data outside `<Suspense>`, and `<html lang dir>` cannot sit inside one.
