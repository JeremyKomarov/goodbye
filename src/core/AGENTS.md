# `core/` — app-wide configuration, never UI

**Configuration only.** If it holds runtime state it does not belong here — global stores live in
`store/`, a sibling of `core/`. `core/` is what the app boots with; `store/` is what changes
while it runs. The rule: `node .agents/cli.mjs rule 01 3`.

| Path | What | Rule |
|---|---|---|

<!-- Filled by phase 01: features.const.ts, env.ts, routes/query-keys/storage-keys, api-error,
     i18n/messages.ts, styles/tokens.scss. Shape: .agents/templates/index.md. -->

## Keep this table current
