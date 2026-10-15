-- Each player's code for signing in on another device, kept so the host can look
-- it up (on the admin page) and send it to a player who forgot it. Only the server
-- reads and writes it, with the secret key; clients can't see it at all.

create table public.login_codes (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  code       text not null,
  updated_at timestamptz not null default now()
);

alter table public.login_codes enable row level security;
revoke all on public.login_codes from anon, authenticated;
