# `server/` — server-only modules

Reached from Route Handlers, layouts and the proxy — never from `features/`, `shared/`, `core/` or
`store/` (ESLint). Every file starts with `import "server-only"`. The rule: `node .agents/cli.mjs
rule 01 8`.

| Path | What | Rule |
|---|---|---|
| `api/error-response.server.ts` | `apiError(code, { route })`, `handlingApiErrors(route, fn)`. | Every Route Handler is wrapped; a failure is a code from `core/api`. |
| `api/exit-summary.server.ts` | `exitSummary(room)` — the votes counted and tallied, every goodbye counted, the most reacted one (the earliest of a tie), as `ExitSummaryDto`. | The summary handler. |
| `api/room-snapshot.server.ts` | `roomSnapshot(room)` — the room and its players, hosts and votes as `RoomSnapshotDto`; `toRoomDto`. | Every handler that answers with the room builds it here. |
| `auth/admin-token.ts` | `newAdminToken`, `hashToken`, `tokenMatches` (constant-time). | Only the hash is stored; the token itself is shown once, to the host. |
| `auth/admin.ts` | `requireAdmin(request, slug)` → the room, for a request with its admin token in `ADMIN_TOKEN_HEADER`; `forbidden` otherwise. | First line of every host-only handler. |
| `auth/bearer.ts` | `requireCaller(request)` → `{ userId, accessToken }`, or `unauthorized`; `bearerToken`. | First line of every handler that acts as someone, before the body is read. Pass `accessToken` on to the repo, which writes through `asUser`. |
| `auth/login-code.ts` | `newLoginCode()` — six characters from `LOGIN_CODE_ALPHABET`. | Made only by `POST /api/me/login-code`. |
| `og/card.server.tsx` | `renderCard(locale, { pill, lines, badge })` — the 1200×630 link preview in Karantina, each line in visual order; the tokens' colours copied in, since there is no stylesheet. | The two preview handlers (docs/DECISIONS.md #11). |
| `db/` | Supabase access: the client and one `*.repo.ts` per table group. | The only place `@supabase/supabase-js` is imported on the server. |


## Keep this file current

Adding, changing, or removing anything in this folder updates this file in the same change.
