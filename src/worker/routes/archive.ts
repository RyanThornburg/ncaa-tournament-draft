import { Hono } from "hono";
import authMiddleware from "../middleware";

const archive = new Hono<{ Bindings: Env }>();

// POST /archive - seal a completed season (auth required)
// Body: { year: number, notes?: string }
archive.post("/", authMiddleware, async (c) => {
    const body = await c.req.json<{ year: number; notes?: string }>();

    if (!body.year || typeof body.year !== "number") {
        return c.json({ error: "missing year" }, 400);
    }
    const { year, notes } = body;

    const existing = await c.env.DB.prepare(
        "SELECT year FROM seasons WHERE year = ?"
    ).bind(year).first();
    if (existing) {
        return c.json({ error: `Season ${year} already archived` }, 409);
    }

    const pickCount = await c.env.DB.prepare(
        "SELECT COUNT(*) as count FROM picks WHERE season_year = ?"
    ).bind(year).first<{ count: number }>();

    if (!pickCount || pickCount.count === 0) {
        return c.json({ error: `No picks found for year ${year}` }, 404);
    }

    await c.env.DB.prepare(
        "INSERT INTO seasons (year, notes) VALUES (?, ?)"
    ).bind(year, notes ?? null).run();

    return c.json({ ok: true, year });
});

export default archive;
