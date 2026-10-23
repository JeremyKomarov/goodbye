-- A room has one language, the one its host created it in; everyone sees the room in it
-- (plan/10-room-language.md). Rooms made before this column read Hebrew, the site's default.

alter table public.rooms
  add column locale text not null default 'he' check (locale in ('he', 'en'));
