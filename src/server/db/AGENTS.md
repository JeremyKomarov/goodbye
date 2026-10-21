# `server/db/` — the database

Supabase Postgres. The schema, row-level security, triggers and the nightly cleanup job are the
SQL in `supabase/migrations/` at the repository root, applied in filename order. Features and
handlers import named async functions from `*.repo.ts`, never the client (`01 §8`).

| File | What | Rule |
|---|---|---|

<!-- Phase 03 adds client.ts (the secret-key client) and the repos: rooms, votes, wall, hosts,
     codes, games. -->

## Keep this file current

Adding, changing, or removing anything in this folder updates this file in the same change.
