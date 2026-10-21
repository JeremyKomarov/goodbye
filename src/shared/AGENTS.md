# `shared/` — the reuse layer

Check this file before building any component, hook, or util.
The rules: `node .agents/cli.mjs rule 02 5` (does one already exist?), `rule 02 6` (does it
go here?). Fetch the section — do not open the file.

## Components

| Component | What it is | When to use | Replaces |
|---|---|---|---|

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
| `utils/keysOf.ts` | Derives typed message keys from a strings object. | Every `*.keys.const.ts`. |

## Promotion rule

A component starts inside a feature. The moment a second feature needs something close,
generalize it here instead of copying it. Use the `promote` playbook.

## Keep this file current

Adding, changing, or removing anything under `shared/` updates this file in the same change.
