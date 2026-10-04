---
version: 1
slug: "src-frontend-app-tsx"
primary_target: "src/frontend/App.tsx"
related_targets: ["src/frontend/index.css"]
---

# Surface: whole app (Leaderboard, Bracket, Draft Board, Historical, Admin)

Mode: Operate. Primary use: phones during games (leaderboard, bracket). Draft Board is a one-hour, screen-shared event; secondary.

## Direction contract

THESIS: The pool is printed as the sports section's late edition: newsprint, black masthead with a red rule, condensed headlines, agate tables. Refuses the dark navy-and-gold "sports dashboard" of cards, pills and glows.

OWN-WORLD: Newsprint gray ground (#e9e8e3), black ink (#111), hairline rules (#b9b7b0), heavy 2–3px black rules under heads. One highlighter yellow (#f2dfa0) marks leader, bracket winners and alive teams; red (#c8202f) is reserved for LIVE and the masthead rule. Barlow Condensed for heads and big numerals, Roboto Condensed for agate. Square corners, no cards, no shadows; losers struck through, never removed.

STORY: A friend opens the link from the group chat, sees rank, points and teams alive in one look, taps a name to see their roster, flips to the bracket to see who owns which team and what's live.

FIRST VIEWPORT: Phone: black masthead (TheeeeOPlex, "The Ledgesheet is dead", round + day), underlined section nav, live line, STANDINGS head over a ruled table: rank, player in condensed caps, alive x/8, points at ~26px right-aligned; leader row banded yellow. Tap a row to open the roster beneath it.

FORM: Late Edition (restrained Sports Section variant), chosen after a safer-register re-roll and the user's steer; seed key 5246e5c2. Reference mock: .impeccable/mocks/decision/i-late-edition.png.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
