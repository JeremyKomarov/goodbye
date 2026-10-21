# `server/` — server-only modules

Reached from Route Handlers, layouts and the proxy — never from `features/`, `shared/`, `core/` or
`store/` (ESLint). Every file starts with `import "server-only"`. The rule: `node .agents/cli.mjs
rule 01 8`.

| Path | What | Rule |
|---|---|---|
| `db/` | Supabase access: the client and one `*.repo.ts` per table group. | The only place `@supabase/supabase-js` is imported on the server. |

<!-- Phase 03 adds auth/: the bearer check on the anonymous user's token, the admin-token hash,
     login codes (docs/DECISIONS.md #2). -->

## Keep this file current

Adding, changing, or removing anything in this folder updates this file in the same change.
