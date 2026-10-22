# `server/db/` — the database

Supabase Postgres. The schema, row-level security, triggers and the nightly cleanup job are the
SQL in `supabase/migrations/` at the repository root, applied in filename order. Features and
handlers import named async functions from `*.repo.ts`, never the client (`01 §8`).

The database is the hosted project the original app runs on (`docs/DECISIONS.md #1`): the
migrations are already applied there, and live rooms are in it. A test that writes cleans up.

| File | What | Rule |
|---|---|---|
| `client.ts` | `db()` — the secret-key client, made once. It bypasses row-level security. | Imported by the `*.repo.ts` files here and nothing else (ESLint). |
| `rooms.repo.ts` | `insertRoom` (room + admin-token hash, or neither), `findRoomBySlug`, `findAdminTokenHash`, `deleteRoom`; `RoomRecord`, `ROOM_STATUSES`. | Rows are mapped to camelCase here; snake_case never leaves this file. A Supabase failure throws `upstream_failed`. |

<!-- Repos for votes, players, hosts, wall, reactions, codes and scores arrive with the phase whose
     handler first calls them (05–08). -->

## Keep this file current

Adding, changing, or removing anything in this folder updates this file in the same change.
