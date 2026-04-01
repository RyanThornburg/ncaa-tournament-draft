import { Hono } from "hono";
import { calculateUpsetPoints } from "../../config";
import { PickRow, WinRow } from "../../types";

const history = new Hono<{ Bindings: Env }>();

// GET /history - list all previous seasons
history.get("/", async (c) => {
    const { results: seasons } = await c.env.DB.prepare(
        "SELECT * FROM seasons ORDER BY year DESC"
    ).all();
    return c.json({ seasons });
});

// GET /history/:year - results from live tables
history.get("/:year", async (c) => {
    const year = parseInt(c.req.param("year"));

    const season = await c.env.DB.prepare(
        "SELECT * FROM seasons WHERE year = ?"
    ).bind(year).first();

    if (!season) return c.json({ error: "No data found" }, 404);

    const db = c.env.DB;

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

    const winMapRaw = new Map<string, { round: number; loser_seed: number }[]>();
    for (const row of winRows) {
        if (!winMapRaw.has(row.winner_team_id)) winMapRaw.set(row.winner_team_id, []);
        winMapRaw.get(row.winner_team_id)!.push({ round: row.round, loser_seed: row.loser_seed });
    }

    const userMap = new Map<string, { user_name: string; total_points: number; picks: { team_name: string; seed: number; pick_order: number; points: number; eliminated: 0 | 1 }[] }>();

    for (const row of pickRows) {
        if (!userMap.has(row.user_id)) {
            userMap.set(row.user_id, { user_name: row.user_name, total_points: 0, picks: [] });
        }
        const user = userMap.get(row.user_id)!;
        const wins = winMapRaw.get(row.team_id) ?? [];
        const points = wins.reduce((sum, w) => sum + calculateUpsetPoints(row.seed, w.loser_seed, w.round), 0);
        user.total_points += points;
        user.picks.push({ team_name: row.team_name, seed: row.seed, pick_order: row.pick_order, points, eliminated: row.eliminated });
    }

    const scores = Array.from(userMap.entries())
        .sort(([, a], [, b]) => b.total_points - a.total_points)
        .map(([user_id, data], i) => ({ rank: i + 1, user_id, ...data }));

    return c.json({ season, scores });
});

export default history;
