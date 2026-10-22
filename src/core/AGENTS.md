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
| `constants/query-keys.const.ts` | `QUERY_KEYS` — every TanStack key; a room's all start with `room.all(slug)`. | Never an inline key array. Realtime invalidates `room.all(slug)` and nothing finer. |
| `constants/storage-keys.const.ts` | `STORAGE_KEYS` — every browser-storage key; `adminToken(slug)` keeps the original app's `exit-admin:<slug>`. | Never a storage key literal at a call site. |
| `api/api-error.ts` | `API_ERROR_CODES`, `API_ERROR_STATUS`, `ApiErrorBodySchema`, `ApiError`, `toApiError`. | The code picks the status. A new failure is a new code here, never a sentence. |
| `i18n/routing.ts` | `LOCALES` (`he` default, `en`), `LOCALE_COOKIE`, `resolveLocale`, `localeDirection`, `isLocale`. | The locale comes from the cookie via `src/proxy.ts`, never the browser (docs/DECISIONS.md #6). |
| `i18n/messages.ts` | Namespace → strings file, once per locale. | The one file in `core/` allowed to import from `features/`. Nothing is authored here. |
| `i18n/request.ts` | next-intl's request config: the `[locale]` root param → its dictionary. | Read through `next/root-params`, so pages stay prerenderable. |
| `i18n/global.d.ts` | Types every `t()` key and locale from `messages`. | — |
| `i18n/strings.types.ts` | `StringsOf<T>` — the shape a `*.strings.en.ts` must have. | Every English strings file is typed with it (docs/DECISIONS.md #5). |
| `styles/tokens.scss` | Every design token — WhatsApp dark, plus the app accents (`--bubble-out`, `--tick-read`, `--accent-pill` …). | The only file that may contain a hex colour. Imported once, in the root layout. |

<!-- Filled by phase 01: features.const.ts, env.ts, routes/query-keys/storage-keys, api-error,
     i18n/messages.ts, styles/tokens.scss. Shape: .agents/templates/index.md. -->

## Keep this table current
