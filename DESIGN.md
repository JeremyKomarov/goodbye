---
name: Goodbye
description: A party room for leaving a WhatsApp group, dressed as the group itself.
colors:
  whatsapp-green: "#25d366"
  green-bright: "#3bdb76"
  teal-signal: "#00a884"
  outgoing-green: "#005c4b"
  deep-green: "#024034"
  chat-night: "#0b141a"
  panel-slate: "#111b21"
  bubble-slate: "#202c33"
  hairline-slate: "#2a3942"
  strong-hairline: "#667781"
  muted-grey: "#8696a0"
  secondary-grey: "#aebac1"
  body-white: "#e9edef"
  system-pill-yellow: "#ffd279"
  kraft-paper: "#c9a46a"
  exit-red: "#f15c6d"
  critical-strong: "#e8364b"
  read-tick-blue: "#53bdeb"
  warning-strong: "#f0b43c"
  vote-1: "oklch(0.34 0.06 168)"
  vote-3: "oklch(0.5 0.12 164)"
  vote-5: "oklch(0.72 0.16 160)"
typography:
  display:
    fontFamily: "Karantina, Rubik, sans-serif"
    fontSize: "5.5rem"
    fontWeight: 700
    lineHeight: 0.82
    letterSpacing: "-0.025em"
  display-title:
    fontFamily: "Karantina, Rubik, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 0.9
  headline:
    fontFamily: "Rubik, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: "Rubik, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Rubik, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Rubik, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  meta:
    fontFamily: "Rubik, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "1rem"
    fontWeight: 500
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  pill: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "11": "44px"
  "12": "48px"
  "16": "64px"
components:
  button-primary:
    backgroundColor: "{colors.whatsapp-green}"
    textColor: "{colors.chat-night}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.green-bright}"
  button-secondary:
    backgroundColor: "{colors.bubble-slate}"
    textColor: "{colors.body-white}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "40px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.secondary-grey}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "40px"
  button-danger:
    backgroundColor: "#2e161a"
    textColor: "{colors.exit-red}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "40px"
  field:
    backgroundColor: "{colors.bubble-slate}"
    textColor: "{colors.body-white}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "40px"
  bubble-in:
    backgroundColor: "{colors.bubble-slate}"
    textColor: "{colors.body-white}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  bubble-out:
    backgroundColor: "{colors.outgoing-green}"
    textColor: "{colors.body-white}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  system-pill:
    backgroundColor: "{colors.bubble-slate}"
    textColor: "{colors.system-pill-yellow}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "4px 12px"
  choice-card:
    backgroundColor: "{colors.bubble-slate}"
    textColor: "{colors.body-white}"
    rounded: "{rounded.xl}"
    padding: "8px 12px"
  segment-selected:
    backgroundColor: "{colors.outgoing-green}"
    textColor: "{colors.body-white}"
    rounded: "{rounded.pill}"
    padding: "4px 16px"
  tab-bar:
    backgroundColor: "{colors.panel-slate}"
    textColor: "{colors.muted-grey}"
    typography: "{typography.meta}"
    height: "56px"
  sheet:
    backgroundColor: "{colors.panel-slate}"
    rounded: "{rounded.xl}"
    width: "448px"
---

# Design System: Goodbye

<!-- Source of truth for every value: src/core/styles/tokens.scss. This file describes it; when they disagree, the SCSS wins and this file is stale. -->

## Overview

**Creative North Star: "The Last Group Chat"**

Goodbye is a WhatsApp group, played straight. The page is the chat's night background with its
doodle wallpaper; messages are bubbles with tails; notices are the small yellow system pills; the
navigation is the bottom bar of a phone app. The parody works through fidelity: a visitor who
arrives from a WhatsApp link should feel they never left the app, and then notice the joke.

The system breaks out of WhatsApp only at the big moments. Karantina, a tall condensed poster
face, carries the headlines, the countdown's flip digits and the finale; kraft-paper gold marks
what the visitor picked and the finale's paper. Everything between those moments stays quiet,
dense and familiar, a single chat column no wider than a phone.

It is dark only and Hebrew first. Every edge is logical, so the whole layout mirrors for RTL, and
bubble tails flip with it.

**Key Characteristics:**

- WhatsApp dark mode, re-created on purpose: green brand, slate greys, doodle wallpaper.
- One chat column, `640px` at most, on every screen.
- Tonal depth: page, panel, bubble, each a step lighter.
- Karantina for the moments, Rubik for everything else.
- Kraft gold is the wink: picks, progress and the finale.

## Colors

WhatsApp's dark palette, extended with a few warm accents the parody needs.

### Primary

- **WhatsApp Green** (`whatsapp-green`): the primary button, the brand surface, unread badges.
  Text on it is Chat Night, never white.
- **Green Bright** (`green-bright`): primary hover, and positive text.
- **Outgoing Green** (`outgoing-green`): your own bubble, the selected segment, positive borders.
- **Deep Green** (`deep-green`): the active tab's glyph pill.
- **Teal Signal** (`teal-signal`): WhatsApp's secondary teal, kept in the ramp for links and
  marks that need green without the brand's weight.

### Secondary

- **Kraft Paper** (`kraft-paper`): the visitor's picks (checked choice cards, their tick disc,
  step progress), the room header's mark, and the finale's paper. A tint of it (15–22%) fills a
  picked card.
- **System Pill Yellow** (`system-pill-yellow`): system notices ("X joined"), and the focus ring
  everywhere.

### Tertiary

- **Exit Red** (`exit-red`): "exit group" actions, the danger button, error text.
- **Read Tick Blue** (`read-tick-blue`): the blue read ticks, and info text.
- **Vote ramp** (`vote-1` to `vote-5`, five steps of one green-teal hue in OKLCH): the heatmap,
  brighter with more votes. From step 4, text on a cell turns dark.
- **Sender colours** (pink, blue, orange, olive, yellow, violet, green, coral, in
  `tokens.scss`): a member's name above their bubble and their avatar, chosen by hashing their
  id so each person keeps one colour.
- **Picture backdrops** (`--picture-*`, pastels): only behind the Picture game's images.

### Neutral

- **Chat Night** (`chat-night`): the page, under the doodle wallpaper; text on green.
- **Panel Slate** (`panel-slate`): cards, sheets, the tab bar.
- **Bubble Slate** (`bubble-slate`): incoming bubbles, inputs, secondary buttons, choice cards.
- **Hairline Slate** (`hairline-slate`): borders and dividers.
- **Strong Hairline** (`strong-hairline`): a border on hover.
- **Muted Grey** (`muted-grey`): timestamps, helper text, inactive tabs.
- **Secondary Grey** (`secondary-grey`): labels, descriptions, ghost buttons.
- **Body White** (`body-white`): body text.

### Named Rules

**The Status Means Something Rule.** Positive, warning, critical and info colours appear only
where they mean that status. A red used for decoration makes the real "exit" stop registering.

**The Ramp-Only Rule.** No hex outside `tokens.scss`; `npm run guard` fails the build on one.
Every surface and semantic colour is built from the ramps.

**The Same Colours for Every Story Rule.** A room's reason for leaving changes its words, never
its colours (`docs/DECISIONS.md #14`).

## Typography

**Display Font:** Karantina Bold (with Rubik)
**Body Font:** Rubik, variable 300–900 (with system-ui)
**Label/Mono Font:** the system monospace, for login codes only

**Character:** Rubik is WhatsApp-adjacent, round and legible in Hebrew and Latin alike.
Karantina is a narrow Hebrew poster face, tight and loud, used like a banner hung over the chat.

### Hierarchy

- **Display** (700, `min(5.5rem, 22vw, 8.5dvh)`, line-height 0.82, -0.025em): the landing
  headline, the room hero's verdict, the finale, flip digits, story text. English gets a smaller
  cap (`4.25rem`, `15vw`) because its first line is longer.
- **Display steps** (700, Karantina): every fixed display size is a `--display-*` token, chosen by
  the room the screen gives, and a fluid headline caps at one. `xs` 2rem · `sm` 2.25 · `md` 2.5 ·
  `lg` 3 · `xl` 3.25 for card titles, the verdict on a phone, story facts and goodbyes; `2xl`
  3.75 the verdict on a laptop; `3xl` 4 and `4xl` 5.5 the countdown; `5xl` 6.5 the finale on a
  laptop. Line-height 0.9 on a card title.
- **Data floor:** nothing smaller than `--text-xs` (12px), the heatmap's dates, counts and legend
  included.
- **Headline** (600, 1.75rem): page titles.
- **Title** (600, 1.125rem): sheet titles, card titles, emphasised body.
- **Body** (400, 1rem, line-height 1.5): messages and prose. Never smaller than 16px on a
  control, or iOS zooms on focus.
- **Label** (500, 0.875rem): field labels, system pills, segment options.
- **Meta** (400–500, 0.75rem): timestamps, tab labels, badges, helper and error text.

### Named Rules

**The Poster Only Rule.** Karantina appears only at display size, for a moment worth announcing.
Never for body, labels or buttons.

## Layout

A single chat column, centred, `640px` at most (`--content-max-width`); there is no app shell.
On a phone the column is the screen and the room's sections sit behind a sticky bottom tab bar.
From `64rem` the room shows its sections as a list beside the open one, like WhatsApp Web's chat
list.

Spacing is linear, a 4px step (`space-1` to `space-16`). Touch targets reach 44px (`space-11`)
on a coarse pointer, whatever the control's drawn size.

Screens are sized by height as well as width. The landing is one viewport tall: on a phone the hero
chat always keeps room for its header and a line or two, because it is the demonstration; the
form's card is as tall as the step showing, and the language switch shares the headline's cell.
Only under `500px` (a phone held sideways) does the chat step aside for the form. Common breakpoints: `40rem`, `42rem` (a sheet becomes a centred panel), `64rem`.
Layouts are checked at 360px, 768px and 1280px.

## Elevation & Depth

Depth is tonal. Each layer is one grey step lighter: Chat Night page, Panel Slate card, Bubble
Slate bubble or control. Shadows are minimal and dark (a soft shadow is invisible on a dark
page). They lift bubbles and pills a hair, and only a sheet floats, over a 70% black scrim.

### Shadow Vocabulary

- **Hairline lift** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.3)`): bubbles, system pills.
- **Small** (`box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.3)`): rare.
- **Sheet** (`box-shadow: 0 4px 12px -2px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.3)`):
  sheets and popovers only.

### Named Rules

**The Lighter Means Closer Rule.** Raise a surface by moving it one neutral step lighter, not by
adding a bigger shadow.

## Shapes

Soft and familiar. Buttons, badges, avatars, segments and the tab glyph are full pills (`999px`).
Bubbles are `12px` with one square corner where the tail attaches, at the start corner for
others and the end corner for you. Inputs and system pills are `8px`, choice cards and sheets
`16px` (a sheet rounds only its top corners on a phone). Borders are 1px hairlines; a picked
choice gets a 2px inset kraft ring instead of a border.

## Components

### Buttons

Native, with a wink.

- **Shape:** full pill (`999px`), 600 weight; heights `32px`, `40px` (default), `48px`, all at
  least 44px on touch.
- **Primary:** WhatsApp Green with Chat Night text; Green Bright on hover.
- **Secondary:** Bubble Slate with a hairline border that strengthens on hover.
- **Ghost:** transparent, Secondary Grey; Bubble Slate fill on hover.
- **Danger:** critical surface, hairline red border, Exit Red text.
- **Link / Bare:** inline in a sentence; link has a dotted underline.
- **Press:** scales to 0.97. **Loading:** a spinner over the hidden label, so the width holds.
- **Disabled:** 50% opacity.

### Chips (choice groups)

- **Card:** Bubble Slate rows (`16px` radius) with an emoji disc and a round tick. Picked: a 15%
  kraft tint, a 2px inset kraft ring, a filled kraft tick, and the emoji wiggles once.
- **Segment:** a pill track on Bubble Slate; the picked option takes Outgoing Green.

### Cards / Containers

- **Corner Style:** `8px` to `16px`.
- **Background:** Panel Slate on the page; Bubble Slate inside a panel.
- **Shadow Strategy:** none; see Elevation.
- **Internal Padding:** 16–20px.

### Inputs / Fields

- **Style:** Bubble Slate fill, 1px hairline, `8px` radius, 16px text, label above in Secondary
  Grey.
- **Focus:** the border turns WhatsApp Green, plus the yellow focus ring.
- **Error / Disabled:** a strong red border and a 12px red line below; 50% opacity.

### Navigation

- **Tab bar:** a sticky bottom bar on Panel Slate with a hairline top. Each tab is an icon over a
  12px label in Muted Grey; the active one turns Body White and its icon sits in a Deep Green pill.
  Unread counts are WhatsApp Green badges.
- **List:** from `64rem`, the same tabs as rows, like WhatsApp Web's chat list.

### Chat bubble (signature)

The room's basic unit. Incoming on Bubble Slate, yours on Outgoing Green, `85%` of the column at
most. The first in a run carries a tail; follow-ups do not. Timestamp and ticks sit at the
bottom end in Meta.

### System pill (signature)

WhatsApp's centred notice: Bubble Slate with yellow text, or a positive-green variant for good
news.

### Sheet

A bottom sheet on a phone, a centred `448px` panel from `42rem`, over the scrim.

## Do's and Don'ts

### Do:

- **Do** reach for WhatsApp's own pattern first (bubble, system pill, tab bar, sheet).
- **Do** use logical properties everywhere, so RTL and LTR both hold.
- **Do** keep Karantina for moments: headlines, the countdown, the finale.
- **Do** mark the visitor's picks with kraft gold.
- **Do** put WhatsApp Green behind dark text (`chat-night`), never white.
- **Do** give every control the yellow focus ring, or a shape-fitted variant of it.

### Don't:

- **Don't** add a light theme; the app is dark only (`docs/DECISIONS.md #4`).
- **Don't** write a colour literal outside `src/core/styles/tokens.scss`.
- **Don't** widen the column past `640px` or add an app shell.
- **Don't** use status colours as decoration.
- **Don't** recolour a room by its reason for leaving.
- **Don't** draw icons by hand or import a second icon set; use `lucide-react` through
  `shared/components/Icon`.
