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
| 07 | Admin | done | [07-admin.md](07-admin.md) |
| 08 | Games | done | [08-games.md](08-games.md) |
| 09 | Finale & sharing | done | [09-finale.md](09-finale.md) |
| 10 | Room language | done | [10-room-language.md](10-room-language.md) |
| 11 | Room themes | done | [11-room-themes.md](11-room-themes.md) |
| 12 | Polish | done | [12-polish.md](12-polish.md) |
| 13 | Who hasn't voted | done | [13-vote-reminder.md](13-vote-reminder.md) |
| 14 | The host's page, live | done | [14-live-admin.md](14-live-admin.md) |
| 15 | The host's page and the room, tested end to end | done | [15-admin-e2e.md](15-admin-e2e.md) |
| 16 | A deletion reaches its own room only | in progress | [16-room-deletes.md](16-room-deletes.md) |
| 17 | End to end on every push, and no test room left behind | done | [17-e2e-in-ci.md](17-e2e-in-ci.md) |

**Now:** 16 · **Next:** —

The step inside that phase, and how it is going, live in [`NOW.md`](NOW.md) — this line stays
phase-level. `guard` fails if the two disagree.

Statuses are exactly: `not started`, `in progress`, `done`.

Add a phase with the `new-phase` playbook — it writes the file and this row together.
How to size one: `node .agents/cli.mjs rule 05 1`.
