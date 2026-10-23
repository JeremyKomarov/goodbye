# Now

The working file. **One step at a time, rewritten as the work moves** — not appended to.
`npm run guard` fails if this disagrees with the `[~]` step in the phase files.

**Step:** 16.3
**Since:** 2026-10-23
**State:** migration and client written; the live check waits for the migration to be applied.
**Blocked by:** the owner applying `20261024000000_room_delete_broadcast.sql` in the SQL Editor.

---

`—` in **Step** means idle: no phase file has a `[~]` step. Otherwise **Step** is the id of the
one step marked `[~]`, and **State** is what is done of it and what is left, in a line or two.
See [`../.agents/docs/05-WORKFLOW.md`](../.agents/docs/05-WORKFLOW.md) §2.
