---
name: TheeeeOPlex
description: An eight-friend NCAA draft pool, printed as the sports section's late edition.
colors:
  paper: "#e9e8e3"
  paper-deep: "#dedcd5"
  field-paper: "#f6f5f1"
  ink: "#111111"
  ink-soft: "#3a3936"
  muted: "#55534e"
  faded: "#66645e"
  rule: "#b9b7b0"
  masthead-gray: "#bdbbb4"
  highlight: "#f5d65a"
  live-red: "#c8202f"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Barlow Condensed, Head Narrow Fallback, Head Fallback, Avenir Next Condensed, sans-serif-condensed, sans-serif"
    fontSize: "clamp(2rem, 11.5vw, 4.25rem)"
    fontWeight: 800
    lineHeight: 0.88
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Barlow Condensed, Head Narrow Fallback, Head Fallback, Avenir Next Condensed, sans-serif-condensed, sans-serif"
    fontSize: "clamp(2rem, 6vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 0.95
  deck:
    fontFamily: "Barlow Condensed, Head Narrow Fallback, Head Fallback, Avenir Next Condensed, sans-serif-condensed, sans-serif"
    fontSize: "clamp(1.375rem, 3.5vw, 2rem)"
    fontWeight: 800
    lineHeight: 1.05
  section:
    fontFamily: "Barlow Condensed, Head Narrow Fallback, Head Fallback, Avenir Next Condensed, sans-serif-condensed, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1
  title:
    fontFamily: "Barlow Condensed, Head Narrow Fallback, Head Fallback, Avenir Next Condensed, sans-serif-condensed, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 800
    lineHeight: 1.05
  name:
    fontFamily: "Barlow Condensed, Head Narrow Fallback, Head Fallback, Avenir Next Condensed, sans-serif-condensed, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.1
  name-s:
    fontFamily: "Barlow Condensed, Head Narrow Fallback, Head Fallback, Avenir Next Condensed, sans-serif-condensed, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 700
  nav:
    fontFamily: "Barlow Condensed, Head Narrow Fallback, Head Fallback, Avenir Next Condensed, sans-serif-condensed, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    letterSpacing: "0.02em"
  slot:
    fontFamily: "Barlow Condensed, Head Narrow Fallback, Head Fallback, Avenir Next Condensed, sans-serif-condensed, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 700
    lineHeight: 1
  slot-score:
    fontFamily: "Barlow Condensed, Head Narrow Fallback, Head Fallback, Avenir Next Condensed, sans-serif-condensed, sans-serif"
    fontSize: "1rem"
    fontWeight: 800
    lineHeight: 1
  body:
    fontFamily: "Roboto Condensed, sans-serif-condensed, Agate Fallback, Avenir Next Condensed, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.35
    fontFeature: "tnum"
  data:
    fontFamily: "Roboto Condensed, sans-serif-condensed, Agate Fallback, Avenir Next Condensed, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    fontFeature: "tnum"
  caps:
    fontFamily: "Roboto Condensed, sans-serif-condensed, Agate Fallback, Avenir Next Condensed, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 700
    letterSpacing: "0.04em"
  small:
    fontFamily: "Roboto Condensed, sans-serif-condensed, Agate Fallback, Avenir Next Condensed, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Roboto Condensed, sans-serif-condensed, Agate Fallback, Avenir Next Condensed, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    letterSpacing: "0.06em"
rounded:
  none: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "14px"
  lg: "18px"
  xl: "24px"
  gutter: "20px"
  gutter-phone: "16px"
  touch: "44px"
components:
  button-confirm:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
    typography: "{typography.caps}"
  button-confirm-hover:
    backgroundColor: "{colors.ink-soft}"
  button-cancel:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
  button-cancel-hover:
    backgroundColor: "{colors.paper-deep}"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.live-red}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
  button-danger-hover:
    backgroundColor: "{colors.live-red}"
    textColor: "{colors.white}"
  input:
    backgroundColor: "{colors.field-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "8px 10px"
  masthead:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "18px 20px 12px"
  live-tag:
    backgroundColor: "{colors.live-red}"
    textColor: "{colors.white}"
    padding: "2px 6px"
    typography: "{typography.label}"
  you-tag:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "2px 5px"
    typography: "{typography.label}"
  who-name:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "4px 12px"
    height: "36px"
    typography: "{typography.name-s}"
  who-name-hover:
    backgroundColor: "{colors.paper-deep}"
  updated-stamp:
    textColor: "{colors.muted}"
    typography: "{typography.small}"
  refresh-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "6px 0"
  pool-champion:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "16px 18px 14px"
    typography: "{typography.headline}"
  standings-max:
    textColor: "{colors.muted}"
    typography: "{typography.data}"
  draft-last-num:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "0 6px"
  draft-search:
    backgroundColor: "{colors.field-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "8px 10px"
    height: "{spacing.touch}"
    typography: "{typography.name-s}"
  team-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.name}"
    padding: "5px 4px"
  draft-pill-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "2px 6px"
  team-row-hover:
    backgroundColor: "{colors.paper-deep}"
  team-row-pending:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.ink}"
  round-step-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    size: "{spacing.touch}"
  leader-row:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.ink}"
  bracket-slot-highlighted:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.ink}"
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    typography: "{typography.nav}"
    padding: "12px 0 8px"
  tab-active:
    textColor: "{colors.ink}"
  section-bar-phone:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.masthead-gray}"
    typography: "{typography.nav}"
    padding: "12px 2px 10px"
    height: "56px"
  section-bar-phone-active:
    textColor: "{colors.paper}"
  tab-live-marker:
    backgroundColor: "{colors.live-red}"
    size: "8px"
---

# Design System: TheeeeOPlex

## Overview

**Creative North Star: "The Late Edition"**

The pool is printed, not rendered. Every surface reads as a page of the sports section after the night's games: newsprint gray ground, a black masthead closed by a heavy red rule, condensed all-caps heads, and dense agate tables of names, seeds and points. Structure comes from rules (horizontal lines of graded weight), never from boxes. Information is set like a box score: tabular numerals, right-aligned points, tight rows.

Density is high and deliberate. Rows are ruled, not carded; groups are announced by a condensed head sitting on a 3px black rule. Two inks beyond black do all the signalling: a highlighter yellow that means only "look here" (the leader, whoever is on the clock, the pick waiting for confirmation, the champion, the player you asked to follow), and a press red reserved for live action, the masthead rule, and destructive or error states. Everything else (winners, alive teams, the current pick, hovers, active tabs) is said in ink: weight, fill, rule. Eliminated teams stay on the page, struck through and faded, because the record is the point.

The world rejects the dark navy-and-gold sports dashboard: no cards, no pills, no glows, no rounded corners, no cast shadows.

**Key Characteristics:**
- Newsprint ground, black ink, gray hairlines, heavy black rules under every head.
- Barlow Condensed caps for heads, names and big numerals; Roboto Condensed agate for everything tabular; both self-hosted, with size-adjusted local fallbacks.
- One highlighter (yellow, "look here") and one press red (live, frame, danger); nothing else carries hue.
- Square corners everywhere; depth is only rule weight and the highlighter band.
- The reader is known: a one-time "Who are you?" strip, then a You tag and their roster opened by default.
- The page says what is at stake: max-possible points, live scores with "+N if they win", and a pool champion banner when it is over.
- Losers struck through, never removed.

## Colors

A monochrome newsprint page marked by one highlighter and one press red.

### Primary
- **Press Red** (live-red): means live, the frame, or danger. The LIVE tag (in the live line, beside a standings name with a team playing, and in a roster row's out column), the live bracket game's doubled top rule and badge, the 8px live marker square before the Standings tab label, the 6px masthead rule and the matching 6px rule under the pool champion banner, error banners, the danger button, and the text caret. Never a background fill for anything except the LIVE tag, the live bracket badge and the danger hover. Not a selection or navigation color.

### Secondary
- **Highlighter Yellow** (highlight): means "look here", nothing else. Exactly six uses: the leader row (every tied leader; no band while the top score is 0), the on-the-clock drafter's name, the pending pick (its team row and its name in the "X takes Y?" headline, until confirmed or cancelled), the History champion's name, the team slots of the player chosen in the bracket's Showing select, and text selection. Struck text sitting on it steps up to soft ink to hold contrast.

### Neutral
- **Newsprint** (paper): page ground, modal ground, text on ink, and the active label and its 4px top rule in the phone section bar.
- **Deep Newsprint** (paper-deep): the hover fill for pickable team rows, clickable bracket games, the cancel button and the who-are-you name buttons.
- **Field Paper** (field-paper): the one lighter surface, used only inside text inputs.
- **Ink** (ink): body text, heavy rules, masthead ground, the pool champion banner and bracket champion banner, the confirm button, focus outlines, the active tab underline, the phone section bar ground, the current draft pill fill, the last-pick number block, the You tag, the 3px underline under the current drafter and the first search match, and the 3px drag insertion rule.
- **Soft Ink** (ink-soft): secondary text (roster lines, nav at rest, owner names), confirm-button hover.
- **Muted** (muted): column labels, seeds, meta lines, chevrons, the Scores synced stamp, the standings Max numerals, and History's low finisher.
- **Faded** (faded): eliminated and drafted items, placeholders, dimmed bracket games. Always paired with a strike-through when it means "out".
- **Hairline** (rule): 1px row dividers, dotted roster dividers, empty-game borders, the "/" between live games, scrollbar thumb.
- **Masthead Gray** (masthead-gray): secondary text on ink grounds: the masthead subhead, the bracket champion label, the pool champion's points line, and the resting labels of the phone section bar. Defined as the `--masthead-gray` custom property.
- **White** (white): text on red fills only.

### Named Rules
**The Two Inks Rule.** Yellow means "look here"; red means "live, the frame, or danger". Winning, alive, current, hovered and active are said in ink (weight, fill, rule), never in yellow or red. No third hue enters the page.

**The Struck, Not Gone Rule.** Out means faded plus line-through, in place. Never hide or remove an eliminated team, drafted team, or past pick.

## Typography

**Display Font:** Barlow Condensed, self-hosted (latin subset, weights 500, 700 and 800 only), falling back to size-adjusted local faces: Head Narrow Fallback (Arial Narrow at 92%), then Head Fallback (Arial or Helvetica at 74%), then Avenir Next Condensed and the platform condensed sans.
**Body Font:** Roboto Condensed, self-hosted (latin subset, weights 400 and 700 only), falling back to the platform condensed sans, then Agate Fallback (Arial or Helvetica at 88%), then Avenir Next Condensed.

**Character:** A tall, tight headline condensed for masthead, heads, names and scores, over a narrow agate for the tables, exactly as a sports page pairs its headline face with its box-score type. Tabular numerals are on globally. Every size is a role token on `:root` (`--fs-*`); components reference the token, never a literal size.

### Hierarchy
- **Display** (800, clamp(2rem, 11.5vw, 4.25rem), 0.88, -0.01em, uppercase): the masthead title only. Its subhead is Small in the headline face at 500, tracked 0.14em, in masthead gray.
- **Headline** (800, clamp(2rem, 6vw, 3.25rem), 0.95, uppercase): the Draft tab "on the clock" and "X takes Y?" line, and the pool champion's name line ("Dana wins the 2026 pool").
- **Deck** (800, clamp(1.375rem, 3.5vw, 2rem), 1.05, uppercase): the draft's last-pick line, one step under Headline in the same voice.
- **Section** (800, 1.75rem, 1, uppercase): section heads, modal, admin and draft-complete heads, leaderboard points, the bracket champion's name.
- **Title** (800, 1.375rem, 1.05, uppercase): region heads, roster names and totals, bracket region labels, the "Who are you?" question; player names in standings set Title at 700.
- **Name** (700, 1.25rem, 1.1, uppercase): pickable team rows on the Draft tab, admin user names, History year, winner, scores and low finisher, draft-order numbers, phone bracket scores (800).
- **Name-S** (700, 1.1rem, uppercase): who-are-you name buttons, the pick order strip, drafter names (800), the draft search field, draft-order names, Final Four and champion labels, the phone round-pair label (800), empty-state notes in muted.
- **Nav** (700, 1rem, 0.02em, uppercase): primary tabs, bracket region tabs, the bracket Showing select, inline team buttons. On phones the bottom-bar labels scale down as clamp(0.8rem, 3.8vw, 1rem) so five tabs fit at 200% zoom.
- **Slot** (700, 0.92rem, 1, uppercase) and **slot score** (800, 1rem): bracket team names and scores in the 164px desktop game; winners step names up to 800. Phone region view raises names to Data size in the headline face.
- **Body** (400, 0.9375rem, 1.35, tabular numerals): agate default for rows, rosters, History cells, inputs, the pool champion's points line.
- **Data** (400 to 700, 1rem, tabular numerals): standings rank (700), alive count and the Max column (400, muted).
- **Caps** (700, 0.85rem, 0.04em, uppercase): buttons, the live line, the loading line.
- **Small** (400, 0.8rem, 1.4): meta lines, the Scores synced stamp and its Refresh link (700), the roster live-stakes line (700 caps at 0.04em, with the stake in 400 sentence case), drafter strip team lists, the scoring key, seeds, admin meta, inline team lists in standings, historical-season notes, phone round arrows (headline face 700).
- **Label** (700, 0.72rem, 0.06em, uppercase): column heads and toolbar labels in muted; LIVE and You tags in their fills; owners on draft team rows, the draft count and hint, roster out-round labels, bracket seeds, owners, round labels, badges and TBD. The bracket champion label tracks wider at 0.14em in masthead gray.

### Tracking
One step per size band, applied wherever agate or headline type is set in caps: -0.01em for Display; 0.02em for Nav; 0.04em for caps at 0.8rem and up (Caps, the caps Small lines, buttons); 0.06em for caps at 0.75rem and below (Label and everything sized with it); 0.14em only for the masthead subhead and the bracket champion label. Sentence-case text is never tracked.

### Measure
Prose runs at most 72ch: the scoring key, historical-season labels and notes, error banners, admin meta lines and the pool champion's points line. Tables and rows take their container's width; prose does not.

### Draft Night Scale
At 1100px and up, where the board is usually shown over a compressed screen share, draft team rows rise to Title, owners and the pick count to Caps, and seeds and drafter-strip team lists to Body. Below 1100px they keep Name, Label and Small.

### Named Rules
**The Headline Face Rule.** Anything a reader scans for (names, scores, heads) is Barlow Condensed caps. Anything a reader reads across (rosters, meta, seeds, the Max column) is Roboto Condensed agate. History's low finisher is a name, so it sets in the headline face caps at 500 in muted, beside the winner rather than below it.

**The Agate Floor Rule.** Functional text never sets below Label (0.72rem, about 11.5px at the 16px root). Label is the floor, not a step toward smaller.

**The Numerals Rule.** Points are the largest thing in their row, right-aligned, set in the headline face at 800.

**The Loaded Weights Rule.** Only five faces ship: Barlow Condensed 500, 700, 800 and Roboto Condensed 400, 700. Never call for a weight outside that set (no Barlow 600, no Roboto 500); a quieter agate is 400 in muted or soft ink, not a mid weight.

**The Self-Hosted Rule.** Fonts are bundled latin subsets, not fetched from a font CDN; each stack falls to a size-adjusted local face so the swap barely reflows.

## Layout

A single column page, max 1440px, with 20px gutters (16px at 760px and below). Content blocks set their own measure: standings 920px, history 720px, admin 680px. Rows are CSS grids with fixed numeric columns and a flexible name column (standings: rank, name, alive, points). Rhythm is tight: rows pad 6 to 10px vertically, groups open 18px above a head, grids gap 24px.

Breakpoints: 1023px (bracket switches to a region-tabbed, round-stepped two-column view, capped at 760px wide, so tablets never get a half-hidden desktop bracket; region tabs, the round arrows and the Showing select all take a 44px minimum), 640px (draft regions go to two columns), 760/761px (standings collapse team lists into tap-to-expand rosters; the section nav leaves the top and becomes a fixed bottom bar, and the page takes bottom padding of 96px plus the safe-area inset so the bar never covers content), 1100px (draft regions go to four columns). From 1024px the desktop bracket is a fixed 170px-column grid with computed offsets so games align to their feeders; it scrolls horizontally rather than reflowing.

The Draft tab does not scroll inside itself: all four region lists run at full length in the page. The drafter strip is an auto-fill grid of 160px-minimum columns.

## Elevation & Depth

Flat. There are no cast shadows. Depth and grouping come from rule weight and the highlighter band: a 1px hairline separates rows, a 1px ink line closes table headers, a 2px ink line closes an expanded or leading row, a 3px ink line sits under every head, and 6px rules (red under the masthead and under the pool champion banner, ink atop the modal) mark the page's top-level frames. The only overlay is the modal scrim (ink at 60%). The phone section bar is fixed to the foot of the viewport but casts nothing: it is an ink band, the masthead's material repeated at the bottom.

### Shadow Vocabulary
- **Live rule thickener** (`box-shadow: inset 0 2px 0 var(--red)`): doubles the top rule of a live bracket game.
- **Insertion rule** (`box-shadow: inset 0 3px 0 var(--ink)`): marks the drop point while dragging in the draft-order editor.
- **Underline rule** (`box-shadow: inset 0 -3px 0 var(--ink)`): marks the first search match among team rows and the current drafter in the drafter strip.

All three read as rules, not shadows; they are the only box-shadows in the system.

### Named Rules
**The Rule Weight Rule.** Hierarchy is drawn in line weight: 1px divides, 2px closes, 3px heads, 6px frames.

## Shapes

Square everywhere (0px radius on buttons, inputs, selects, modals, tags). No containers with four borders except inline team buttons, who-are-you name buttons, the phone round arrows and inputs; the only filled blocks are the masthead, the phone section bar, the champion banners, tags, the tab live marker and the last-pick number; everything else is bounded above and below by rules only. Icons are small SVG strokes at 2px with square caps, drawn to match the rules; the select caret is two CSS gradient triangles.

## Components

### Buttons
Blunt, uppercase, square.
- **Shape:** square corners (0px), 2px border.
- **Confirm:** ink fill, newsprint text, Caps type, 8px 16px padding. Hover lifts to soft ink.
- **Cancel:** transparent with 2px ink border; hover fills deep newsprint.
- **Danger:** transparent with 2px red border and red text; hover fills red with white text. Destructive actions confirm in place: the cancel-style trigger (Reset draft, Archive season) swaps to a muted question, a cancel button and a danger button; no modal.
- **Disabled:** 50% opacity, not-allowed cursor.
- **Focus:** global 2px ink outline, 2px offset.
- **Transitions:** background and color over 0.12s.

### Inputs / Fields
- **Style:** 1px ink border, field-paper fill, square, 8px 10px padding, Body agate.
- **Focus:** 2px ink outline flush (0 offset).
- **Static/read-only:** transparent fill, hairline border, muted text.
- **Search (draft):** the input style at 44px min height, Name-S caps (placeholder sentence case 500). Typing filters the region lists; the first match is underlined with a 3px ink rule and Enter chooses it, Esc clears.
- **Select (bracket Showing):** a muted Label "Showing" before it; borderless except a 2px ink underline, Nav caps, gradient-triangle caret.

### Navigation
- **Masthead:** ink band, display title, tracked masthead-gray subhead split left/right, closed by a 6px red rule.
- **Section nav:** Standings · Bracket · Draft · History, plus Admin for the commissioner, in that order on every screen size. Switching tabs scrolls the page to the top. Arrow keys, Home and End move between tabs.
- **Tabs (desktop, 761px and up):** Nav type in soft ink, 22px apart, horizontally scrollable without a scrollbar, sitting on a 2px ink rule under the masthead. Active tab turns ink with a 4px ink underline; hover turns ink. The phone bracket's region tabs repeat this pattern at 44px on a 1px ink rule.
- **Section bar (phones, 760px and below):** the same tabs as a fixed bar along the bottom edge, always visible: ink ground, tabs sharing the width equally, each 56px tall, labels in masthead gray at the phone Nav clamp, hover and active in newsprint, the active tab marked by a 4px newsprint rule on its top edge. The bar pads by the safe-area inset; focus outlines turn newsprint, inset 4px.
- **Live marker:** while one of the reader's teams is playing (any live game when no reader is chosen), an 8px press-red square sits before the Standings label, with a screen-reader-only "(live)" after it. It says live, not selected; it appears in both the top tabs and the phone bar.
- **Phone round stepper:** one centered round-pair label ("R32 → Sweet 16", Name-S at 800) between two 44px square 1px-ink-bordered arrow buttons carrying 2px stroke chevrons; an arrow at the end of the range fades to 25%.

### Who Are You? Strip
A one-time identity question shown on Standings and Bracket until answered: a 2px ink rule above, 1px below, "Who are you?" in Title, then each player as a square 1px ink-bordered name button (Name-S caps, 36px min height, deep-newsprint hover) and a "Just looking" underlined text link. The answer is remembered on the device (localStorage); a "Not you? Change" link in the scoring key reopens it. The chosen name follows the reader: You tag in standings, own roster opened, own team in the live line set heavier, own teams highlighted in the bracket by default.

### Tags
- **LIVE:** press-red fill, white Label type, 2px 6px. Appears in the live line, after a standings name with a team in play, and in a roster row's out column.
- **You:** the inverse of ink: ink fill, newsprint Label type, 2px 5px, after the reader's own name.

### Scores Synced Stamp
"Scores synced n min ago" (from the server's last feed sync; "just now" under a minute, a weekday and time past 90 minutes) in Small muted agate, followed by an underlined Refresh text button in ink 700 that reads "Refreshing…" while disabled. On Standings it sits right-aligned on the section head's 3px rule (wrapping beneath the head on phones); on the Bracket it shares a status row with the live line, right-aligned when nothing is live. Ticks every 30 seconds.

### Pool Champion Banner
Shown on Standings only once the championship game is decided, above the section head: an ink block (16px 18px 14px) closed by a 6px red rule, the masthead's frame repeated. The name line is in the Headline voice in newsprint ("Dana wins the 2026 pool"; tied leaders "share" it), followed by a masthead-gray Body line (72ch max) giving points and the margin over second. The section head then reads "Final standings" and the Max column drops out.

### Standings Table (signature)
Grid rows of rank, condensed-caps name, alive x/8, Max and big right-aligned points, divided by hairlines. Max is points banked plus every win the player's surviving teams could still collect, counting each future bracket game once where two of their own teams would meet; it sets in muted agate Data numerals (400), quieter than points, and is hidden once the pool is final. Tied ranks read T2, T6. Every row whose score equals a positive top score is banded highlighter yellow and closed by a 2px ink rule; nobody is banded at 0. On phones a row is a button: a chevron follows the name and tapping opens a roster beneath it, indented and closed by a 2px ink rule. A scoring key line in Small muted agate closes the table.

### Roster Line
Seed (Small), team, out column, points (+n) on a dotted hairline. Zero points render as an em dash, never "+0". Alive teams are plain ink; out teams are faded and struck through with the round they fell in (Label caps). A team playing now carries a live-stakes line under its name: a LIVE tag, its score against the opponent ("61–58 vs Arizona", Small agate 700 caps), then the stake in soft-ink 400 sentence case ("+4 if they win").

### Live Line
A red LIVE tag followed by in-progress scores in agate caps, in Caps, each team followed by its owner in parentheses (400, sentence case, soft ink; the reader's own owner name in 700 ink), separated by hairline-gray slashes. Renders nothing when nothing is live.

### Draft Night
- **Clock:** the Headline line "On the clock: Name" with the name on the yellow band, a muted Label count beneath ("Pick 24 of 64 · 41 remaining").
- **Two-step pick:** choosing a team does not commit it. The row turns yellow and the headline becomes "Name takes Team?" (team on the yellow band) with Confirm pick / Cancel buttons and a muted "Enter to confirm · Esc to cancel" hint in Label.
- **Last pick:** a big line in Deck, the pick number set in an ink block with newsprint numerals ("[23] Jules takes Illinois").
- **Team rows:** Name type, seed at left in Small (top-four seeds in ink 700), owner at right in Label caps (all three rise a step at 1100px, see Draft Night Scale); hairline-divided, deep-newsprint hover; drafted rows faded and struck, sorted below the available ones.
- **Pick order strip:** Name-S caps, "24. Pete" entries; done entries faded and struck, the current one an ink-filled pill with newsprint text.
- **Drafter strip:** a grid of every drafter's roster so far, between a 1px ink rule above and a 3px ink rule below; name and count in Name-S at 800 on a hairline, teams in Small soft ink joined by " · " (an em dash when empty). The current drafter's name takes a 3px ink underline.
- **Reset draft** lives on Admin, not here; the Draft tab keeps only Undo last pick and Set draft order.

### History
A sortable ruled table of seasons in Name type (year, champion on the yellow band, the low finisher in the same face at 500 muted, scores). An archived season expands to its top three rosters with a cancel-style "Show all N rosters" button; seasons from before the site are static rows with no chevron and no hover.

### Bracket Game
164px wide, two 34px team slots between 1px ink rules, split by a hairline. Winner name steps up to 800 weight; loser slot faded and struck. A live game takes a doubled red top rule and a red LIVE badge; an upcoming game's badge carries its tip time in muted on newsprint. Clickable games hover to deep newsprint. Under the bracket's Showing select, that player's team slots band yellow with their owner in ink 700, and every other slot fades to faded ink, names and scores dropping to 500.

### Modal
Newsprint panel, max 440px, 22px padding, 6px ink top rule, square, over a 60% ink scrim.

## Do's and Don'ts

### Do:
- **Do** separate rows with 1px hairline rules and close heads with a 3px ink rule.
- **Do** set names, heads and scores in Barlow Condensed uppercase; set tabular content in Roboto Condensed with tabular numerals.
- **Do** reserve the highlighter yellow for "look here": the leader(s), the on-the-clock drafter, the pending (unconfirmed) pick, the History champion, a shown player's bracket slots, and text selection.
- **Do** say winning, alive, current and hovered in ink: heavier weight, ink fill, deep-newsprint hover, ink rule.
- **Do** show eliminated or used items faded and struck through, in place.
- **Do** keep red for live state, the masthead rule, and errors or destructive actions.
- **Do** keep functional text at Label (0.72rem) or larger, take every size from an `--fs-*` role token, and keep prose to 72ch.
- **Do** keep every corner square.
- **Do** give phone controls a 44px minimum target.
- **Do** confirm destructive or committing actions in place (two-step pick, Reset draft, Archive season) rather than in a modal.

### Don't:
- **Don't** wrap content in cards, pills or rounded containers; bound it with rules.
- **Don't** add cast or glow shadows; depth is rule weight.
- **Don't** introduce a third accent hue or a dark navy-and-gold dashboard palette.
- **Don't** use yellow for hover, drag-over, search matches, winners, alive status or the current drafter's pill; don't use red for navigation state (the Standings live marker reports live play, not selection).
- **Don't** remove eliminated teams or past picks from view.
- **Don't** use icon fonts or glyph icons; use small 2px square-capped SVG strokes.
- **Don't** call for a font weight that is not loaded (Barlow 600, Roboto 500) or load fonts from a CDN.
