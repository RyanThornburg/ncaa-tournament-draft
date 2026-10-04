---
name: TheeeeOPlex
description: An eight-friend NCAA draft pool, printed as the sports section's late edition.
colors:
  paper: "#e9e8e3"
  field-paper: "#f6f5f1"
  ink: "#111111"
  ink-soft: "#3a3936"
  muted: "#55534e"
  faded: "#66645e"
  rule: "#b9b7b0"
  masthead-gray: "#bdbbb4"
  highlight: "#f2dfa0"
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
    backgroundColor: "{colors.highlight}"
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
  leader-row:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.ink}"
---

# Design System: TheeeeOPlex

## Overview

**Creative North Star: "The Late Edition"**

The pool is printed, not rendered. Every surface reads as a page of the sports section after the night's games: newsprint gray ground, a black masthead closed by a heavy red rule, condensed all-caps heads, and dense agate tables of names, seeds and points. Structure comes from rules (horizontal lines of graded weight), never from boxes. Information is set like a box score: tabular numerals, right-aligned points, tight rows.

Density is high and deliberate. Rows are ruled, not carded; groups are announced by a condensed head sitting on a 3px black rule. Two inks beyond black do all the signalling: a highlighter yellow that marks what is winning or alive (and what your pointer is on), and a press red reserved for live action, the masthead rule, the active nav underline, and destructive or error states. Eliminated teams stay on the page, struck through and faded, because the record is the point.

The world rejects the dark navy-and-gold sports dashboard: no cards, no pills, no glows, no rounded corners, no cast shadows.

**Key Characteristics:**
- Newsprint ground, black ink, gray hairlines, heavy black rules under every head.
- Barlow Condensed caps for heads, names and big numerals; Roboto Condensed agate for everything tabular.
- One highlighter (yellow) and one press red; nothing else carries hue.
- Square corners everywhere; depth is only rule weight and the highlighter band.
- Losers struck through, never removed.

## Colors

A monochrome newsprint page marked by one highlighter and one press red.

### Primary
- **Press Red** (live-red): the LIVE tag, the live game's top rule, the 6px masthead rule, the active tab underline, error banners, the danger button, and the text caret. Never a background fill for anything except the LIVE tag, the live bracket badge and the danger hover.

### Secondary
- **Highlighter Yellow** (highlight): bands the leader row, the bracket winner slot, the current drafter, the Historical winner name, and an under-marker (55% gradient) on alive roster teams. Also the hover/drag-over fill on pickable rows and the cancel button, and the text-selection color.

### Neutral
- **Newsprint** (paper): page ground, modal ground, and text on ink.
- **Field Paper** (field-paper): the one lighter surface, used only inside text inputs.
- **Ink** (ink): body text, heavy rules, masthead ground, the confirm button, focus outlines, the champion banner.
- **Soft Ink** (ink-soft): secondary text (roster lines, nav at rest, owner names), confirm-button hover.
- **Muted** (muted): column labels, seeds, meta lines, chevrons.
- **Faded** (faded): eliminated and drafted items, placeholders, dimmed bracket games. Always paired with a strike-through when it means "out".
- **Hairline** (rule): 1px row dividers, dotted roster dividers, empty-game borders, the "/" between live games, scrollbar thumb.
- **Masthead Gray** (masthead-gray): small tracked text on the ink masthead and champion banner.
- **White** (white): text on red fills only.

### Named Rules
**The Two Inks Rule.** Yellow means "winning, alive, or under your hand"; red means "live, active, or destructive". No third hue enters the page.

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
- **Label** (700, 0.7rem, 0.08em, uppercase, muted): column heads, toolbar labels, round labels.

### Named Rules
**The Headline Face Rule.** Anything a reader scans for (names, scores, heads) is Barlow Condensed caps. Anything a reader reads across (rosters, meta, seeds) is Roboto Condensed agate.

**The Numerals Rule.** Points are the largest thing in their row, right-aligned, set in the headline face at 800.

## Layout

A single column page, max 1440px, with 20px gutters (16px at 760px and below). Content blocks set their own measure: standings 920px, history 720px, admin 680px. Rows are CSS grids with fixed numeric columns and a flexible name column (standings: rank, name, alive, points). Rhythm is tight: rows pad 6 to 10px vertically, groups open 18px above a head, grids gap 24px.

Breakpoints: 600px (bracket switches to a region-tabbed, round-stepped two-column view), 640px (draft regions go to two columns), 760/761px (standings collapse team lists into tap-to-expand rosters), 1100px (draft regions go to four columns). The desktop bracket is a fixed 170px-column grid with computed offsets so games align to their feeders; it scrolls horizontally rather than reflowing.

## Elevation & Depth

Flat. There are no cast shadows. Depth and grouping come from rule weight and the highlighter band: a 1px hairline separates rows, a 1px ink line closes table headers, a 2px ink line closes an expanded or leading row, a 3px ink line sits under every head, and 6px rules (red under the masthead, ink atop the modal) mark the page's top-level frames. The only overlay is the modal scrim (ink at 60%).

### Shadow Vocabulary
- **Live rule thickener** (`box-shadow: inset 0 2px 0 var(--red)`): doubles the top rule of a live bracket game. It reads as a heavier rule, not a shadow; it is the only box-shadow in the system.

### Named Rules
**The Rule Weight Rule.** Hierarchy is drawn in line weight: 1px divides, 2px closes, 3px heads, 6px frames.

## Shapes

Square everywhere (0px radius on buttons, inputs, selects, modals, tags). No containers with four borders except inline team buttons, round-step buttons, the bracket highlight outline and inputs; everything else is bounded above and below by rules only. Icons are small SVG strokes at 2px with square caps, drawn to match the rules; the select caret is two CSS gradient triangles.

## Components

### Buttons
Blunt, uppercase, square.
- **Shape:** square corners (0px), 2px border.
- **Confirm:** ink fill, newsprint text, agate 700 0.85rem uppercase at 0.04em tracking, 8px 16px padding. Hover lifts to soft ink.
- **Cancel:** transparent with 2px ink border; hover fills highlighter yellow.
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
- **Tabs:** headline face 700 caps in soft ink, 22px apart (18px on phones), horizontally scrollable without a scrollbar, sitting on a 2px ink rule. Active tab turns ink with a 4px red underline; hover turns ink. The phone bracket's region tabs repeat this exactly; its round stepper uses 1px ink boxes with the active one filled ink.

### Standings Table (signature)
Grid rows of rank, condensed-caps name, alive x/8 and big right-aligned points, divided by hairlines. The leader row is banded highlighter yellow and closed by a 2px ink rule. On phones a row is a button: a chevron follows the name and tapping opens a roster beneath it, indented and closed by a 2px ink rule.

### Roster Line
Seed, team, out-round, points (+n) on a dotted hairline. Alive teams carry a yellow under-marker on the name; out teams are faded and struck through with the round they fell in.

### Live Line
A red LIVE tag followed by in-progress scores in agate caps, separated by hairline-gray slashes. Renders nothing when nothing is live.

### Bracket Game
164px wide, two 34px team slots between 1px ink rules, split by a hairline. Winner slot bands yellow; loser slot faded and struck. A live game takes a doubled red top rule and a red LIVE badge. Under the player highlight filter, matching games get a 2px ink outline and non-matching games fade.

### Modal
Newsprint panel, max 440px, 22px padding, 6px ink top rule, square, over a 60% ink scrim.

## Do's and Don'ts

### Do:
- **Do** separate rows with 1px hairline rules and close heads with a 3px ink rule.
- **Do** set names, heads and scores in Barlow Condensed uppercase; set tabular content in Roboto Condensed with tabular numerals.
- **Do** mark winners, the leader and alive teams with the highlighter yellow, as a band or a 55% under-marker.
- **Do** show eliminated or used items faded and struck through, in place.
- **Do** keep red for live state, the masthead rule, the active tab underline, and errors or destructive actions.
- **Do** keep every corner square.

### Don't:
- **Don't** wrap content in cards, pills or rounded containers; bound it with rules.
- **Don't** add cast or glow shadows; depth is rule weight.
- **Don't** introduce a third accent hue or a dark navy-and-gold dashboard palette.
- **Don't** remove eliminated teams or past picks from view.
- **Don't** use icon fonts or glyph icons; use small 2px square-capped SVG strokes.
