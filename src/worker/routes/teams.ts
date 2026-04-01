import { Hono } from "hono";
import { SEASON_YEAR } from "../../config";

const teams = new Hono<{ Bindings: Env }>();

// GET /teams - all teams for given year (defaults to current season)
teams.get("/", async (c) => {
    const year = parseInt(c.req.query('year') ?? '') || SEASON_YEAR;
    const { results } = await c.env.DB.prepare(
        "SELECT * FROM teams WHERE season_year = ? ORDER BY overall_rank"
    ).bind(year).all();
    return c.json(results);
});

export default teams;