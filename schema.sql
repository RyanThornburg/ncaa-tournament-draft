-- March Madness Contest Schema
-- npx wrangler d1 execute march-madness-db --file=./schema.sql
--
-- Use CSV file to populate current year team rankings in teams/teams_20xx.csv and seed_teams.py to run
-- Example:
--   python3 seed_teams.py teams_2025.csv --output teams_2025.sql
--   npx wrangler d1 execute march-madness-db --file=./teams_2025.sql
--
-- README:
--   seasonal data should exist in picks, games
--   after the season is over, move results to historical data tables
--
-- TODO: no need for seasonal data, just store as is


-- TABLE DATA:

CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY, -- "2026-1-DUKE" -> {year}-{overall_rank}-{name}, should switch to actual id depending on data source
    name TEXT NOT NULL,
    seed INTEGER NOT NULL,
    region TEXT NOT NULL,
    overall_rank INTEGER NOT NULL, -- 1-64 ranking, lower is better, using for auto-draft
    season_year INTEGER NOT NULL -- tournament year, e.g. 2025
);

CREATE TABLE IF NOT EXISTS picks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users(id),
    team_id TEXT NOT NULL REFERENCES teams(id),
    autodraft INTEGER NOT NULL DEFAULT 0, -- did the user autodraft
    pick_order INTEGER NOT NULL,  -- overall draft pick order, 1-64
    eliminated INTEGER NOT NULL DEFAULT 0, -- 0 = alive, 1 = eliminated
    eliminated_round INTEGER,  -- round eliminated (0-5)
    season_year INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(team_id)  -- can only draft each team once
);

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4)))), -- 8-char hex e.g. "a3f2c901"
    user_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    email TEXT, -- not using at the moment but can be used for future features like notifications
    role TEXT NOT NULL DEFAULT 'user',
    active INTEGER NOT NULL DEFAULT 1, -- 1 for active, 0 for inactive
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS draft_order (
    pick_number INTEGER PRIMARY KEY, -- 1-8 (total number of users)
    user_id TEXT NOT NULL REFERENCES users(id),
    source TEXT, -- 'random' for random draw, 'manual' for admin-set
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- bracket position, known before tournament starts
    round INTEGER NOT NULL, -- 2=R64, 3=R32, 4=S16, 5=E8, 6=F4, 7=Final - from NCAA bracket position
    region TEXT, --EAST | WEST, FINAL, etc
    bracket_position_id INTEGER, -- 601  #6=round, 01=position ie: final 4 game 1
    -- teams (nullable for future rounds until teams are known)
    team_1_id TEXT REFERENCES teams(id),
    team_2_id TEXT REFERENCES teams(id),
    team_1_seed INTEGER,
    team_2_seed INTEGER,
    -- results (nullable until game is played)
    winner_team_id TEXT REFERENCES teams(id),
    team_1_score INTEGER,
    team_2_score INTEGER,
    -- venue/game details (optional, for future enhancement)
    game_status TEXT, -- FINAL, H1, H2, ETC
    game_time TEXT,
    location TEXT,
    start_date TEXT,
    start_time TEXT,
    start_time_epoch INTEGER,
    external_game_id TEXT, -- for integration with external data sources
    data_source TEXT DEFAULT 'manual', -- 'manual' or name of external data source
    season_year INTEGER NOT NULL,
    
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_games_bracket_position_year ON games(bracket_position_id, season_year);
CREATE INDEX IF NOT EXISTS idx_games_round ON games(round);

-- Historical tables:
CREATE TABLE IF NOT EXISTS seasons (
    year INTEGER PRIMARY KEY, -- tournament year, e.g. 2025
    archived_at TEXT DEFAULT (datetime('now')),
    notes TEXT -- for any additional info about the season
);
