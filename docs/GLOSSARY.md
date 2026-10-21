# Glossary

Terms that do not mean what a newcomer would guess. Add one the first time someone has to ask.

**Index** — an `AGENTS.md` inside a directory, listing what lives there and when to use it. Tier 2
of the lookup system (`00-INDEX.md`). Not to be confused with `.agents/docs/00-INDEX.md`, which routes
between rulebook files, or `plan/00-INDEX.md`, which is the phase table of contents.

**Playbook** — a repeatable procedure in `.agents/skills/<name>/SKILL.md`, invoked as
`/<name>` in Claude Code and `$<name>` in Codex.

**Promotion** — moving something from a feature into `shared/` at the moment a second feature
needs it. Never a copy. See `01-STRUCTURE.md` §4 and the `promote` playbook.

**Shim** — a one-line `CLAUDE.md` beside an `AGENTS.md` that points Claude Code at it. Contains no
rules of its own, ever.

**Silent success** — anything that reports success without doing the work: a stub handler
returning 200, a mock nobody can see, a screen in nav that renders nothing real. The defect this
codebase's conventions mostly exist to prevent.

*(Add project terms below.)*

**Room** — one farewell: a slug, a host, the reason they are leaving, a voting window and the
hours on offer. Everything else belongs to a room.

**Host** — whoever opened the room. Proven by the **admin token**, not by being signed in: the
token is shown once at creation, kept in the host's browser and the admin link's `#k=`, and only
its hash is stored. The host cannot vote.

**Slot** — one hour on offer for the exit. Votes are per slot; the most-voted slot **locks** when
voting closes (ties drawn at random, once, by `finalize_room`).

**Exit** — the host pressing "I left the group". It is what triggers the **finale** for everyone in
the room, and it can be undone.

**Login code** — the six characters a player uses to be the same player on a second device. Not a
password anyone chose; issued by the server, readable only by the server and the host.

**Wall** — the farewell wall: the room's messages. **Rain** is the emoji rain a reaction sends
over Realtime; it is never stored.
