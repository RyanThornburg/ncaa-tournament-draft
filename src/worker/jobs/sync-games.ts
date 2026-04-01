import { getGameQueryUrl, SEASON_YEAR } from '../../config'
import type { NcaaApiResponse } from '../../types'

// Map bracket position to round based on how NCAA lists
function getRound(bracketPositionId: number): number | null {
    if (bracketPositionId < 200) return 1;    // First Four
    if (bracketPositionId < 300) return 2;    // Round of 64
    if (bracketPositionId < 400) return 3;    // Round of 32
    if (bracketPositionId < 500) return 4;    // Sweet 16
    if (bracketPositionId < 600) return 5;    // Elite 8
    if (bracketPositionId < 700) return 6;    // Final Four
    return 7;                                 // Championship
}

async function SyncGameData(db: D1Database) {
    try {
        const response = await fetch(getGameQueryUrl(SEASON_YEAR))
        if (!response.ok) {
            console.log('Error fetching external data', response.status)
            return
        }

        const data = await response.json() as NcaaApiResponse;
        const championship = data.championships[0];
        const games = championship?.games ?? [];
        const seasonYear = championship?.year ?? SEASON_YEAR;

        const regionMap = Object.fromEntries(
            (championship?.regions ?? []).map(r => [r.sectionId, r.title.trim()])
        );

        // map ids to team names for this season
        const { results: teams } = await db.prepare('SELECT id, name FROM teams WHERE season_year = ?').bind(seasonYear).all<{ id: string; name: string }>();
        const teamIdMap = Object.fromEntries(teams.map(t => [t.name, t.id]));

        const statements: D1PreparedStatement[] = [];

        for (const game of games) {
            // team_1 = top slot (isTop), team_2 = bottom slot (!isTop)
            const team1 = game.teams.find(t => t.isTop) ?? game.teams.find(t => t.isHome) ?? null;
            const team2 = game.teams.find(t => !t.isTop) ?? game.teams.find(t => !t.isHome) ?? null;
            const winner = game.teams.find(t => t.isWinner) ?? null;
            statements.push(
                db.prepare(`
                    INSERT INTO games (
                        external_game_id, bracket_position_id, round, region,
                        team_1_id, team_2_id, winner_team_id,
                        team_1_score, team_2_score,
                        team_1_seed, team_2_seed,
                        game_time, game_status,
                        start_time, start_date, start_time_epoch,
                        data_source, season_year, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
                    ON CONFLICT(bracket_position_id, season_year) DO UPDATE SET
                        external_game_id = excluded.external_game_id,
                        team_1_id = excluded.team_1_id,
                        team_2_id = excluded.team_2_id,
                        winner_team_id = excluded.winner_team_id,
                        team_1_score = excluded.team_1_score,
                        team_2_score = excluded.team_2_score,
                        team_1_seed = excluded.team_1_seed,
                        team_2_seed = excluded.team_2_seed,
                        game_time = excluded.game_time,
                        game_status = excluded.game_status,
                        start_time = excluded.start_time,
                        start_date = excluded.start_date,
                        start_time_epoch = excluded.start_time_epoch,
                        data_source = excluded.data_source,
                        updated_at = datetime('now')`
                ).bind(
                    String(game.bracketPositionId),
                    String(game.bracketPositionId),
                    getRound(game.bracketPositionId),
                    regionMap[game.sectionId] ?? null,
                    team1 ? (teamIdMap[team1.nameShort] ?? null) : null,
                    team2 ? (teamIdMap[team2.nameShort] ?? null) : null,
                    winner ? (teamIdMap[winner.nameShort] ?? null) : null,
                    team1?.score ?? null,
                    team2?.score ?? null,
                    team1?.seed ?? null,
                    team2?.seed ?? null,
                    [game.currentPeriod, game.contestClock].filter(Boolean).join(" ") || null,
                    game.statusCodeDisplay,
                    game.startTime,
                    game.startDate,
                    game.startTimeEpoch,
                    "ncaa-api",
                    seasonYear,
                )
            );
        }

        // marking teams that are eliminated in one go 
        // vs saving so safe to run each time
        statements.push(
            db.prepare(`
                UPDATE picks
                SET
                    eliminated = 1,
                    eliminated_round = g.round
                FROM (
                    SELECT team_1_id AS loser_id, round FROM games
                        WHERE season_year = ? AND (game_status = 'final' or game_status = 'forfeit') AND winner_team_id = team_2_id AND winner_team_id IS NOT NULL
                    UNION ALL
                    SELECT team_2_id AS loser_id, round FROM games
                        WHERE season_year = ? AND (game_status = 'final' or game_status = 'forfeit') AND winner_team_id = team_1_id AND winner_team_id IS NOT NULL
                ) AS g
                WHERE picks.team_id = g.loser_id
                AND picks.season_year = ?
                AND picks.eliminated = 0
            `).bind(seasonYear, seasonYear, seasonYear)
        );

        await db.batch(statements);

    } catch (e) {
        console.log('Error syncing game data', e)
    }
}

export default SyncGameData;
