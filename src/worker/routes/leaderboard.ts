import { Hono } from "hono";
import { calculateUpsetPoints, SEASON_YEAR } from "../../config";
import { LeaderboardEntry, PickGameResult, PickRow, WinRow } from "../../types";

const leaderboard = new Hono<{ Bindings: Env }>();

leaderboard.get('/', async (c) => {
    const db = c.env.DB;
    const year = parseInt(c.req.query('year') ?? '') || SEASON_YEAR;

    const { results: pickRows } = await db.prepare(`
        SELECT
            u.id as user_id,
            u.user_name,
            t.id as team_id,
            t.name as team_name,
            t.seed,
            t.region,
            t.overall_rank,
            p.pick_order,
            p.autodraft,
            p.eliminated,
            p.eliminated_round
        FROM picks p
        JOIN users u ON p.user_id = u.id
        JOIN teams t ON p.team_id = t.id
        WHERE p.season_year = ?
        ORDER BY u.id, p.pick_order ASC
    `).bind(year).all<PickRow>();

    const { results: winRows } = await db.prepare(`
        SELECT
            g.id as game_id,
            g.winner_team_id,
            g.round,
            CASE WHEN g.winner_team_id = g.team_1_id THEN g.team_2_id ELSE g.team_1_id END as loser_team_id,
            CASE WHEN g.winner_team_id = g.team_1_id THEN t2.name ELSE t1.name END as loser_name,
            CASE WHEN g.winner_team_id = g.team_1_id THEN t2.seed ELSE t1.seed END as loser_seed,
            CASE WHEN g.winner_team_id = g.team_1_id THEN t1.seed ELSE t2.seed END as winner_seed
        FROM games g
        JOIN teams t1 ON t1.id = g.team_1_id
        JOIN teams t2 ON t2.id = g.team_2_id
        WHERE g.winner_team_id IS NOT NULL
        AND g.season_year = ?
    `).bind(year).all<WinRow>();

    // wins keyed by winning team_id - need to get seed before adding points
    const winMapRaw = new Map<string, Omit<PickGameResult, 'points'>[]>();
    for (const row of winRows) {
        if (!winMapRaw.has(row.winner_team_id)) winMapRaw.set(row.winner_team_id, []);
        winMapRaw.get(row.winner_team_id)!.push({
            game_id: row.game_id,
            round: row.round,
            opponent_team_id: row.loser_team_id,
            opponent_name: row.loser_name,
            opponent_seed: row.loser_seed,
            winner_seed: row.winner_seed,
            winner_team_id: row.winner_team_id
        });
    }

    const userMap = new Map<string, LeaderboardEntry>();

    for (const row of pickRows) {
        if (!userMap.has(row.user_id)) {
            userMap.set(row.user_id, {
                user_id: row.user_id,
                user_name: row.user_name,
                total_points: 0,
                teams_alive: 0,
                picks: [],
            });
        }

        const user = userMap.get(row.user_id)!;
        const rawWins = winMapRaw.get(row.team_id) ?? [];
        const games: PickGameResult[] = rawWins.map(w => (
            {
            ...w,
            points: calculateUpsetPoints(row.seed, w.opponent_seed, w.round),
        }));

        const pickPoints = games.reduce((sum, g) => sum + g.points, 0);
        user.total_points += pickPoints;
        user.teams_alive += row.eliminated === 0 ? 1 : 0;
        user.picks.push({
            team_id: row.team_id,
            team_name: row.team_name,
            seed: row.seed,
            region: row.region,
            pick_order: row.pick_order,
            points_earned: pickPoints,
            games,
            eliminated: row.eliminated,
            eliminated_round: row.eliminated_round,
        });
    }

    const result = Array.from(userMap.values())
        .sort((a, b) => b.total_points - a.total_points)
        .map((entry, i) => ({ rank: i + 1, ...entry }));

    return c.json(result);
});

export default leaderboard;
