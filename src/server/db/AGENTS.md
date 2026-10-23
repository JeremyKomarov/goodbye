# `server/db/` — the database

Supabase Postgres. The schema, row-level security, triggers and the nightly cleanup job are the
SQL in `supabase/migrations/` at the repository root, applied in filename order. Features and
handlers import named async functions from `*.repo.ts`, never the client (`01 §8`).

The database is the hosted project the original app runs on (`docs/DECISIONS.md #1`): the
migrations are already applied there, and live rooms are in it. A test that writes cleans up.
Such a test is named `*.db.test.ts` and skips unless a secret key is in the environment;
`npm run test:db` runs them with `.env.local` loaded.

| File | What | Rule |
|---|---|---|
| `client.ts` | `db()` — the secret-key client, made once; it bypasses row-level security. `asUser(token)` — the caller's own client, made per request, under row-level security. | Imported by the `*.repo.ts` files here and nothing else (ESLint). A write a player makes goes through `asUser`, so the policies and triggers still judge it. |
| `users.repo.ts` | `userIdForAccessToken(token)` — Supabase Auth's answer to "whose token is this?"; `setLoginPassword` — the login code behind a player, which signs their sessions out. | The token check is `server/auth/bearer.ts`'s alone. |
| `wall.repo.ts` | `listWallMessages` (the newest `WALL_LIMIT`, oldest first), `listWallReactions`, `countWallMessages`, `findWallMessage`; as the caller, `insertWallMessage` (`too_fast` from the 3-second policy), `saveReaction` (`forbidden`), `removeReaction`; the host's `deleteWallMessage`. | Same. |
| `scores.repo.ts` | `listBestScores(roomId)` — the `leaderboard` view: each player's best per game, under their player name; `insertScore(token, …)` as the caller — `games_closed` once the host has left. | Same. The ranges are checked before the call (`SubmitScoreInputSchema`) and again by the table. |
| `login-codes.repo.ts` | `findLoginCode`, `findLoginCodes(userIds)`, `saveLoginCode` — `public.login_codes`, readable by no client role. | Read by the code handler now, and by the host's page in 07. |
| `rooms.repo.ts` | `insertRoom` (room + admin-token hash, or neither), `findRoomBySlug`, `findRoomLocale` (the proxy's, docs/DECISIONS.md #13), `findAdminTokenHash`, `deleteRoom`, `finalizeRoom` (the `finalize_room()` RPC: locks to the winner once voting is over, idempotent); the host's `lockRoomNow` (`admin_lock_room()`), `reopenRoom`, `markExited` (once), `undoExit`; `RoomRecord`. | Rows are mapped to camelCase here; snake_case never leaves this file. A Supabase failure throws `upstream_failed`. |
| `players.repo.ts` | `listPlayers(roomId)` — `PlayerRecord`s, oldest first; `isPlayer(roomId, userId)`. `savePlayerName(token, …)` — join or rename, as the caller; `name_taken` from the trigger. | Same. |
| `hosts.repo.ts` | `listHostIds(roomId)` — the host's user ids. `addHost` — idempotent. | Same. Only the server writes this table, after `tokenMatches`. |
| `votes.repo.ts` | `listVotes(roomId)` — `VoteRecord`s. `saveVote(token, …)` / `withdrawVote(token, …)` as the caller; a policy refusal (the host, a non-player) is `forbidden`. `deleteVoteOf` — the host's, when they claim the room. | Same. |

## Keep this file current

Adding, changing, or removing anything in this folder updates this file in the same change.
