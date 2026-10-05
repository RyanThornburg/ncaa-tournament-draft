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
  segmented-switch:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "6px 4px"
    height: "{spacing.touch}"
    typography: "{typography.nav}"
  segmented-switch-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  segmented-switch-hover:
    backgroundColor: "{colors.paper-deep}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
    height: "36px"
    typography: "{typography.nav}"
  chip-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  chip-hover:
    backgroundColor: "{colors.paper-deep}"
  box-score:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    typography: "{typography.name-s}"
  box-score-mine:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.ink}"
  road-stop:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "7px 10px 8px 8px"
    typography: "{typography.name-s}"
  road-stop-current:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.ink}"
  your-games-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "9px 12px 9px 0"
    typography: "{typography.name}"
  load-error:
    backgroundColor: "transparent"
    textColor: "{colors.live-red}"
    padding: "10px 0"
  pool-low:
    textColor: "{colors.masthead-gray}"
    typography: "{typography.caps}"
  confirm-question:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  admin-notice:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "10px 0"
  recap-cell:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "6px 8px"
    typography: "{typography.name-s}"
  recap-cell-called:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
  your-teams-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.name}"
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
- The page says what is at stake: the reader's own games first on Standings, max-possible points, live scores with "+N if they win", and a pool champion banner when it is over.
- Losers struck through, never removed.

## Colors

A monochrome newsprint page marked by one highlighter and one press red.

### Primary
- **Press Red** (live-red): means live, the frame, or danger. The LIVE tag (in the live line, beside a standings name with a team playing, and in a roster row's out column), the live bracket game's doubled top rule and badge, the 3px red top rule of a live box score and the LIVE tag in its head and in a live road stop, the 8px live marker square before the Standings tab label, the 6px masthead rule and the matching 6px rule under the pool champion banner, load-error banners (their Try again link included) and the Draft and Admin error banners, the danger button, and the text caret. Never a background fill for anything except the LIVE tag, the live bracket badge and the danger hover. Not a selection or navigation color.

### Secondary
- **Highlighter Yellow** (highlight): means "look here", nothing else. Exactly eight uses: the leader row (every tied leader; no band while the top score is 0), the on-the-clock drafter's name, the pending pick (its team row and its name in the "X takes Y?" headline, until confirmed or cancelled), the reader's own titles in History (other winners carry 800 weight and the 3px ink underline rule instead), the team slots of the player chosen in Full bracket's Showing select (only teams still alive; that player's eliminated teams fade with everyone else's), the reader's own team row in a Games box score, the current stop (live or next game) of each road in My path, and text selection. Struck text sitting on the band steps up to soft ink to hold contrast. The Your games block on Standings and the Your games section in Games are deliberately unbanded: every row in them would be yellow, so it says nothing. Your teams on Standings is unbanded for the same reason, and the draft recap calls out its steal and bust in ink (an outline and a tag), not yellow.

### Neutral
- **Newsprint** (paper): page ground, modal ground, text on ink, and the active label and its 4px top rule in the phone section bar.
- **Deep Newsprint** (paper-deep): the hover fill for pickable team rows, clickable bracket games, the cancel button, the who-are-you name buttons, the Bracket view switch and draft recap switch segments and the round chips.
- **Field Paper** (field-paper): the one lighter surface, used only inside text inputs.
- **Ink** (ink): body text, heavy rules, masthead ground, the pool champion banner and bracket champion banner, the confirm button, focus outlines, the active tab underline, the phone section bar ground, the current draft pill fill, the active segment of the Bracket view switch and the draft recap switch, the active round chip, the 2px outline and 1px tag frame of a draft recap steal or bust, the admin notice's 2px top rule, the My path champion line, the last-pick number block, the You tag, the 3px underline under the current drafter, the ink band behind the draft search's Enter target, and the 3px drag insertion rule.
- **Soft Ink** (ink-soft): secondary text (roster lines, nav at rest, owner names), confirm-button hover.
- **Muted** (muted): column labels, seeds, meta lines, chevrons, the Scores synced stamp, the standings Max numerals (and the "—" Max shows when live scores fail to load), and History's low finisher.
- **Faded** (faded): eliminated and drafted items, placeholders, dimmed bracket games. Always paired with a strike-through when it means "out".
- **Hairline** (rule): 1px row dividers, dotted roster dividers, empty-game borders, the "/" between live games, scrollbar thumb.
- **Masthead Gray** (masthead-gray): secondary text on ink grounds: the masthead subhead, the bracket champion label, the pool champion's points line and low-score line, and the resting labels of the phone section bar. Defined as the `--masthead-gray` custom property.
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
- **Title** (800, 1.375rem, 1.05, uppercase): the Your games and Your teams heads on Standings, the "Out: all 8" obituary head and the "Banked, final" total, region heads, roster names and totals, box-score scores, My path team heads, bracket region labels, the "Who are you?" question; player names in standings set Title at 700.
- **Name** (700, 1.25rem, 1.1, uppercase): Games column heads (Your games, Live, Up next, Final, and My path's Out, at 800 on a 3px ink rule), Your games team names and their "+N" values (800), pickable team rows on the Draft tab, admin user names, Your teams survivor names, points in the draft recap ledger (800), History year, winner, scores and low finisher, draft-order numbers, phone bracket scores (800).
- **Name-S** (700, 1.1rem, uppercase): who-are-you name buttons, the pick order strip, drafter names (800), the draft search field, draft-order names, Final Four and champion labels, the phone round-pair label and the Games phone round label (800), box-score team names (winners 800), road-stop opponents, empty-state notes in muted; in the draft recap, player heads and round labels (800), board cell teams (700, 800 for points), ledger teams and the Steal/Bust call heads (800).
- **Nav** (700, 1rem, 0.02em, uppercase): primary tabs, bracket region tabs, the Bracket view switch, round chips, the Showing and Path for selects, inline team buttons, team names in the Games strip. On phones the bottom-bar labels scale down as clamp(0.8rem, 3.8vw, 1rem) so five tabs fit at 200% zoom.
- **Slot** (700, 0.92rem, 1, uppercase) and **slot score** (800, 1rem): bracket team names and scores in the 164px desktop game; winners step names up to 800. Phone region view raises names to Data size in the headline face.
- **Body** (400, 0.9375rem, 1.35, tabular numerals): agate default for rows, rosters, History cells, inputs, the pool champion's points line; the in-place confirm question at 700 in ink, so it reads over a screen share.
- **Data** (400 to 700, 1rem, tabular numerals): standings rank (700), alive count and the Max column (400, muted).
- **Caps** (700, 0.85rem, 0.04em, uppercase): buttons, the live line, the loading line, Your games tip times, the pool champion's low-score line (agate, masthead gray).
- **Small** (400, 0.8rem, 1.4): meta lines, the Scores synced stamp and its Refresh link (700), the roster live-stakes line (700 caps at 0.04em, with the stake in 400 sentence case), drafter strip team lists, the scoring key, seeds, admin meta, inline team lists in standings, historical-season notes, phone round arrows (headline face 700), the Your games count, opponent line and "if they win" (soft ink), the draft search's no-match line (700, ink), the Max explainer (soft ink), the Your teams lines and Out list (struck names faded, points soft ink), the recap's steal/bust lines and ledger meta (soft ink), value numerals (700).
- **Label** (700, 0.72rem, 0.06em, uppercase): column heads and toolbar labels in muted; LIVE and You tags in their fills; owners on draft team rows, the draft count and hint (the snake-turn note inside it in ink 700), roster out-round labels, the Your games region line (400 soft ink), bracket seeds, owners, round labels, badges and TBD; admin field labels above their inputs, Your teams out-rounds (soft ink) and the recap board's pick number and seed lines (400 soft ink; a steal or bust tag in 700 ink). The bracket champion label tracks wider at 0.14em in masthead gray.

### Heading Levels
The masthead title is the page's only h1. Everything a tab shows under it is an h2: the Standings head, Your games, the pool champion line, Games column heads, My path team heads and Out, Draft complete, Your teams, the draft recap ledger heads, and Admin's Season and Players heads (Your teams' obituary head is its h3). Level is structure; size comes from the role token, so an h2 can set at Name.

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

A single column page, max 1440px, with 20px gutters (16px at 760px and below). Content blocks set their own measure: standings 920px, history 720px, admin 680px. Rows are CSS grids with fixed numeric columns and a flexible name column (standings: rank, name, alive, Max, points; rank, name, points once the pool is final). Rhythm is tight: rows pad 6 to 10px vertically, groups open 18px above a head, grids gap 24px. Your teams on Standings is two columns (survivors 1.15fr, Out list 1fr, divided by a vertical hairline; Out at 1.2fr beside the obituary when nobody is left), one column at 760px and below. Admin is two headed sections, Season and Players, 28px apart.

The Bracket tab opens with the scores-synced status row (plus the live line in My path and Full bracket), then a three-way view switch (max 460px wide, full width below 1024px). Games runs Live, Up next and Final as three equal columns 28px apart (two when there are no results yet: an empty Final column is left out), with the reader's Your games section spanning the full width above them. Below 1024px they stack in reading order Live, Your games, Up next, Final. A road in My path is four stops across on desktop and a list below 1024px (round label left, opponent centre, points right). Games' Your games section is an auto-fill grid of 260px-minimum cells on desktop and a single ruled list (team name left, game right) below 1024px. Standings' Your games block is an auto-fit grid of 280px-minimum cells divided by vertical hairlines, one column at 760px and below.

Breakpoints: 1023px (Games columns stack, roads become lists, the view switch goes full width; Full bracket switches to a region-by-region, round-stepped two-column view, capped at 760px wide, so tablets never get a half-hidden desktop bracket; the region is chosen with a Region select at the right of the Showing row rather than a second row of tabs (region tabs remain only when there is no Showing row); the round arrows and both selects take a 44px minimum), 640px (draft regions go to two columns), 760/761px (standings collapse team lists into tap-to-expand rosters; Games swaps its round chips for a round stepper; the draft recap board becomes a round stepper over a per-round list and the ledger's player table drops its best and worst columns; the section nav leaves the top and becomes a fixed bottom bar, and the page takes bottom padding of 96px plus the safe-area inset so the bar never covers content), 1100px (draft regions go to four columns). From 1024px the desktop bracket is a fixed 170px-column grid with computed offsets so games align to their feeders; it scrolls horizontally rather than reflowing.

Shareable state lives in the query string, replaced in place: `?tab=` (standings, bracket, draft, history, admin; Standings is the default and is left off), `?view=` (games, path, bracket on Bracket; board, ledger for the draft recap) and `?player=` (the Path for or Showing player). A link wins over the view the device remembers; switching tabs clears view and player. The draft recap's choice is never remembered, only linked.

The Draft tab does not scroll inside itself: all four region lists run at full length in the page. After the draft its recap board is an 8-column grid (a 2.75rem round column, then one 118px-minimum column per drafter in draft order) that scrolls horizontally rather than squeezing. The drafter strip is an auto-fill grid of 160px-minimum columns.

## Elevation & Depth

Flat. There are no cast shadows. Depth and grouping come from rule weight and the highlighter band: a 1px hairline separates rows, a 1px ink line closes table headers, a 2px ink line closes an expanded or leading row, a 3px ink line sits under every head, and 6px rules (red under the masthead and under the pool champion banner, ink atop the modal) mark the page's top-level frames. The only overlay is the modal scrim (ink at 60%). The phone section bar is fixed to the foot of the viewport but casts nothing: it is an ink band, the masthead's material repeated at the bottom.

### Shadow Vocabulary
- **Live rule thickener** (`box-shadow: inset 0 2px 0 var(--red)`): doubles the top rule of a live bracket game. (A live box score in Games does the same with a real 3px red top border.)
- **Insertion rule** (`box-shadow: inset 0 3px 0 var(--ink)`): marks the drop point while dragging in the draft-order editor.
- **Underline rule** (`box-shadow: inset 0 -3px 0 var(--ink)`): marks the current drafter in the drafter strip.

All three read as rules, not shadows; they are the only box-shadows in the system. The draft recap's steal and bust cells take a 2px ink outline inset by its own width, a closing rule drawn on four sides.

### Named Rules
**The Rule Weight Rule.** Hierarchy is drawn in line weight: 1px divides, 2px closes, 3px heads, 6px frames.

## Shapes

Square everywhere (0px radius on buttons, inputs, selects, modals, tags). No containers with four borders except inline team buttons, who-are-you name buttons, the phone round arrows, the Bracket view switch and draft recap switch (2px ink frame, 1px ink dividers), round chips, inputs, the recap's steal and bust cells (2px ink outline) and their phone tags (1px ink); the only filled blocks are the masthead, the phone section bar, the champion banners and the My path champion line, tags, the tab live marker, the active view segment and round chip, and the last-pick number; everything else is bounded above and below by rules only. Icons are small SVG strokes at 2px with square caps, drawn to match the rules; the select caret is two CSS gradient triangles.

## Components

### Buttons
Blunt, uppercase, square.
- **Shape:** square corners (0px), 2px border.
- **Confirm:** ink fill, newsprint text, Caps type, 8px 16px padding. Hover lifts to soft ink.
- **Cancel:** transparent with 2px ink border; hover fills deep newsprint.
- **Danger:** transparent with 2px red border and red text; hover fills red with white text.
- **In-place confirm:** one pattern for every destructive action (Undo last pick, Reset draft, Archive season, Deactivate a user); no modal. The cancel-style trigger swaps, right-aligned where it stood, to a question naming what goes or what follows ("Undo pick 23 (Jules, Illinois)?", "Delete all picks?", "Archive 2026? Standings freeze into History.", "Deactivate Dana?") in Body 700 ink, then the danger button (Undo it, Delete all picks, Archive 2026, Deactivate), then the cancel button (Keep, Keep picks) last. Keep lands where the trigger was and takes focus; the danger button ignores clicks for its first 400ms so a double-click on the trigger cannot fire it. While working, both disable and the danger label reads "Undoing…", "Deleting…", "Archiving…".
- **Disabled:** 50% opacity, not-allowed cursor.
- **Focus:** global 2px ink outline, 2px offset.
- **Transitions:** background and color over 0.12s.

### Inputs / Fields
- **Style:** 1px ink border, field-paper fill, square, 8px 10px padding, Body agate.
- **Focus:** 2px ink outline flush (0 offset).
- **Static/read-only:** transparent fill, hairline border, muted text.
- **Labelled fields (Admin):** every field sets its Label above the input (muted caps, 4px gap), fields sharing a row and wrapping at 140px minimum; Cancel and the confirm button follow 10px below.
- **Search (draft):** the input style at 44px min height, Name-S caps (placeholder sentence case 500). Typing filters the region lists, and regions with nothing matching step aside while a query is in. It finds teams by the names people say on the call: "St." reads as State at the end of a name and Saint elsewhere (in the team and in the query), punctuation and "&" are ignored, and a short alias list spells out abbreviations (UConn ↔ Connecticut, UNC, Ole Miss, BYU, VCU, SIUE…). The best-ranked undrafted match is the Enter target: its row inverts to an ink band with paper text and a small boxed "Enter" tag at the right, loud enough to survive a compressed screen-share. Enter chooses it, Esc clears.
- **Select (Showing, Path for, Region):** a muted Label before it ("Showing" in Full bracket, "Path for" in My path, and below 1024px "Region" at the right of the Showing row); borderless except a 2px ink underline, Nav caps, gradient-triangle caret, 44px minimum below 1024px. The Showing select lives inside the Full bracket view, in a toolbar just above the bracket, with a Clear link while a player is shown. It follows the reader by default during the tournament and opens on Everyone once the title is decided, so the champion never sits faded.

### Navigation
- **Masthead:** ink band, display title, tracked masthead-gray subhead split left/right, closed by a 6px red rule.
- **Section nav:** Standings · Bracket · Draft · History, plus Admin for the commissioner, in that order on every screen size. Switching tabs scrolls the page to the top and rewrites the deep link (see Layout). Arrow keys, Home and End move between tabs. Only the selected tab carries aria-controls, since only its panel is rendered.
- **Tabs (desktop, 761px and up):** Nav type in soft ink, 22px apart, horizontally scrollable without a scrollbar, sitting on a 2px ink rule under the masthead. Active tab turns ink with a 4px ink underline; hover turns ink. The phone bracket's region tabs (shown only when Full bracket has no Showing row) repeat this pattern at 44px on a 1px ink rule.
- **Section bar (phones, 760px and below):** the same tabs as a fixed bar along the bottom edge, always visible: ink ground, tabs sharing the width equally, each 56px tall, labels in masthead gray at the phone Nav clamp, hover and active in newsprint, the active tab marked by a 4px newsprint rule on its top edge. The bar pads by the safe-area inset; focus outlines turn newsprint, inset 4px.
- **Live marker:** while one of the reader's teams is playing (any live game when no reader is chosen), an 8px press-red square sits before the Standings label, with a screen-reader-only "(live)" after it. It says live, not selected; it appears in both the top tabs and the phone bar.
- **Phone round stepper:** one centered round-pair label ("R32 → Sweet 16", Name-S at 800) between two 44px square 1px-ink-bordered arrow buttons carrying 2px stroke chevrons; an arrow at the end of the range fades to 25%. Games uses the same stepper at 760px and below in place of its chips, one round at a time in the long label ("Round of 32"), between 1px ink rules.

### Bracket View Switch
A segmented control of three square buttons, Games · My path · Full bracket, inside a 2px ink frame divided by 1px ink rules. Each segment is 44px minimum, Nav caps in ink; hover fills deep newsprint; the active segment fills ink with newsprint text (aria-pressed). It is 460px max on desktop and full width below 1024px. The My path segment names whose road it shows when it isn't the reader's ("Dana's path"). The draft recap's two-way switch (The board · The ledger) is the same control at 320px max. The choice is remembered per device (localStorage); with no stored choice it opens on Games while the tournament runs and on Full bracket once the final is decided.

### Chips
Round filters in Games (R64, R32, Sweet 16, Elite 8, Final Four, Final): square 1px ink-bordered buttons, 36px minimum, Nav caps, deep-newsprint hover, ink fill with newsprint text when active. Games opens on the current round (the lowest round with an unfinished, fully set game). Chips are square filters, never pills. At 760px and below they give way to the phone round stepper.

### Who Are You? Strip
A one-time identity question shown on Standings and Bracket until answered: a 2px ink rule above, 1px below, "Who are you?" in Title, then each player as a square 1px ink-bordered name button (Name-S caps, 36px min height, 44px on phones, deep-newsprint hover) and a "Just looking" underlined text link. The answer is remembered on the device (localStorage); a "Not you? Change" link in the scoring key reopens it. The chosen name follows the reader: You tag in standings, own roster opened after the final (during the tournament the row note and the blocks below the table carry it, so the race stays in one screen), own team in the live line set heavier, own teams highlighted in the bracket by default.

### Tags
- **LIVE:** press-red fill, white Label type, 2px 6px. Appears in the live line, after a standings name with a team in play, and in a roster row's out column.
- **You:** the inverse of ink: ink fill, newsprint Label type, 2px 5px, after the reader's own name.

### Scores Synced Stamp
"Scores synced n min ago" (from the server's last feed sync; "just now" under a minute, a weekday and time past 90 minutes) in Small muted agate, followed by an underlined Refresh text button in ink 700 that reads "Refreshing…" while disabled. On Standings it sits right-aligned on the section head's 3px rule (wrapping beneath the head on phones); on the Bracket it shares the status row above the view switch with the live line (My path and Full bracket only), right-aligned when nothing is live. Ticks every 30 seconds. The stamp is not a live region: only the refresh itself is announced ("Refreshing scores", via a visually hidden status), never the minute-by-minute clock.

### Load Error Banner
One wording pattern for every failed load, on every tab: "Couldn't load X." when nothing is on screen, "Couldn't refresh X. Showing what loaded last." when stale data stays up (with "; it will try again in 2 minutes" where the tab polls), naming the thing in reader words (standings, live scores, the bracket, the draft board, past seasons, the pool). A "Try again" underlined text button sits inside the banner in its red, after the sentence on wide screens and on its own line below 760px (44px tap height). When the standings never loaded, the Standings head and sync stamp stay hidden rather than heading an empty table, and the live line and Your games still name owners from the pool's picks. Press-red 700 text between a 3px red rule above and 1px below, 72ch max, role alert. The technical error lives only in the banner's title tooltip, never in the sentence. A feed that fails does not take the other down: the app loads games apart from the pool data, so a games failure never hides Draft or Bracket; on Standings the table still renders, a "Couldn't load live scores." banner appears, and Max reads "—". Failed actions on Draft and Admin use the same banner in plain words with a next step ("That pick didn't save. Pick it again.", "Couldn't archive 2026. Try again."), detail in the title.

### Round Labels and Tip Times
One vocabulary for rounds, in three sizes. Long for headings and the masthead edition line: Round of 64, Round of 32, Sweet 16, Elite 8, Final Four, Championship. Short for chips, bracket round labels and meta: R64, R32, Sweet 16, Elite 8, Final Four, Final. Tiny for tight columns (road stops, out-labels): R64, R32, S16, E8, F4, Final. A team that lost the title game reads "Lost final" in its out column, never a game status. Tip times read "7:10 PM" today and "Mon 7:10 PM" otherwise, everywhere.

### Pool Champion Banner
Shown on Standings only once the championship game is decided, above the section head: an ink block (16px 18px 14px) closed by a 6px red rule, the masthead's frame repeated. The name line is in the Headline voice in newsprint ("Dana wins the 2026 pool"; tied leaders "share" it), followed by a masthead-gray Body line (72ch max) giving points and the margin over second, then the low score said quietly: "Low score: Pete, 9. There's always next March." in agate Caps, masthead gray, above a 1px soft-ink rule (tied lows joined with " & "). The section head then reads "Final standings"; the Alive and Max columns drop out, and the scoring key loses its Max sentence.

### Standings Table (signature)
Grid rows of rank, condensed-caps name, alive x/8, Max and big right-aligned points, divided by hairlines. Max is points banked plus every win the player's surviving teams could still collect, counting each future bracket game once where two of their own teams would meet; it sets in muted agate Data numerals (400), quieter than points, and is hidden, with Alive, once the pool is final. The Max column head is a button (dotted underline, 44px on phones) that opens a one-line Small soft-ink explanation under the header row, 72ch max. Tied ranks read T2, T6. Every row whose score equals a positive top score is banded highlighter yellow and closed by a 2px ink rule; nobody is banded at 0. On phones a row is a button: a chevron follows the name and tapping opens a roster beneath it, indented and closed by a 2px ink rule. Inline team lists show a team's points in parentheses only once it has scored. A scoring key line in Small muted agate closes the table.

### Your Games (Standings)
"What do I watch tonight?" Once the reader is known and has a surviving team with a set game, a Your games block sits directly below the standings table, in place of the live line above it (rivals' live games still show as LIVE tags in the table). The race leads on every screen: all eight ranks fit the first phone viewport, and the reader's own news rides on their row as a one-line note in Small soft ink under their name: live games first (LIVE tag, the team and score in 700 ink, "· +5"), then " / " and the later games by tip ("Houston 7:09 · Maryland 9:45"). With a live game in the note, the LIVE tag leaves the reader's name. Head in Title on a 3px ink rule, with a Small muted count at right ("R32 · 3 of yours on now"). Up to four cells, live first, then by tip time: at left the tip time in Caps ink (or a LIVE tag) over the region in Label soft ink; the team in Name 800 (live score after it); "vs 5 Oregon · Grapes" (opponent seed, name, owner) in Small soft ink; at right "+N" in Name 800 over "if they win" in Small soft ink. Cells divide by vertical hairlines and close on a 1px ink rule; unbanded. A right-aligned text link with a chevron goes to Bracket → Games ("All 16 R32 games in Bracket", or "2 more of yours, and all 16 R32 games, in Bracket"). Renders nothing when the reader has no game set; Your teams takes its place.

### Your Teams (Standings)
Shown when the reader is a player, none of their teams has a game set, and the title is not decided; it sits below the standings table, like Your games. The reader's row then carries a one-line note naming their first survivor and what it waits on ("Alabama · Elite 8 vs Mississippi St. / Arizona winner · +1 more alive"). Same head row as Your games ("Your teams" in Title on a 3px ink rule, "3 of 8 alive · 20 pts · max 41" in Small muted). Left, each survivor as a row (divided by hairlines): round and tip time (or TBD) in the Your games when-column; the team in Name 800; "1 seed · +4 so far · beat 9 Creighton" and "Waiting on 4 Arizona / 5 Oregon (Ryan / Dana), 7:10 PM" (or "playing now") in Small soft ink; at right one "+N vs Team" value per possible opponent. Right, beside a vertical hairline, the Out list under a Label head ("Out · 5", points at right): seed, struck faded name, tiny round label, points, in two columns on dotted hairlines. With nobody alive the left side becomes the obituary ("Out: all 8" in Title, then the last one out and who beat them in which round), the Out list runs one column and closes on a 2px ink rule with "Banked, final" and the total in Title. One column at 760px and below. Unbanded.

### Roster Line
Seed (Small), team, out column, points (+n) on a dotted hairline. Zero points render as an em dash, never "+0". Alive teams are plain ink; out teams are faded and struck through with the round they fell in (Label caps, tiny round label; "Lost final" for the runner-up). A team playing now carries a live-stakes line under its name: a LIVE tag, its score against the opponent ("61–58 vs Arizona", Small agate 700 caps), then the stake in soft-ink 400 sentence case ("+4 if they win").

### Live Line
A red LIVE tag followed by in-progress scores in agate caps, in Caps, each team followed by its owner in parentheses (400, sentence case, soft ink; the reader's own owner name in 700 ink), separated by hairline-gray slashes. Renders nothing when nothing is live. On Standings it gives way when the reader has a game set (their row note and Your games carry the live score). On the Bracket tab it shows in My path and Full bracket, not in Games, which has its own Live column.

### Draft Night
- **Clock:** the Headline line "On the clock: Name" with the name on the yellow band, a muted Label count beneath ("Pick 24 of 64 · 41 remaining"), which at a snake turn adds "Dana has the next two picks" or "Dana picks again at the turn" in ink 700.
- **Two-step pick:** choosing a team does not commit it. The row turns yellow and the headline becomes "Name takes Team?" (team on the yellow band) with Confirm pick / Cancel buttons and a muted "Enter to confirm · Esc to cancel" hint in Label (hidden on touch screens, where it means nothing). Confirm pick is described by the "Name takes Team?" line, so a screen reader hears the team. Undo last pick is disabled while a pick is pending, so only one decision is ever live. Focus moves to Confirm pick; Enter elsewhere only confirms when nothing else has focus, so a focused control never commits a pick by accident. Cancel and Esc return focus to the search.
- **Last pick:** a big line in Deck, the pick number set in an ink block with newsprint numerals ("[23] Jules takes Illinois").
- **Team rows:** Name type, seed at left in Small (top-four seeds in ink 700), owner at right in Label caps (all three rise a step at 1100px, see Draft Night Scale); hairline-divided, deep-newsprint hover; drafted rows faded and struck, sorted below the available ones.
- **Pick order strip:** Name-S caps, "24. Pete" entries; done entries faded and struck, the current one an ink-filled pill with newsprint text.
- **Drafter strip:** a grid of every drafter's roster so far, between a 1px ink rule above and a 3px ink rule below; name and count in Name-S at 800 on a hairline, teams in Small soft ink joined by " · " (an em dash when empty). The current drafter's name takes a 3px ink underline.
- **Before the order exists:** only the commissioner's board randomizes the draft order; everyone else sees an empty note, "The draft order isn't set yet. The commissioner sets it on draft night."
- **Search no-match:** when the query matches no undrafted team, a Small 700 ink line under the field says "No undrafted team matches “xyz”."
- **Undo last pick** confirms in place (see Buttons): "Undo pick 23 (Jules, Illinois)?", Undo it, then Keep with focus.
- **Following along:** while the draft runs the board refetches picks every 8 seconds, paused while a pick is pending or the undo question is open so the commissioner's screen never shifts under them.
- **Reset draft** lives on Admin, not here; the Draft tab keeps only Undo last pick and Set draft order.

### Draft Recap
After the draft the Draft tab shows the recap under "Draft complete" and the last pick; once any drafted team has a result the head becomes "The 2026 draft" with "64 picks · 16 teams still alive" in Deck, and Undo last pick leaves (the draft is history by then). Below it: a two-way switch, The board · The ledger. It opens on the board through the Round of 32 and on the ledger from the Sweet 16; the choice is not remembered, only deep-linked (`?view=board|ledger`).
- **Board:** the snake as it happened, 8 rounds by 8 drafters (player heads with running totals on a 3px ink rule, round labels with a muted chevron for snake direction). Each cell: pick number and seed in Label soft ink, the team in Name-S, alive or "out R32" and points (800) beneath; out cells strike only the team name and fade the points. Above the board only, a Steal and a Bust line (between a 1px ink rule and a 2px one) name the pick and give its points against its draft round's average; on the board those two cells take a 2px ink outline and their tag ("Steal", "Bust") in ink 700 in place of the seed. Phones get the round stepper ("Round 3") over a per-round ruled list (pick, team with seed and a 1px ink-framed tag, drafter, points). A muted key closes it.
- **Ledger:** Steals (top 5) and Busts (bottom 5) by points against the draft round's average, side by side under Name heads on 3px rules with a muted note; each row a team (struck name when out) over a soft-ink meta line, points in Name 800, signed value in Small 700. Then Draft value by player: player, points, best and worst pick, summed value. The key lists the round averages and links to the board.

### History
A sortable ruled table of seasons in Name type (year, champion at 800 on the 3px ink underline rule, on the yellow band only when the champion is the reader, the low finisher in the same face at 500 muted, points). Column heads read Year, Winner, Pts, Low, Pts, each with its sort mark after the label. An archived season expands to its top three rosters with a cancel-style "Show all N rosters" button; seasons from before the site are static rows with no chevron and no hover. Each row carries a full spoken summary ("2024: Dana won with 42; low Pete with 9. Show rosters") rather than leaning on its grid columns.

### Bracket Game
164px wide, two 34px team slots between 1px ink rules, split by a hairline. Winner name steps up to 800 weight; loser slot faded and struck. A live game takes a doubled red top rule and a red LIVE badge; an upcoming game's badge carries its tip time in muted on newsprint. A game with an NCAA.com page is a real link (new tab), hovers to deep newsprint and takes a 3px ink focus outline. Under Full bracket's Showing select, that player's teams still alive (or not yet decided) band yellow with their owner in ink 700; their eliminated teams and every other slot fade to faded ink, names and scores dropping to 500.

### Box Score (Games)
One game set like the paper's box score, stacked in the Live, Up next and Final columns (each under a Name-size 800 head on a 3px ink rule). A 2px ink top rule (3px press red when live) and a 1px ink bottom rule; a head line in Label caps soft ink with the region (or round) and tip time, and "Final" at right once decided (the Live column head already says live, so a live box carries no tag). Two team rows split by hairlines: seed in Small muted, name in Name-S caps with the owner beneath in Small soft-ink sentence case ("Elliott · you" for the reader), score in Title 800 at right. Winner steps to 800; loser faded and struck (owner line not struck). The reader's own team row bands highlighter yellow. An unfinished game closes with a stake line in Small soft ink, 72ch max: "Win is worth +7 to Elliott or +5 to Grapes", or "Dana banks +5 either way" when one player owns both sides. Empty columns say so in Small muted: "Nothing on right now.", "N games waiting on earlier results." / "No games left to play."; a Final column with no results is left out rather than shown empty. Without it, wide screens give Live a third and Up next two thirds, its box scores flowing in two columns, so one live game beside seven upcoming ones doesn't leave half the page bare.

### Your Games (Games)
A section among the columns with a visible head like theirs ("Your games" in Name 800 on a 3px ink rule, the reader's name after it in Small muted sentence case): full width above Live, Up next and Final on desktop, second after Live below 1024px. It lists only the reader's games not already in the shown round's columns (those are banded in place). Each such team shows only its current game as a road stop: team name in Nav caps 800, then round and tip time (or LIVE tag), "vs Opponent" (with the live score), and "+N if they win". It is never banded; desktop runs an auto-fill grid of cells, phones a single hairline-ruled list with the opponent's owner dropped.

### Road (My path)
A Path for select (defaults to the reader) with the player's totals at right ("20 pts · max 85", Small 700 soft ink). Each surviving team gets a Title head with a muted Small note ("1 seed · +4 so far") over its road: one stop per remaining round between a 1px ink rule above and a 2px ink rule below, divided by hairlines. A stop carries the round in Label caps (with tip time or a LIVE tag), "vs Opponent" in Name-S caps (two possible opponents joined by " / "; a wider field as "Midwest winner" or "Other half"), the opponents' owners or "N left · top seed X (Owner)" in Small soft ink ("also Dana's · banks a win either way" when the player owns both sides), and the points in Small 700 ("+5 if they win" on the current stop, "+7" beyond). The current stop bands highlighter yellow; later stops stay plain. Four stops across on desktop, a list on phones. An ink block line announces a team that "won it all"; then an Out list of eliminated teams as struck roster lines with the round they fell in, and a muted scoring note.

### Modal
Newsprint panel, max 440px, 22px padding, 6px ink top rule, square, over a 60% ink scrim.

## Do's and Don'ts

### Do:
- **Do** separate rows with 1px hairline rules and close heads with a 3px ink rule.
- **Do** set names, heads and scores in Barlow Condensed uppercase; set tabular content in Roboto Condensed with tabular numerals.
- **Do** reserve the highlighter yellow for "look here": the leader(s), the on-the-clock drafter, the pending (unconfirmed) pick, the reader's own History titles, a shown player's surviving bracket slots, the reader's own team in a box score, the current stop of a road, and text selection.
- **Do** say winning, alive, current and hovered in ink: heavier weight, ink fill, deep-newsprint hover, ink rule.
- **Do** show eliminated or used items faded and struck through, in place.
- **Do** keep red for live state, the masthead rule, and errors or destructive actions.
- **Do** keep functional text at Label (0.72rem) or larger, take every size from an `--fs-*` role token, and keep prose to 72ch.
- **Do** keep every corner square.
- **Do** give phone controls a 44px minimum target.
- **Do** confirm destructive or committing actions in place (two-step pick, Undo last pick, Reset draft, Archive season, Deactivate) rather than in a modal, naming what goes or what follows; for destructive ones the safe choice lands where the trigger was and takes focus, and the danger button waits 400ms before it listens.
- **Do** say a failed load one way: "Couldn't load X." or "Couldn't refresh X. Showing what loaded last.", Try again in the banner, technical detail only in the tooltip; never let one failed feed hide another tab's content.
- **Do** take round names from the one vocabulary (long, short, tiny) and tip times from the one format.
- **Do** make tab content headings h2 under the masthead's h1.

### Don't:
- **Don't** wrap content in cards, pills or rounded containers; bound it with rules.
- **Don't** add cast or glow shadows; depth is rule weight.
- **Don't** introduce a third accent hue or a dark navy-and-gold dashboard palette.
- **Don't** use yellow for hover, drag-over, search matches, winners, alive status, the current drafter's pill, active segments or chips, a recap steal or bust, or a strip where every row would carry it; don't use red for navigation state (the Standings live marker reports live play, not selection).
- **Don't** remove eliminated teams or past picks from view.
- **Don't** use icon fonts or glyph icons; use small 2px square-capped SVG strokes.
- **Don't** call for a font weight that is not loaded (Barlow 600, Roboto 500) or load fonts from a CDN.
