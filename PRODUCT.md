# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Eight friends running a private NCAA men's tournament draft contest, year after year. One of them is the admin (the "commissioner") who runs the draft and maintains the site. Nobody else needs to be onboarded or persuaded; they already know the rules and each other.

## Product Purpose

Replace the old shared spreadsheet (the "Ledgesheet") with a site that runs the snake draft and keeps live standings through the tournament. Success: the group checks it instead of asking in the chat who's winning, and draft night runs without anyone squinting at a spreadsheet.

## Positioning

This is not a bracket-pick contest. Each player drafts whole teams (8 each, snake order, 64 teams total) and scores every win those teams earn, with an upset bonus of half the seed difference. Standings are about which of your teams are still alive and how many points they have banked, not about a filled-in bracket.

## Operating Context

- **Draft night:** happens on a voice/video call. The admin screen-shares the Draft Board and clicks each pick as players call it out. The screen is read by everyone over a compressed screen-share, often on laptops.
- **Tournament (mid-March to early April):** players check standings, their rosters, and the bracket mostly on phones, usually from a link in the group chat, during or right after games. Scores refresh from the NCAA API on a schedule; the leaderboard polls every 2 minutes.
- **Off-season:** the Historical tab holds past winners back to the spreadsheet years, including incomplete records reconstructed from old emails.

## Capabilities and Constraints

- Tabs: Leaderboard (default), Draft Board, Bracket (with "highlight player" filter), Historical, Admin (only visible to the admin via Cloudflare Access).
- Scoring: round points `[R64 1, R32 3, S16 5, E8 7, F4 9, Final 11]` plus upset bonus `(winner seed − loser seed) / 2`.
- Draft: snake order, 8 rounds, admin-only picking, undo last pick, reset draft, set draft order (random by default).
- Stack: React + Vite + Hono on Cloudflare Workers + D1; free tier. Game data from henrygd/ncaa-api.
- Terminology the group uses: "Ledgesheet", "alive"/"out" for teams, "pts".

## Brand Commitments

- Title "TheeeeOPlex" and subhead "The Ledgesheet is dead" (set in `src/config.ts`) are inside jokes and stay. The group wants the design to lean into them, not hide them.
- Browser title "Legge NCAA".

## Evidence on Hand

- Real season data 2016–2026 in `team_data/` and the archive tables; historical notes for 2017 and 2019 in `src/config.ts`.
- No logos, team marks, or photography. Do not invent player stats, quotes, or records.

## Product Principles

1. **Who's winning, at a glance, on a phone.** Rank, points, and teams alive must read in one look.
2. **Draft night is a broadcast.** The Draft Board has to read clearly over a screen-share: whose pick, what's left, what just went.
3. **It's ours.** Inside jokes and group history are features; this should feel made by the group, not generated for it.
4. **Accuracy over flourish.** Scores and eliminations are what people argue about; never let decoration obscure them.
