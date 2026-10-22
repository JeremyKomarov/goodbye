# `core/` — app-wide configuration, never UI

**Configuration only.** If it holds runtime state it does not belong here — global stores live in
`store/`, a sibling of `core/`. `core/` is what the app boots with; `store/` is what changes
while it runs. The rule: `node .agents/cli.mjs rule 01 3`.

| Path | What | Rule |
|---|---|---|
| `config/features.const.ts` | The feature registry: `landing`, `room`, `games`, `admin` — route + `enabled`. | Reference a key as `FEATURE_KEYS.room`, never `"room"`. Flip with `enable-feature`. |
| `config/features.strings.ts` | Each feature's label and blurb (`.en.ts` beside it). | The `features` namespace. |
| `constants/routes.const.ts` | `ROUTES`, derived from `FEATURES`; `roomPath(key, slug)` fills a room route; `ADMIN_TOKEN_PARAM` names the admin link's hash. | Never restate a route; never build `/r/${slug}` by hand. |
| `config/env.ts` | Validated public environment: Supabase URL and publishable key, site URL, Turnstile key, `useMocks`. Throws at boot on a missing value or mocks in production. | The only file that may read a `NEXT_PUBLIC_*` variable — ESLint enforces it. |
| `config/env.server.ts` | `serverEnv.supabaseSecretKey`. `server-only`. | Read by `server/db/` alone. |
| `constants/api-endpoints.const.ts` | `API_ENDPOINTS` — every Route Handler URL. | Never a URL literal at a call site. |
| `constants/room.const.ts` | `HOST_GENDERS`, `LEAVE_REASONS`, `ROOM_STATUSES` and their unions — the database's values. | Any schema, type or branch on a room's gender, reason or status, in a feature or on the server. |
| `constants/login.const.ts` | `loginEmail(userId)`, `normalizeLoginCode`, `LOGIN_CODE_ALPHABET`, `LOGIN_CODE_LENGTH` — the original's, so its players' codes still work. | Read by the code handler and `core/supabase/session.ts` alike. |
| `constants/query-keys.const.ts` | `QUERY_KEYS` — every TanStack key; a room's all start with `room.all(slug)`; `session.user` is this browser's user id. | Never an inline key array. Realtime invalidates `room.all(slug)` and nothing finer. |
| `constants/storage-keys.const.ts` | `STORAGE_KEYS` — every browser-storage key; `adminToken(slug)`, `supabaseAuth`, `loginCode(userId)` keep the original app's keys. | Never a storage key literal at a call site. |
| `api/api-error.ts` | `API_ERROR_CODES`, `API_ERROR_STATUS`, `ApiErrorBodySchema`, `ApiError`, `toApiError`. | The code picks the status. A new failure is a new code here, never a sentence. |
| `i18n/routing.ts` | `LOCALES` (`he` default, `en`), `LOCALE_COOKIE`, `resolveLocale`, `localeDirection`, `isLocale`. | The locale comes from the cookie via `src/proxy.ts`, never the browser (docs/DECISIONS.md #6). |
| `i18n/messages.ts` | Namespace → strings file, once per locale. | The one file in `core/` allowed to import from `features/`. Nothing is authored here. |
| `i18n/request.ts` | next-intl's request config: the `[locale]` root param → its dictionary. | Read through `next/root-params`, so pages stay prerenderable. |
| `i18n/global.d.ts` | Types every `t()` key and locale from `messages`. | — |
| `i18n/strings.types.ts` | `StringsOf<T>` — the shape a `*.strings.en.ts` must have. | Every English strings file is typed with it (docs/DECISIONS.md #5). |
| `supabase/client.ts` | `browserSupabase()` — the browser's one client, session in `STORAGE_KEYS.supabaseAuth`. | For the anonymous session and Realtime only — never `.from()` or `.rpc()` (docs/DECISIONS.md #2). |
| `supabase/session.ts` | `ensureSession(language)` (anonymous sign-in on first join), `currentUserId`, `sessionHeaders` (the bearer for a fetcher), `signOutHere`, `signInWithCode` (`wrong_login_code` / `too_many_attempts`). | Every fetcher that acts as the visitor spreads `await sessionHeaders()` into its headers. |
| `supabase/realtime.ts` | `subscribeToRoom(roomId, onChange)` — one channel per room on `rooms`, `players`, `room_hosts`, `votes`; `onChange` also fires on each connect. Waits out the previous teardown of the same topic. | It says *that* something changed. The caller invalidates; nothing writes what an event carries (docs/DECISIONS.md #2). |
| `supabase/captcha.ts` | `captchaToken(language)` — Turnstile before anonymous sign-in, when its key is set. | Called by `ensureSession` only. |
| `styles/tokens.scss` | Every design token — WhatsApp dark, plus the app accents (`--bubble-out`, `--tick-read`, `--accent-pill` …). | The only file that may contain a hex colour. Imported once, in the root layout. |

<!-- Filled by phase 01: features.const.ts, env.ts, routes/query-keys/storage-keys, api-error,
     i18n/messages.ts, styles/tokens.scss. Shape: .agents/templates/index.md. -->

## Keep this table current
