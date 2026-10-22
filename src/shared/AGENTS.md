# `shared/` — the reuse layer

Check this file before building any component, hook, or util.
The rules: `node .agents/cli.mjs rule 02 5` (does one already exist?), `rule 02 6` (does it
go here?). Fetch the section — do not open the file.

## The kit for this project

Chosen with the `plan-kit` playbook on 2026-10-21, from the screens of the original app
(docs/DECISIONS.md #1):

- **Landing** — hero chat, the create wizard, the success card: Bubble, Ticks, SystemPill, Field,
  Button, CopyButton, LanguageSwitch.
- **Room · vote** — header, heatmap, countdown, the "me" sheet: TabBar, SystemPill, Ticks, Sheet,
  Button, Icon, Skeleton.
- **Room · wall** — messages and the composer: Bubble, Ticks, Field, Button, SystemPill.
- **Games** — hub and each game, under the same tab bar: TabBar, Button, Icon, Ticks.
- **Admin** — controls, wall moderation, player codes: Button, Field, CopyButton, Bubble, SystemPill.
- **Finale** — exit actions: Sheet, Button, SystemPill.

| Primitive | Needed by | Variants it starts with |
|---|---|---|
| Icon | room, games, admin, landing | the `ICONS` it is first used with |
| Button | every screen | primary, secondary, ghost, danger · sm, md, lg · loading, full-width |
| Field | landing, wall, admin, join gate | text input, select · error, helper text |
| Sheet | room, finale | bottom sheet; full-height under `sm`; focus-trapped |
| Bubble | landing, wall, admin | in, out · with tail, without |
| SystemPill | landing, room, wall, admin, finale | default, highlight |
| Ticks | landing, wall, vote, games | sent, delivered, read |
| CopyButton | landing, admin | icon + label; copied state |
| LanguageSwitch | landing, room | he ↔ en; writes `LOCALE_COOKIE` |
| TabBar | room, games | bottom bar of links with icon, label and a badge |
| Skeleton | room, games | line, block, circle |

**Considered and left out:** Modal — every dialog in the original is a bottom sheet, so Sheet
covers it. Toast — the original has none; feedback is inline. AppShell, PageHeader — a single
chat-column app with no sidebar; the room's header is the room's. Table — the leaderboard is a
list. Avatar — two uses, both decorative initials inside a feature. EmptyState — built on first
use if the wall or leaderboard needs one.

## Components

| Component | What it is | When to use | Replaces |
|---|---|---|---|
| `components/ComingSoon` | The disabled shell: a feature's label, blurb and a Coming soon marker. | Rendered by `featurePage()` alone. | A 404 or a half-working screen for an unbuilt feature. |
| `components/Icon` | `<Icon name={ICON_NAMES.close} size="sm" />` — a lucide glyph from the `ICONS` map; `back`, `send`, `undo` flip under RTL. | Every icon, anywhere. A missing glyph is one line added to `ICONS`. | Never import `lucide-react` or write `<svg>` outside `Icon/`. |
| `components/Button` | `BUTTON_VARIANTS` primary, secondary, ghost, danger · `BUTTON_SIZES` sm, md, lg · `icon`, `isLoading`, `fullWidth`; icon with no children is icon-only. | Every clickable action that is not navigation. | Never style a raw `<button>` in a feature, and never build an IconButton — pass `icon` with no children. |
| `components/Field` | Label + `<input>` (default) or `as="select"` with `<option>` children · `helper`, `error` (translated) wired by `aria-describedby`; takes `ref` for react-hook-form. | Every form control with a label. | Never put a bare `<input>`/`<select>` in a feature, and never build a second labelled-input wrapper. |
| `components/Sheet` | `<Sheet open onClose title>` — modal bottom sheet (centred panel from `md`), portalled, focus-trapped, Escape and backdrop close. | Every dialog, confirm and side panel. | Never build a Modal or Dialog — this is the only one (see the kit above). |
| `components/Bubble` | `BUBBLE_SIDES` in (start side) / out (end side) · `hasTail` for the first of a run · `meta` slot for time and ticks. Sides and tail follow the direction. | Every chat message: hero chat, the wall, admin's wall. | Never draw a chat bubble or its tail in a feature — compose reactions and names inside this. |
| `components/SystemPill` | Small centred notice · `SYSTEM_PILL_TONES` default (yellow on raised), highlight (green). | "X joined", "voting closed", dates — any system line in a chat column. | Never build a second centred notice or status line. |
| `components/Ticks` | One grey, two grey or two blue check marks · `TICK_STATES` sent, delivered, read. Decorative. | Next to a message's time, or as the app's "done" mark. | Never draw check marks in a feature. |

<!-- Rows are added as components are built. The kit for this project — which primitives are built
     ahead of the first feature screen — is chosen by the plan-kit playbook (step 01.9) and recorded
     above this table. Shape: .agents/templates/index.md. -->

## Hooks

| Hook | What it does | When to use |
|---|---|---|

## Utils

| Util | What it does | When to use |
|---|---|---|
| `utils/cn.ts` | Joins class references, dropping falsy ones. | Every conditional `className`. |
| `utils/classMap.ts` | `classMap(component, map)` throws in development on a class with no rule; `NO_CLASS` for a modifier that deliberately has none. | Every `*.classes.ts`. |
| `utils/featurePage.tsx` | `featurePage(FEATURE_KEYS.x, Screen?)` — the page, or the disabled shell while the flag is off. | Every `page.tsx` under `app/`. |
| `utils/keysOf.ts` | Derives typed message keys from a strings object. | Every `*.keys.const.ts`. |

## Promotion rule

A component starts inside a feature. The moment a second feature needs something close,
generalize it here instead of copying it. Use the `promote` playbook.

## Keep this file current

Adding, changing, or removing anything under `shared/` updates this file in the same change.
