# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**The host:** someone leaving a job, and with it the colleagues' WhatsApp group. They were fired,
quit, or are fed up (`LEAVE_REASONS`). Instead of slipping out of the group, they open a room and
send its link to the group. Mostly Hebrew speakers in Israel; English is complete.

**The group:** the ex-colleagues who open that link, usually on a phone, straight from WhatsApp.
They join under a name, vote on the hour the host leaves, write on the farewell wall and play
games until the hour comes. They did not choose this product; the link reached them.

## Product Purpose

Goodbye turns the awkward moment of leaving a work group into a small party. The host picks a
window; the group votes on the exact hour; a countdown runs; when the host presses "I left the
group", everyone in the room sees the finale and the goodbyes.

Success is the group showing up and playing: joining from the link, voting, writing on the wall,
playing the games until the hour. It is a personal project with no monetisation; growth and new
rooms are not the measure.

## Positioning

A parody of the WhatsApp group itself, used to leave a WhatsApp group. The group decides when
the host goes, which makes the exit a shared event instead of a silent "left" notice.

## Operating Context

- The link arrives inside a WhatsApp chat and opens in a phone's browser. Desktop is secondary.
- The host opens the room from the landing wizard (reason, who, when), gets the room link, a
  WhatsApp invitation and a private admin link (`#k=<token>`), and runs the room from the admin
  page: close or reopen voting, remind non-voters, moderate the wall, press "I left the group".
- The room is live: presence, typing, the countdowns and the emoji rain move in real time.
- A room is in one language, its host's. The room's reason for leaving changes its words, not
  its colours (`docs/DECISIONS.md #13`, `#14`).

## Capabilities and Constraints

- Features: `landing` (wizard and scripted hero chat), `room` (join, vote heatmap, wall, records
  board), `games` (Runaway, Trivia, Catch, the Picture game, with kept scores), `admin` (the
  host's page).
- Terms are fixed in `docs/GLOSSARY.md`: room, host, slot, exit, login code, wall, rain.
- Hebrew is the default locale and the layout is RTL-first; English ships every string.
- No account: a visitor is an anonymous session, and a login code moves them to a second device.
  The host is proven by the admin token, not by signing in. The host cannot vote.
- Next.js on Vercel, Supabase for data, auth and Realtime. No outside error service, no captcha.

## Brand Commitments

- Name: Goodbye.
- Voice: comic first, warm under it. The joke turns an awkward exit into a party; the goodbyes on
  the wall and in the finale are allowed to be sincere.
- Dark only, borrowing WhatsApp's dark mode on purpose, because the product parodies a WhatsApp
  group (`docs/DECISIONS.md #4`). Binding.

## Evidence on Hand

- No testimonials, user numbers, press or case studies exist. Do not invent any.
- The scripted hero chat and its stories are the product's demonstration
  (`src/features/landing/components/HeroChat`).
- `public/doodle.svg` (the chat wallpaper), `public/icons/`, `public/picture-game/`.

## Product Principles

1. **The group is the audience, not the host.** Most visitors never chose to come; the room has to
   pay off within seconds on a phone, from a WhatsApp link.
2. **Joke at the surface, warmth underneath.** Comedy frames the exit; never mock the goodbyes
   people write.
3. **It is a WhatsApp group, and knows it.** Familiar chat conventions are the material, used
   knowingly rather than copied blindly.
4. **Live, shared moment.** Whatever happens in the room, everyone in it sees it happen together.
5. **Hebrew first.** Copy, layout and gendered forms are written for Hebrew; English follows.

## Accessibility & Inclusion

- RTL and LTR both correct, through logical properties.
- Hebrew forms addressed to the host follow the host's chosen gender.
- The hero chat is one labelled image to a screen reader; decorative motion stays decorative.
