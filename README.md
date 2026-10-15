# מתי לצאת מהקבוצה?

A party room for leaving a WhatsApp group. The host opens a room and sends the
link to the group. Everyone joins with a name, votes for the hour the host leaves,
and meanwhile plays games and writes on a farewell wall. When voting closes, the
winning hour locks and a countdown starts. The host presses "יצאתי מהקבוצה" when
they leave, and everyone in the room sees the finale.

Next.js (App Router, Cache Components) on Vercel, Supabase for the database,
anonymous auth and Realtime. Hebrew, right-to-left.

## Run it

```bash
cp .env.example .env.local   # fill in the Supabase keys
npm install
npm run dev                  # http://localhost:3000
```

| Script          | What it does                                    |
| --------------- | ----------------------------------------------- |
| `npm run dev`   | Dev server                                      |
| `npm run build` | Production build (also type-checks)             |
| `npm run lint`  | ESLint                                          |
| `npm test`      | Unit tests (Vitest): hours, time zones, sharing |

## Environment

| Variable                               | Where                                                        |
| -------------------------------------- | ------------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase > Project settings > API                            |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase > API keys (publishable)                            |
| `SUPABASE_SECRET_KEY`                  | Supabase > API keys (secret). Server only: room creation and the host's actions |
| `NEXT_PUBLIC_SITE_URL`                 | Public base URL, no trailing slash. Used in share links and preview images |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`       | Optional bot check, see below                                |

## Supabase setup

1. **Auth > Sign In / Providers:** turn on **anonymous sign-ins**. Every visitor
   gets an anonymous user, kept in their browser, which is how the room remembers them.
2. **Run the migrations** in `supabase/migrations`, in order (SQL editor, or
   `supabase db push`). They create the tables, the row-level security rules, the
   Realtime publication, and a nightly cleanup job (`pg_cron`).
3. **Optional bot check:** in Cloudflare, create a Turnstile widget (Managed or
   Invisible). In Supabase > Auth > Attack Protection, turn on captcha with Turnstile
   and its secret key. Then set `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Without both,
   sign-in works without a captcha.

## How it fits together

- **Rooms and the host.** Creating a room (`app/actions.ts`) returns an admin token.
  It's stored in the host's browser and in the admin link (`/r/<slug>/admin#k=...`),
  and only its hash is in the database. When the host opens the room, the browser
  proves the token and its user is recorded in `room_hosts`. From then on the
  database keeps the host out of the vote, reserves their name, and badges their
  wall messages.
- **Rules live in the database.** Row-level security and triggers decide who may
  vote (players who aren't the host, on a valid hour, before voting closes), keep
  names unique per room, and stamp each wall message with its poster's real name.
  The client only shows what the database allows.
- **Live updates.** One Realtime channel per room (`lib/hooks/useRoom.ts`) carries
  table changes, presence (who's online), typing and the emoji rain.
- **Locking the hour.** When voting time is up, any open room calls `finalize_room`,
  which locks the most-voted hour (ties are drawn at random), once.
- **Leaving.** Once the hour locks, everyone can add it to their calendar
  (`/r/<slug>/exit.ics` or Google Calendar). The host gets two messages ready to
  send to the group in WhatsApp: the decision, and a goodbye with the room's stats.
  WhatsApp can't post into a group by itself, so the host picks the group and
  presses send.
- **Cleanup.** Every night, rooms are deleted 30 days after the exit (60 days after
  creation if the host never pressed exit), along with anonymous users who are no
  longer in any room.
