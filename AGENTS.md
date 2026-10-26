# Goodbye — working guide

**What this is:** A party room for leaving a WhatsApp group

## The lookup protocol — the one thing to do differently

**Before creating any component, hook, util, type or API call:**

1. Read the `AGENTS.md` of the directory you are about to write in, then `src/shared/AGENTS.md`.
   They inventory what is already there. Something that does 80% of it is a thing to **extend**;
   another tone or size of it is a **variant**, not a second component.
2. Then the rule: `node .agents/cli.mjs rule 02 5`, and `02 6` for whether it belongs in `shared/`.

**After creating one:** update that same `AGENTS.md`, in the same change. Not as a follow-up.

That is the whole system — a root guide that routes, a per-directory index that inventories, and a
rulebook read one section at a time. It exists so you can answer "does something already do this?"
for the cost of one small file instead of reading a tree.

## Reading a rule

Rules live in five files under `.agents/docs/`, addressed as `<NN> §N`. **Fetch the section; do
not open the file** — a section is ~200 words, a file up to ~2,800.

```sh
node .agents/cli.mjs rule            # every section, one line each. Start here.
node .agents/cli.mjs rule 02 7       # §7, and nothing else
node .agents/cli.mjs rule -q tokens  # which sections mention it
```

| | |
|---|---|
| `01` | where files go, what may import what, state, the server and database boundary |
| `02` | building a component, `shared/` vs feature, tokens, responsive, strings |
| `03` | **the API recipe**, the error envelope, mocks, forms |
| `04` | the registry, feature flags, the feature index |
| `05` | the plan, the guards, branches, updating the framework |

Renumbering a section is a breaking change across the repository, and `npm run guard` says so.

**`.agents/` is the framework; everything else is yours** — one folder, one sentence, no per-file
judgement. Never edit `.agents/` in this project: the next `npm run update:framework` overwrites
it silently. Ownership table and the update flow: `.agents/docs/00-INDEX.md`.

## The rules that matter most

**No duplication.** A second near-identical `Card` is a bug, not a convenience. If a sibling
feature has something close, promote it to `shared/` — never copy it. `01 §4`

**Shared-first, with variants.** A primitive — button, field, modal, badge, toast, empty state —
lives in `shared/` from its first use and grows by a value in its variant const, never by
sprouting a `ButtonSmallGhost` beside it. `02 §6`

**Small, and responsive on the first commit.** One component, one job: past ~150 lines or three
regions it splits into `partials/`. Build against the breakpoint scale and check 360px, 768px and
1280px before saying it is done. `02 §4`, `02 §8`

**No silent success.** Anything that reports success without doing the work is a defect, not a
placeholder: a handler returning 200 with nothing, a mock nobody can see, a screen in nav that
renders no real content. Every other convention here exists to serve this one.

**A feature never imports another feature.** If two need it, it belongs in `shared/`. This is what
keeps a feature deletable. Lint-enforced.

**Server returns codes, never sentences.** The client turns a code into a sentence through the
strings layer. `03 §2`

**Say where the work is, while it is happening.** Before starting a step, mark it `[~]` in its
phase file, set that phase to `in progress` in the file *and* in `plan/00-INDEX.md`, and write
`plan/NOW.md`'s **Step**, **Since** and **State**. When it is done, strike it through in the same
commit as the work. Those four agree in both directions or `npm run guard` fails. `05 §2`

**A skill changed, added or deleted is synced in the same commit** — `npm run sync:agents`, so
Claude Code and Codex see the same instructions. A stale skill is followed confidently and
silently. `05 §4`

**`npm run verify` is the gate** — typecheck, lint, the guards, tests. Run it before you open a
PR; it is not the reviewer's job. `.github/workflows/verify.yml` runs the same command on every
push, and that copy cannot be skipped.

## The playbooks

Repeatable procedures in `.agents/skills/<name>/SKILL.md`. Your agent has already listed them and
loaded what each is for. Run one as `/<name>` in Claude Code or `$<name>` in Codex, or say "follow
the `promote` playbook" in either — same thing. Before building something by hand, check whether
a playbook already does it.

## The plan

[`plan/00-INDEX.md`](plan/00-INDEX.md) is the table of contents, one small file per phase.
[`plan/NOW.md`](plan/NOW.md) is the working file — the one step in flight, rewritten as it moves.
`plan/` **is** the plan; there is no ticket tracker. `05 §1`

---

## What is next, in order

Phases 01–27 are done. New work starts as a phase (`/new-phase`), not ad hoc.

Nothing is queued.

*(Keep this to three. A list of fourteen is a wish list, not an order.)*

## Where things actually stand

| | State |
|---|---|
| App shell | None by design — a single chat column. Every route renders through `featurePage()`. |
| Hosting | Vercel, deployed from `main` on GitHub; `verify` runs on every push. |
| End to end | `npm run e2e` (Playwright, `e2e/`) at 360px and 1280px: the landing wizard in both languages; the host's page against a stubbed answer, and an unknown room's link; a visitor joining and voting in a throwaway room, a browser a new login code signed out signing back in on reload, and the goodbyes replayed in an ended one; a page that throws (`/dev/error`) showing the error screen in both languages; each game played to a kept score by a player seated in a throwaway room; the manifest and its icons; which writes to the database and deletes it after (skips without the secret key). Each run first sweeps test rooms an earlier, killed run left (`e2e/sweep.ts`, also before `test:db`). Outside `verify`: it needs a browser and the dev server. CI runs it as its own job with no secret key, so nothing is written there. |
| Errors | A crash shows `ErrorScreen` in the page's language. No outside error service (phase 26): an error is in Vercel's logs, or the browser's console. |
| Design tokens | WhatsApp dark, `core/styles/tokens.scss` (docs/DECISIONS.md #4). |
| i18n | Hebrew (RTL) default, English by cookie; hidden `[locale]` segment (docs/DECISIONS.md #6). |
| Features | `landing`, `room`, `games`, `admin` — all built and on (`core/config/features.const.ts`). Phases 01–11 done. |
| Shared UI kit | Built in phase 02; inventoried in `src/shared/AGENTS.md`. |
| Database | Supabase. Migrations in `supabase/migrations/`; one repo per table in `server/db/`. |

**The reference app** is `github.com/JeremyKomarov/goodbye`. It is the specification for behaviour,
not structure (docs/DECISIONS.md #1) — port what a screen does, then build it the way this guide says.

## Decisions already made — do not re-open without a reason

The framework's are [`.agents/docs/DECISIONS.md`](.agents/docs/DECISIONS.md) — numbered,
append-only, and updated with the framework; the `#N` below are its entries. This project's own
are [`docs/DECISIONS.md`](docs/DECISIONS.md), numbered separately. Cite either by file and number.
The framework's load-bearing ones:

- **SCSS Modules + BEM + tokens** (#1, #2). No Tailwind, no literal colour — hex, `rgb()`, named —
  outside `tokens.scss`.
- **One Zod schema serves the form and the handler** (#3). Not a matching pair — one export.
- **Three kinds of state, three places** (#4). Server state is never copied into a store.
- **A feature never imports a feature** (#8). Promote instead.
- **Every owning directory ships an `AGENTS.md`, updated in the same change** (#9).
- **The database is optional and confined to `server/db/`** (#10). No ORM, no repository interface.
- **Mocks are DTO-parsed, flag-gated, visible, and fail production boot** (#13). No MSW.
- **`AGENTS.md` is canonical; every other agent file is a pointer** (#14).
- **A shared UI kit exists before the first feature screen, chosen per project** (#15, #27).
  The `plan-kit` playbook picks it from the planned screens; it is not a fixed list.
- **A rule is fetched by section, not read by file** (#20).
- **Icons come from `lucide-react`, through `shared/components/Icon` alone** (#23). No hand-drawn
  SVGs, no second icon library, no direct import anywhere else.
- **The plan check also runs pre-commit**, via `core.hooksPath` (#24). `npm run hooks` after
  `git init` on a fresh project.
- **`core/styles/tokens.scss` starts from `.agents/templates/tokens.scss`'s real values** (#25).
  Re-hue the brand ramp; keep the rest unless you have a reason.
- **Two agents are supported: Claude Code and Codex** (#26). Codex reads `AGENTS.md` and
  `.agents/skills/` itself; Claude Code gets a `CLAUDE.md` shim per `AGENTS.md` and a
  `.claude/skills` mirror, both written by `sync:agents`.
- **Claude Code runs the plan and skills guards itself**, through hooks in `.claude/settings.json`,
  and is denied edits under `.agents/` (#38). A playbook names its arguments (#37).

## What you must not touch

- **`supabase/migrations/`, once applied anywhere.** A schema change is a new migration file,
  never an edit to an old one.
- **The Supabase secret key.** Read in `core/config/env.server.ts`, used in `server/db/` alone; it
  bypasses row-level security.
- **The rulebook's section numbers.** Add a section; do not renumber one.
- **Any agent-specific file, as a place to put a rule.** They are pointers. A rule lives in
  `.agents/docs/` or in an `AGENTS.md`, once.
- **A mirrored skill.** `.agents/skills/` is the source; `.claude/skills/` is generated from
  it. An edit made in a mirror is discarded by the next `npm run sync:agents`.

---

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
