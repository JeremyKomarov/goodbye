# `store/` — global client state

Only what more than one feature reads. Split from `core/` because `core/` is boot-time
configuration and this is what changes while the app runs.
The rule: `node .agents/cli.mjs rule 01 7`.

| Store | Holds | Read it through |
|---|---|---|

## What does not belong here

- **Server state.** That is TanStack Query's.
- **Feature-local state.** `useState` first; a feature's own `store/` if it must be shared.
- **The signed-in user.** Resolved on the server, passed down as a prop.

## Keep this file current
