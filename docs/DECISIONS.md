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

## 7. A heatmap cell is a native button inside its feature, not a kit Button or ChoiceGroup

**Locked 2026-10-22.**

The kit forbids a styled raw `<button>` in a feature and a row of `aria-pressed` buttons, because
both are how a second Button and a second radio group get built. The vote heatmap's hour chips and
day tabs are neither: each is a cell of a chart whose colour, count, ticks and flag *are* the
data, and pressing one casts a vote at once rather than filling in a form. Bending `Button` or
`ChoiceGroup` to draw them would put a heatmap's shading into `shared/`.

The argument that was wrong: `ChoiceGroup` with `isClearable`, since a vote is "one hour or none".
Its options are a label and a description; a chip is a tinted tile with a live count, and the day
strip is a set of tabs over it.

> Native buttons are allowed for the cells of a data visualisation inside its feature (today:
> `room/components/VoteHeatmap`). Everything else still uses `Button`, `ChoiceGroup` or a `Link`.

## 8. Presence, typing and the emoji rain are the moment only, held by the room's screen

**Locked 2026-10-22.**

`#2` says a Realtime event invalidates query keys and never writes into a store or the query
cache. That is about the tables: a change there is read again through its handler. Presence,
"… is typing" and the emoji rain are not tables. Nothing stores them, there is nothing to read
again, and they mean nothing a minute later. The room's shell keeps them in its own React state —
who is here, who is typing until when — and hands them to its sections through `RoomContext`.

The argument that was wrong: a zustand store in `store/`, so any screen could read who is online.
Only the room shows it, and a global store would outlive the room it describes.

> Table changes invalidate queries (`#2`). Presence and broadcasts live in the room shell's state
> and die with it; they never reach a store, the query cache or the database.

## 9. Another feature's section reads the room through a shared frame, not the room's context

**Locked 2026-10-23.**

The games are a feature of their own (`04 §1`: their own flag, folder and guide) but they are
sections of the room: their pages sit in the room's `(room)` layout, under its header, gate and
channel. They need three things the room's shell already holds — the room, who this browser is,
and whether it hosts — and a feature never imports another (`01 §1`), so `RoomContext` is out of
reach. `shared/hooks/useRoomFrame.ts` holds those three, provided by `RoomShell` beside its own
context. Its records come from the shared `useRecords`, kept fresh by the room's channel.

The argument that was wrong: fold the games into `room`. It would put four games and their
content inside the room's folder, and the `games` flag would gate nothing of its own.

> A section from another feature reads `useRoomFrame()` — the `Room`, `meId`, `isHost` — and
> never `RoomContext`. Anything more it needs is either shared data with its own query, or a
> reason to widen the frame here first.

## 10. A game's playing pieces are native buttons inside the game

**Locked 2026-10-23.**

`#7` let a chart's cells be native buttons. A game has the same kind of element: the exit button
that jumps away from the pointer, a notification that falls and is popped, an answer that turns
green or red. Each is moved, scaled or coloured by the game every frame, reacts to a press rather
than a click, and *is* the game's state. `Button` would need motion, pointer-down handling and a
dozen one-off looks to draw them, all of which belong to one game.

The argument that was wrong: a `motion(Button)` with a `bare` variant, as the story discs use.
`bare` lays out a visual inside a plain button; it doesn't animate it, and a game piece's look
changes with play.

> A game's playing pieces — the things you play *with* — are native buttons styled in the game's
> own folder. Every control around a game (start, next, another round) is still the kit's
> `Button`, and navigation is a `Link`.

## 11. A link preview is a Route Handler under `/api`, and the room's pages say they are dynamic

**Locked 2026-10-23.**

A shared room link previews as the room's story so far, so the image and the title read the
database on every request. Next's own `opengraph-image.tsx` cannot do that here. Under the hidden
`[locale]` segment (`#6`), Next writes the image's URL with the locale in it (`/he/r/…`), and the
proxy rewrites that to `/he/he/r/…`, a 404. Inside the image route, `next/root-params` is not
supported, so the locale cannot be read the way every page reads it.

So the previews are two Route Handlers, `API_ENDPOINTS.preview(locale)` and
`API_ENDPOINTS.rooms.preview(slug, locale)`, which the proxy never touches. The page's metadata
names them, with the page's own locale in the query, and both draw words from the same place as
the title (`features/room/utils/roomPreview.ts`).

The room's layout reads the room in `generateMetadata`. With Cache Components, Next refuses that
unless the page itself declares that it renders per request; a marker in the layout does not count.
Each page under the room's layout is wrapped in `onEveryRequest`, which renders a `connection()`
marker inside its own `<Suspense>`, so the rest still prerenders. Caching the metadata for seconds
was the wrong turn: Next still rejects `params` read in `generateMetadata`.

> A link preview's image is a Route Handler under `/api`, its locale in the query. A page whose
> layout's metadata reads the database is exported through `onEveryRequest`.
