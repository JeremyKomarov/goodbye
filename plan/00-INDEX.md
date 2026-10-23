# Plan

The table of contents. **Status only — never content.** Every detail lives in the phase file.

`npm run guard` fails if this table and the files in `plan/` disagree.

| # | Phase | Status | File |
|---|---|---|---|
| 01 | Foundation | done | [01-foundation.md](01-foundation.md) |
| 02 | UI kit | done | [02-ui-kit.md](02-ui-kit.md) |
| 03 | Data layer | done | [03-data.md](03-data.md) |
| 04 | Landing | done | [04-landing.md](04-landing.md) |
| 05 | Room core | done | [05-room-core.md](05-room-core.md) |
| 06 | Wall & presence | done | [06-wall.md](06-wall.md) |
| 07 | Admin | in progress | [07-admin.md](07-admin.md) |

**Now:** 07 · **Next:** 08

The step inside that phase, and how it is going, live in [`NOW.md`](NOW.md) — this line stays
phase-level. `guard` fails if the two disagree.

Statuses are exactly: `not started`, `in progress`, `done`.

Add a phase with the `new-phase` playbook — it writes the file and this row together.
How to size one: `node .agents/cli.mjs rule 05 1`.
