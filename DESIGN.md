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
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2.6rem, 9vw, 4.25rem)"
    fontWeight: 800
    lineHeight: 0.88
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2rem, 6vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 0.95
  section:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 800
    lineHeight: 1.05
  name:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 700
    lineHeight: 1.05
  nav:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "0.98rem"
    fontWeight: 700
    letterSpacing: "0.02em"
  body:
    fontFamily: "Roboto Condensed, Arial Narrow, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.35
    fontFeature: "tnum"
  score-phone:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 800
  small:
    fontFamily: "Roboto Condensed, Arial Narrow, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.4
  micro:
    fontFamily: "Roboto Condensed, Arial Narrow, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 400
  label:
    fontFamily: "Roboto Condensed, Arial Narrow, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 700
    letterSpacing: "0.08em"
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
components:
  button-confirm:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
    typography: "{typography.label}"
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
  who-name-hover:
    backgroundColor: "{colors.paper-deep}"
  updated-stamp:
    textColor: "{colors.muted}"
    typography: "{typography.small}"
  draft-pill-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "2px 6px"
  team-row-hover:
    backgroundColor: "{colors.paper-deep}"
  leader-row:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.ink}"
  bracket-slot-highlighted:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.ink}"
---

# Design System: TheeeeOPlex

## Overview

**Creative North Star: "The Late Edition"**

The pool is printed, not rendered. Every surface reads as a page of the sports section after the night's games: newsprint gray ground, a black masthead closed by a heavy red rule, condensed all-caps heads, and dense agate tables of names, seeds and points. Structure comes from rules (horizontal lines of graded weight), never from boxes. Information is set like a box score: tabular numerals, right-aligned points, tight rows.

Density is high and deliberate. Rows are ruled, not carded; groups are announced by a condensed head sitting on a 3px black rule. Two inks beyond black do all the signalling: a highlighter yellow that means only "look here" (the leader, whoever is on the clock, the champion, the player you asked to follow), and a press red reserved for live action, the masthead rule, and destructive or error states. Everything else (winners, alive teams, the current pick, hovers, active tabs) is said in ink: weight, fill, rule. Eliminated teams stay on the page, struck through and faded, because the record is the point.

The world rejects the dark navy-and-gold sports dashboard: no cards, no pills, no glows, no rounded corners, no cast shadows.

**Key Characteristics:**
- Newsprint ground, black ink, gray hairlines, heavy black rules under every head.
- Barlow Condensed caps for heads, names and big numerals; Roboto Condensed agate for everything tabular.
- One highlighter (yellow, "look here") and one press red (live, frame, danger); nothing else carries hue.
- Square corners everywhere; depth is only rule weight and the highlighter band.
- The reader is known: a one-time "Who are you?" strip, then a You tag and their roster opened by default.
- Losers struck through, never removed.

## Colors

A monochrome newsprint page marked by one highlighter and one press red.

### Primary
- **Press Red** (live-red): means live, the frame, or danger. The LIVE tag (in the live line, beside a standings name with a team playing, and in a roster row's out column), the live bracket game's doubled top rule and badge, the 6px masthead rule, error banners, the danger button, and the text caret. Never a background fill for anything except the LIVE tag, the live bracket badge and the danger hover. Not a selection or navigation color.

### Secondary
- **Highlighter Yellow** (highlight): means "look here", nothing else. Exactly five uses: the leader row (every tied leader; no band while the top score is 0), the on-the-clock drafter's name, the Historical champion's name, the team slots of the player chosen in the bracket's Highlight select, and text selection. Struck text sitting on it steps up to soft ink to hold contrast.

### Neutral
- **Newsprint** (paper): page ground, modal ground, and text on ink.
- **Deep Newsprint** (paper-deep): the hover fill for pickable team rows, clickable bracket games, the cancel button and the who-are-you name buttons.
- **Field Paper** (field-paper): the one lighter surface, used only inside text inputs.
- **Ink** (ink): body text, heavy rules, masthead ground, the confirm button, focus outlines, the champion banner, the active tab underline, the current draft pill fill, the You tag, and the 3px drag insertion rule.
- **Soft Ink** (ink-soft): secondary text (roster lines, nav at rest, owner names), confirm-button hover.
- **Muted** (muted): column labels, seeds, meta lines, chevrons.
- **Faded** (faded): eliminated and drafted items, placeholders, dimmed bracket games. Always paired with a strike-through when it means "out".
- **Hairline** (rule): 1px row dividers, dotted roster dividers, empty-game borders, the "/" between live games, scrollbar thumb.
- **Masthead Gray** (masthead-gray): small tracked text on the ink masthead and champion banner.
- **White** (white): text on red fills only.

### Named Rules
**The Two Inks Rule.** Yellow means "look here"; red means "live, the frame, or danger". Winning, alive, current, hovered and active are said in ink (weight, fill, rule), never in yellow or red. No third hue enters the page.

**The Struck, Not Gone Rule.** Out means faded plus line-through, in place. Never hide or remove an eliminated team, drafted team, or past pick.

## Typography

**Display Font:** Barlow Condensed (with Arial Narrow, sans-serif), weights 500 to 800
**Body Font:** Roboto Condensed (with Arial Narrow, sans-serif), weights 400 to 700

**Character:** A tall, tight headline condensed for masthead, heads, names and scores, over a narrow agate for the tables, exactly as a sports page pairs its headline face with its box-score type. Tabular numerals are on globally.

### Hierarchy
- **Display** (800, clamp(2.6rem, 9vw, 4.25rem), 0.88, uppercase): the masthead title only.
- **Headline** (800, clamp(2rem, 6vw, 3.25rem), 0.95, uppercase): the Draft Board "on the clock" line.
- **Section** (800, 1.75rem, 1, uppercase): section heads (Standings, Admin bar), leaderboard points; modal and draft-complete heads run 1.8 to 2rem in the same voice.
- **Title** (800, 1.35rem, uppercase): region heads, roster names and totals, bracket region labels.
- **Name** (700, 1.4rem, 1.05, uppercase): player names in standings; team names in the bracket drop to 0.92rem in the same face.
- **Nav** (700, 0.98rem, 0.02em, uppercase): primary tabs and bracket region tabs.
- **Body** (400, 15px, 1.35, tabular numerals): agate default for rows, rosters, meta.
- **Score, phone** (800, 1.2rem): bracket scores in the phone region view.
- **Small** (400, 0.8rem, 1.4): meta lines, the Updated stamp, the scoring key, roster seeds, admin meta, inline team lists in standings.
- **Micro** (400 to 700, 0.72rem): bracket seeds, owners and round labels; roster out-round labels.
- **Label** (700, 0.7rem, 0.08em to 0.06em, uppercase): column heads and toolbar labels in muted; LIVE and You tags in their fills; bracket TBD.

### Named Rules
**The Headline Face Rule.** Anything a reader scans for (names, scores, heads) is Barlow Condensed caps. Anything a reader reads across (rosters, meta, seeds) is Roboto Condensed agate.

**The Agate Floor Rule.** Functional text never sets below 11px (0.7rem at the 16px root). Micro and Label are the floor, not a step toward smaller.

**The Numerals Rule.** Points are the largest thing in their row, right-aligned, set in the headline face at 800.

## Layout

A single column page, max 1440px, with 20px gutters (16px at 760px and below). Content blocks set their own measure: standings 920px, history 720px, admin 680px. Rows are CSS grids with fixed numeric columns and a flexible name column (standings: rank, name, alive, points). Rhythm is tight: rows pad 6 to 10px vertically, groups open 18px above a head, grids gap 24px.

Breakpoints: 600px (bracket switches to a region-tabbed, round-stepped two-column view), 640px (draft regions go to two columns), 760/761px (standings collapse team lists into tap-to-expand rosters), 1100px (draft regions go to four columns). The desktop bracket is a fixed 170px-column grid with computed offsets so games align to their feeders; it scrolls horizontally rather than reflowing.

## Elevation & Depth

Flat. There are no cast shadows. Depth and grouping come from rule weight and the highlighter band: a 1px hairline separates rows, a 1px ink line closes table headers, a 2px ink line closes an expanded or leading row, a 3px ink line sits under every head, and 6px rules (red under the masthead, ink atop the modal) mark the page's top-level frames. The only overlay is the modal scrim (ink at 60%).

### Shadow Vocabulary
- **Live rule thickener** (`box-shadow: inset 0 2px 0 var(--red)`): doubles the top rule of a live bracket game.
- **Insertion rule** (`box-shadow: inset 0 3px 0 var(--ink)`): marks the drop point while dragging in the draft-order editor.

Both read as rules, not shadows; they are the only box-shadows in the system.

### Named Rules
**The Rule Weight Rule.** Hierarchy is drawn in line weight: 1px divides, 2px closes, 3px heads, 6px frames.

## Shapes

Square everywhere (0px radius on buttons, inputs, selects, modals, tags). No containers with four borders except inline team buttons, who-are-you name buttons, round-step buttons and inputs; everything else is bounded above and below by rules only. Icons are small SVG strokes at 2px with square caps, drawn to match the rules; the select caret is two CSS gradient triangles.

## Components

### Buttons
Blunt, uppercase, square.
- **Shape:** square corners (0px), 2px border.
- **Confirm:** ink fill, newsprint text, agate 700 0.85rem uppercase at 0.04em tracking, 8px 16px padding. Hover lifts to soft ink.
- **Cancel:** transparent with 2px ink border; hover fills deep newsprint.
- **Danger:** transparent with 2px red border and red text; hover fills red with white text.
- **Disabled:** 50% opacity, not-allowed cursor.
- **Focus:** global 2px ink outline, 2px offset.
- **Transitions:** background and color over 0.12s.

### Inputs / Fields
- **Style:** 1px ink border, field-paper fill, square, 8px 10px padding, agate 400 0.92rem.
- **Focus:** 2px ink outline flush (0 offset).
- **Static/read-only:** transparent fill, hairline border, muted text.
- **Select (bracket highlight):** borderless except a 2px ink underline, headline face caps, gradient-triangle caret.

### Navigation
- **Masthead:** ink band, display title, tracked masthead-gray subhead split left/right, closed by a 6px red rule.
- **Tabs:** headline face 700 caps in soft ink, 22px apart (18px on phones), horizontally scrollable without a scrollbar, sitting on a 2px ink rule. Active tab turns ink with a 4px ink underline; hover turns ink. The phone bracket's region tabs repeat this pattern; its round stepper uses 1px ink boxes with the active one filled ink.

### Who Are You? Strip
A one-time identity question shown on Standings and Bracket until answered: a 2px ink rule above, 1px below, "Who are you?" in the title voice, then each player as a square 1px ink-bordered name button (headline 700 1.05rem caps, 36px min height, deep-newsprint hover) and a "Just looking" underlined text link. The answer is remembered on the device (localStorage); a "Not you? Change" link in the scoring key reopens it. The chosen name follows the reader: You tag in standings, own roster opened, own team in the live line set heavier, own teams highlighted in the bracket by default.

### Tags
- **LIVE:** press-red fill, white Label type (0.7rem, 700, 0.06em, caps), 2px 6px. Appears in the live line, after a standings name with a team in play, and in a roster row's out column.
- **You:** the inverse of ink: ink fill, newsprint Label type, 2px 5px, after the reader's own name.

### Updated Stamp
"Updated n min ago" in Small muted agate, right-aligned on the section head's 3px rule (the head and stamp share one rule). Ticks every 30 seconds; renders nothing until data has loaded.

### Standings Table (signature)
Grid rows of rank, condensed-caps name, alive x/8 and big right-aligned points, divided by hairlines. Tied ranks read T2, T6. Every row whose score equals a positive top score is banded highlighter yellow and closed by a 2px ink rule; nobody is banded at 0. On phones a row is a button: a chevron follows the name and tapping opens a roster beneath it, indented and closed by a 2px ink rule. A scoring key line in Small muted agate closes the table.

### Roster Line
Seed (Small), team, out column, points (+n) on a dotted hairline. Alive teams are plain ink; out teams are faded and struck through with the round they fell in (Micro caps); a team playing now shows a LIVE tag in the out column.

### Live Line
A red LIVE tag followed by in-progress scores in agate caps, each team followed by its owner in parentheses (500, sentence case, soft ink; the reader's own owner name in 700 ink), separated by hairline-gray slashes. Renders nothing when nothing is live.

### Draft Order
Drafters in a wrapped agate line; done drafters faded and struck, the current drafter an ink-filled pill with newsprint text. The on-the-clock name in the headline is the yellow band.

### Bracket Game
164px wide, two 34px team slots between 1px ink rules, split by a hairline. Winner name steps up to 800 weight; loser slot faded and struck. A live game takes a doubled red top rule and a red LIVE badge; an upcoming game's badge carries its tip time in muted on newsprint. Clickable games hover to deep newsprint. Under the player Highlight select, that player's team slots band yellow with their owner in ink 700, and every other slot fades to 500 weight.

### Modal
Newsprint panel, max 440px, 22px padding, 6px ink top rule, square, over a 60% ink scrim.

## Do's and Don'ts

### Do:
- **Do** separate rows with 1px hairline rules and close heads with a 3px ink rule.
- **Do** set names, heads and scores in Barlow Condensed uppercase; set tabular content in Roboto Condensed with tabular numerals.
- **Do** reserve the highlighter yellow for "look here": the leader(s), the on-the-clock drafter, the Historical champion, a highlighted player's bracket slots, and text selection.
- **Do** say winning, alive, current and hovered in ink: heavier weight, ink fill, deep-newsprint hover, ink rule.
- **Do** show eliminated or used items faded and struck through, in place.
- **Do** keep red for live state, the masthead rule, and errors or destructive actions.
- **Do** keep functional text at 11px (0.7rem) or larger.
- **Do** keep every corner square.

### Don't:
- **Don't** wrap content in cards, pills or rounded containers; bound it with rules.
- **Don't** add cast or glow shadows; depth is rule weight.
- **Don't** introduce a third accent hue or a dark navy-and-gold dashboard palette.
- **Don't** use yellow for hover, drag-over, winners, alive status or the current pick; don't use red for navigation state.
- **Don't** remove eliminated teams or past picks from view.
- **Don't** use icon fonts or glyph icons; use small 2px square-capped SVG strokes.
