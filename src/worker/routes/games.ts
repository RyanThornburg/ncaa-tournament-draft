import { Hono } from "hono";
import authMiddleware from "../middleware";
import { SEASON_YEAR } from "../../config";

const games = new Hono<{ Bindings: Env }>();

// GET - all games for current year with team names added
games.get("/", async(c)=>{
    const roundParam = c.req.query('round');
    let round: number | null = null;

    if (roundParam !== undefined) {
        round = parseInt(roundParam, 10);
        if (isNaN(round)) return c.json({ error: "invalid round" }, 400);
    }

    const year = parseInt(c.req.query('year') ?? '') || SEASON_YEAR;

    const { results } = await c.env.DB.prepare(`
        SELECT
            g.*,
            t1.name as team_1_name, t1.seed as team_1_seed, t1.region as team_1_region,
            t2.name as team_2_name, t2.seed as team_2_seed, t2.region as team_2_region,
            tw.name as winner_name, tw.seed as winner_seed
        FROM games g
        LEFT JOIN teams t1 on t1.id = g.team_1_id
        LEFT JOIN teams t2 on t2.id = g.team_2_id
        LEFT JOIN teams tw on tw.id = g.winner_team_id
        WHERE g.season_year = ? AND (? IS NULL OR g.round = ?)
        ORDER BY g.round ASC, g.bracket_position_id ASC, g.game_time ASC`
    ).bind(year, round, round).all();
    return c.json(results);
});

// POST - insert or update a game, keyed on external_game_id
// Pass external_game_id directly, or omit it to use bracket_position_id as the key
games.post("/", authMiddleware, async(c) => {
    const body = await c.req.json<{
        bracket_position_id: string;
        region?: string;
        round?: number;
        winner_team_id?: string;
        team_1_id?: string;
        team_2_id?: string;
        team_1_score?: number;
        team_2_score?: number;
        game_time?: string;
        location?: string;
        external_game_id?: string;
        data_source?: string;
        game_status?: string;
        start_time?: string;
        start_date?: string;
        start_time_epoch?: number;
        season_year?: number;
    }>();

    if (body.bracket_position_id === undefined) {
        return c.json({error: "unknown game to update"}, 400);
    }

    const externalGameId = body.external_game_id ?? body.bracket_position_id;

    try {
        const seasonYear = body.season_year ?? SEASON_YEAR;
        await c.env.DB.prepare(`
            INSERT INTO games (
                bracket_position_id, round, region,
                team_1_id, team_2_id, winner_team_id,
                team_1_score, team_2_score,
                game_time, location, external_game_id, data_source,
                game_status, start_time, start_date, start_time_epoch,
                season_year, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
            ON CONFLICT(bracket_position_id, season_year) DO UPDATE SET
                external_game_id = excluded.external_game_id,
                round = excluded.round,
                region = excluded.region,
                team_1_id = excluded.team_1_id,
                team_2_id = excluded.team_2_id,
                winner_team_id = excluded.winner_team_id,
                team_1_score = excluded.team_1_score,
                team_2_score = excluded.team_2_score,
                game_time = excluded.game_time,
                location = excluded.location,
                data_source = excluded.data_source,
                game_status = excluded.game_status,
                start_time = excluded.start_time,
                start_date = excluded.start_date,
                start_time_epoch = excluded.start_time_epoch,
                updated_at = datetime('now')`).bind(
                body.bracket_position_id,
                body.round ?? null,
                body.region ?? null,
                body.team_1_id ?? null,
                body.team_2_id ?? null,
                body.winner_team_id ?? null,
                body.team_1_score ?? null,
                body.team_2_score ?? null,
                body.game_time ?? null,
                body.location ?? null,
                externalGameId,
                body.data_source ?? null,
                body.game_status ?? null,
                body.start_time ?? null,
                body.start_date ?? null,
                body.start_time_epoch ?? null,
                seasonYear
            ).run();
            return c.json({ok: true});
    } catch (e) {
        return c.json({ error: e instanceof Error ? e.message : String(e) }, 500);
    }
});

// DELETE /games/:id - remove a game (auth required)
games.delete("/:id", authMiddleware, async(c)=>{
    const id = c.req.param("id");
    await c.env.DB.prepare("DELETE FROM games where id = ?").bind(id).run();
    return c.json({ok: true});
});

export default games;