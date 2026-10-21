# `core/` — app-wide configuration, never UI

**Configuration only.** If it holds runtime state it does not belong here — global stores live in
`store/`, a sibling of `core/`. `core/` is what the app boots with; `store/` is what changes
while it runs. The rule: `node .agents/cli.mjs rule 01 3`.

| Path | What | Rule |
|---|---|---|
| `config/env.ts` | Validated public environment: Supabase URL and publishable key, site URL, Turnstile key, `useMocks`. Throws at boot on a missing value or mocks in production. | The only file that may read a `NEXT_PUBLIC_*` variable — ESLint enforces it. |
| `config/env.server.ts` | `serverEnv.supabaseSecretKey`. `server-only`. | Read by `server/db/` alone. |
| `styles/tokens.scss` | Every design token — WhatsApp dark, plus the app accents (`--bubble-out`, `--tick-read`, `--accent-pill` …). | The only file that may contain a hex colour. Imported once, in the root layout. |

<!-- Filled by phase 01: features.const.ts, env.ts, routes/query-keys/storage-keys, api-error,
     i18n/messages.ts, styles/tokens.scss. Shape: .agents/templates/index.md. -->

## Keep this table current
