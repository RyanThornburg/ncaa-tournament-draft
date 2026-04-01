# March Madness Contest

A friend-group NCAA tournament bracket contest. Players draft teams before the tournament, earn points for wins (with upset bonuses), and compete on a live leaderboard throughout March Madness.

Should be good using the free-tier in cloudflare.

**Stack:** React + Vite + Hono + Cloudflare Workers + D1 (SQLite)

**Game data:** [henrygd/ncaa-api](https://github.com/henrygd/ncaa-api)

## Features

- **Leaderboard** — live standings with points and rankings
- **Draft Board** — view team picks per player
- **Bracket** — full tournament bracket with game results
- **Historical** — past season results
- **Admin** — manage drafts, archive seasons, trigger score updates

## Development

```bash
npm install
npm run dev
```

App runs at [http://localhost:5173](http://localhost:5173).

Trigger the scheduled score update locally:

```bash
curl http://localhost:5173/cdn-cgi/handler/scheduled
```

## Production

```bash
npm run build && npm run deploy
```

Monitor workers:

```bash
npx wrangler tail
```

## Setup

### Prerequisites

```bash
npm install -g wrangler
npx wrangler login
```

### Create the D1 Database

Add `--remote` to target the remote (production) database. Omit it to run against the local database.

```bash
npx wrangler d1 create march-madness-db
```

## Backfill a Past Season

1. Set `SEASON_YEAR` in [src/config.ts](src/config.ts) to the target year
2. Seed team data:

    ```bash
    python3 team_data/seed_teams.py team_data/teams_XXXX.csv
    npx wrangler d1 execute march-madness-db --file=./team_data/teams_XXXX.sql [--remote]
    ```

3. Run the scheduler to pull game data:

    ```bash
    curl http://localhost:5173/cdn-cgi/handler/scheduled
    ```

4. Manually complete the draft
5. Run the scheduler again to update scores
6. Archive the season via admin (or curl):

    ```bash
    curl -X POST http://localhost:5173/archive \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer xxxx" \
      -d '{"year": 2024}'
    ```

### Push Local Data to Remote

After backfilling locally, export each table and push to the remote D1 instance. Set `$DB` to your local SQLite file path.

**Teams:**

```bash
npx wrangler d1 execute march-madness-db --file=./team_data/teams_XXXX.sql --remote
```

**Picks:**

```bash
sqlite3 $DB ".mode insert picks" \
  "SELECT null, user_id, team_id, autodraft, pick_order, eliminated, eliminated_round, season_year, created_at, updated_at FROM picks WHERE season_year=XXXX;" \
  > picks_XXXX.sql
npx wrangler d1 execute march-madness-db --file=./picks_XXXX.sql --remote
```

**Games:**

```bash
sqlite3 $DB ".mode insert games" \
  "SELECT null, round, region, bracket_position_id, team_1_id, team_2_id, team_1_seed, team_2_seed, winner_team_id, team_1_score, team_2_score, game_status, game_time, location, start_date, start_time, start_time_epoch, external_game_id, data_source, season_year, created_at, updated_at FROM games WHERE season_year=XXXX;" \
  > games_XXXX.sql
npx wrangler d1 execute march-madness-db --file=./games_XXXX.sql --remote
```

**Seasons:**

```bash
sqlite3 $DB ".mode insert seasons" \
  "SELECT * FROM seasons WHERE year=XXXX;" \
  > seasons_XXXX.sql
npx wrangler d1 execute march-madness-db --file=./seasons_XXXX.sql --remote
```

## TODO

- [ ] map draft team names to external team name source/add check/verify
- [ ] fix playins so it will auto update after the draft
- [ ] better way to backfill data
- [ ] build out admin with more functionality
- [ ] automate/fix the worker refreshing the scores so it's not a manual update every year
- [ ] tests
