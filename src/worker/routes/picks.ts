import { Hono } from "hono";
import authMiddleware from "../middleware";
import { SEASON_YEAR } from "../../config";

const picks = new Hono<{ Bindings: Env }>();

// GET /picks
picks.get("/", async (c)=>{
    const year = parseInt(c.req.query('year') ?? '') || SEASON_YEAR;
    const { results} = await c.env.DB.prepare(
        `SELECT p.user_id, u.user_name as user_name, u.display_name as display_name, p.team_id, p.pick_order,
                t.name as team_name, t.seed, t.region, t.overall_rank, p.autodraft
        FROM picks p
        JOIN users u on u.id = p.user_id
        JOIN teams t on t.id = p.team_id
        WHERE p.season_year = ?
        ORDER BY p.pick_order ASC
        `).bind(year).all();
        return c.json(results);
});


// POST - record a draft pick (auth required)
picks.post("/", authMiddleware, async (c) => {
    const body = await c.req.json<{
        user_id: string;
        team_id: string;
        pick_order: number;
        autodraft?: boolean;
    }>();


    if (!body.user_id || !body.team_id || body.pick_order === undefined) {
        return c.json({error: "Missing required fields"}, 400);
    }

    const user = await c.env.DB.prepare(
        "SELECT id, user_name, display_name from users WHERE id = ? and active =1"
    ).bind(body.user_id).first<{id: string; user_name: string; display_name: string;}>();

    if (!user) return c.json({error: "User missing or inactive"}, 404);

    try {
        await c.env.DB.prepare(
            "INSERT INTO picks (user_id, team_id, pick_order, autodraft, season_year) VALUES (?, ?, ?, ?, ?)"
        ).bind(
            body.user_id,
            body.team_id,
            body.pick_order,
            body.autodraft ?? 0,
            SEASON_YEAR).run();
        return c.json({ok: true});
    } catch {
        return c.json({ error: "Failed to record pick" }, 500); 
    }
});


// DELETE /picks/last - undo last pick (auth required)
picks.delete("/last", authMiddleware, async (c) => {
    // trying to be data safe/concurrency guard
    const body = await c.req.json<{ expected_pick_order: number }>();
    if (!body.expected_pick_order) {
        return c.json({ error: "expected_pick_order is required" }, 400);
    }
    const row = await c.env.DB.prepare(
        "SELECT pick_order FROM picks WHERE season_year = ? ORDER BY pick_order DESC LIMIT 1"
    ).bind(SEASON_YEAR).first<{ pick_order: number }>();

    if (!row) return c.json({ error: "No picks to undo" }, 404);
    if (row.pick_order !== body.expected_pick_order) {
        return c.json({
            error: "Pick order mismatch - draft state may have changed",
            current_pick_order: row.pick_order,
        }, 409);
    }

    await c.env.DB.prepare("DELETE FROM picks WHERE pick_order = ? AND season_year = ?").bind(row.pick_order, SEASON_YEAR).run();
    return c.json({ ok: true, deleted_pick_order: row.pick_order });
});

// DELETE /picks - reset entire draft results for current season (auth required)
picks.delete("/", authMiddleware, async(c)=>{
    await c.env.DB.prepare("DELETE FROM picks WHERE season_year = ?").bind(SEASON_YEAR).run();
    return c.json({ok: true});
});

export default picks;