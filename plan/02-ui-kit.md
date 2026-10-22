# 02 — UI kit

**Goal:** every primitive the screens share exists in `shared/components/`, in both locales and
both directions, before the first feature screen is built.
**Depends on:** 01
**Status:** in progress

## Steps
- [x] ~~02.1 — `Icon`, wrapping `lucide-react`, with the icons the room tabs and actions need (S)~~
- [x] ~~02.2 — `Button` — primary, secondary, ghost, danger · sm, md, lg · loading (M)~~
- [x] ~~02.3 — `Field` — labelled text input and select, error and helper text (M)~~
- [x] ~~02.4 — `Sheet` — portal bottom sheet, focus trap, Escape and backdrop close (M)~~
- [x] ~~02.5 — `Bubble` — in/out chat bubble with the WhatsApp tail, mirrored in RTL (S)~~
- [x] ~~02.6 — `SystemPill` and `Ticks` (S)~~
- [x] ~~02.7 — `CopyButton` and `LanguageSwitch` (S)~~
- [x] ~~02.8 — `TabBar` — bottom navigation of links, icon, label, badge (S)~~
- [~] 02.9 — `Skeleton` (S)
- [ ] 02.10 — a dev-only `/dev/kit` catalog rendering every variant, `notFound()` in production (S)

## Done when
`/dev/kit` shows every primitive and variant, checked at 360px, 768px and 1280px in Hebrew (RTL)
and English (LTR), and `npm run verify` passes.

## Notes
The kit and what was left out are recorded in `src/shared/AGENTS.md` under
`## The kit for this project`. The catalog is not a registry entry (`04 §2`).
